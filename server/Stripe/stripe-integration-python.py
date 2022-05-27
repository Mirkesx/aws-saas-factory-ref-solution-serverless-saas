import stripe
import boto3
import json
import uuid

region = os.environ['AWS_REGION']
aws_secret_name = "arn:aws:secretsmanager:{}:640339490701:secret:test/CodeWallet/Stripe-3MrqDy".format(
    region)

client = boto3.client('secretsmanager')
keys = json.loads(client.get_secret_value(SecretId=aws_secret_name)['SecretString'])
public_key = keys['stripe-public']
secret_key = keys['stripe-secret']
stripe.api_key = secret_key


def signup(event, context):
    print(event)
    card_data = event.get('cardData')
    email = event.get('email')
    attributes = event.get('attributes')
    result = create_stripe_customer(email, attributes, card_data)
    return result


def create_stripe_customer(email, user_data, payment_info):
    customer_id = stripe.Customer.create(email=email, metadata=user_data)['id']
    payment_method_id = create_payment_method(payment_info)
    stripe.PaymentMethod.attach(
        payment_method_id,
        customer=customer_id
    )
    return {
        "customer_id": customer_id,
        "plan": create_stripe_plan(customer_id)
    }


def create_payment_method(payment_info):
    return stripe.PaymentMethod.create(
        type="card",
        card={
            "number": payment_info.get('cardNumber'),
            "exp_month": payment_info.get('expirationMonth'),
            "exp_year": payment_info.get('expirationYear'),
            "cvc": payment_info.get('ccv'),
        }).get('id')


def create_stripe_plan(customer_id):
    return stripe.Subscription.create(
        customer=customer_id,
        items=[{
            "plan": "plan_{}".format(uuid.uuid4())
        }]
    ).get("id")
