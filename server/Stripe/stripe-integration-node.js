const AWS = require('aws-sdk');
AWS.config.region = process.env['Region'];
const sm = new AWS.SecretsManager();
const secretName = process.env['STRIPE_SECRETS_MANAGER_ARN'];

const getSecrets = async (SecretId) => {
    return await new Promise((resolve, reject) => {
        sm.getSecretValue({ SecretId }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};

const main = async (event) => {
    try {
        console.log("Event: ", event);
        const secrets = JSON.parse((await getSecrets(secretName))["SecretString"]);

        const { email, phone, name, lookup_key, payment_method, address } = JSON.parse(event.body);

        const stripe = require("stripe")(secrets["stripe_secret_key"]);

        let customer;
        const resultFindUserByEmail = await stripe.customers.list({ email: email });
        if (resultFindUserByEmail.data.length > 0) {
            console.log("User found");
            customer = resultFindUserByEmail.data[0];
        }
        else {
            console.log("Customer not found, creating new customer");
            customer = await stripe.customers.create({
                payment_method: payment_method,
                name: name,
                phone: phone,
                email: email,
                invoice_settings: {
                    default_payment_method: payment_method,
                },
                address: address ? {
                    line1: address.line1 || "",
                    line2: address.line2 || "",
                    city: address.city || "",
                    state: address.state || "",
                    postal_code: address.postal_code || "",
                    country: address.country || ""
                } : null
            });
        }

        const prices = await stripe.prices.list({
            lookup_keys: [lookup_key],
            expand: ['data.product'],
        });

        let subscription;
        const resultFindSubscription = await stripe.subscriptions.list({ customer: customer.id, price: prices.data[0].id });
        if (resultFindSubscription.data.length > 0) {
            console.log("Subscription found");
            subscription = resultFindSubscription.data[0];
        }
        else {
            console.log("Subscription not found, creating new subscription");
            subscription = await stripe.subscriptions.create({
                customer: customer.id,
                items: [{ price: prices.data[0].id }],
                expand: ['latest_invoice.payment_intent'],
                trial_period_days: 30
            });
        }
        //console.log(lookup_key);

        //const status = subscription['latest_invoice']['payment_intent']['status'] 
        //const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type, Origin, X-Requested-With, Accept, Authorization, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Allow-Origin",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
            },
            "body": JSON.stringify(
                { 'subscription_id': subscription.id, 'customer_id': customer.id, 'price_lookup_key': prices.data[0].lookup_key }
            )
        };
    } catch (e) {
        console.log(e)
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Headers": "Content-Type, Origin, X-Requested-With, Accept, Authorization, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Allow-Origin",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
            },
            "body": JSON.stringify(e)
        };
    }
}



exports.handler = main;