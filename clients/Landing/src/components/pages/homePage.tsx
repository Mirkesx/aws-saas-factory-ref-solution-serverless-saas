import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import SignUpToolbar from "../toolbars/SignUpToolbar";
import SignInText from "../SignInText";
import Poster from "../Poster";
import JoinUs from "../JoinUs";
import PersonalInfoForm from "../forms/PersonalInfoForm";
import ResidencyInfoForm from "../forms/ResidencyInfoForm";
import "./../../css/homePage.css";
import BankVerificationForm from "../forms/BankVerificationForm";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { environment } from "../../environments/environment";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const API_URL = `${environment.apiGatewayUrl}`;

function HomePage() {
  const stripe = useStripe();
  const elements = useElements();
  const [openBackdrop, setOpenBackDrop] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [step, setStep] = useState(0);
  const [userInfo, setUserInfo] = useState({
    fullname: "",
    email: "",
    tenantname: "",
    password: "",
    phone: {
      countryCode: "us",
      number: "",
      formattedNumber: "",
    },
    address: {
      city: "",
      state: "",
      country: "",
      line1: "",
      line2: "",
      postal: ""
    },
    country: "",
    bvn: "",
    tenantTier: "",
    stripeInformation: {
      sessionId: "",
      subscriptionType: "",
    },
  });

  const titles = [
    "Join Us",
    `Register your ${userInfo.tenantTier} account!`,
    "Complete Your Profile!",
    "Complete Your Profile!",
  ];
  const messages = [
    "To begin this journey, tell us what type of account you’d be opening.",
    "For the purpose of industry regulation, your details are required.",
    "For the purpose of industry regulation, your details are required.",
    "For the purpose of industry regulation, your details are required.",
  ];

  const handleOnLeftArrowClicked = (newStep: number) => {
    setStep(newStep);
    switch (newStep) {
      case 1:
        setUserInfo((prevState) => ({
          ...prevState,
          phone: {
            countryCode: "us",
            number: "",
            formattedNumber: "",
          },
          address: {
            city: "",
            state: "",
            country: "",
            line1: "",
            line2: "",
            postal: ""
          },
          country: "",
        }));
        break;
      case 2:
        setUserInfo((prevState) => ({
          ...prevState,
          bvn: "",
        }));
        break;
      case 3:
        break;
      default:
        setUserInfo((prevState) => ({
          ...prevState,
          fullname: "",
          email: "",
          password: "",
          tenantname: "",
          tenantTier: "",
        }));
    }
  };

  const handleOnRightArrowClicked = (
    newStep: number,
    newTenantTier: string
  ) => {
    setStep(newStep);
    setUserInfo((prevState) => ({
      ...prevState,
      tenantTier: newTenantTier,
    }));
  };

  const handleOnRegisterAccountClicked = (userInfo: any) => {
    setUserInfo(userInfo);
    setStep(2);
  };

  const handleOnSaveContinueClicked = (userInfo: any) => {
    setUserInfo(userInfo);
    setStep(3);
  };

  const handleSubmitSub = async () => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)!,
      billing_details: {
        email: userInfo.email,
        name: userInfo.fullname,
        phone: userInfo.phone.number,
      },
    });

    if (result.error) {
      //console.log(result.error.message);
      return {
        error: result.error.message,
      };
    } else {
      try {
        const res = await axios.post(API_URL + "stripe", {
          payment_method: result.paymentMethod.id,
          email: userInfo.email,
          name: userInfo.fullname,
          phone: userInfo.phone.number,
          address: userInfo.address,
          lookup_key: userInfo.stripeInformation.subscriptionType,
        });
        // eslint-disable-next-line camelcase
        const { subscription_id, customer_id, price_lookup_key } = res.data;
        return {
          data: {
            subscription_id,
            customer_id,
            price_lookup_key,
            payment_method_id: result.paymentMethod.id,
          },
        };
      } catch (err) {
        return {
          error: err,
        };
      }
    }
  };

  const handleCreateTenantAccount = async (userInfo: any) => {
    setUserInfo(userInfo);
    handleToggleBackDrop();
    const result = await handleSubmitSub();
    //console.log(result);
    if (result && !result.error) {
      //console.log("Subscription created succesfully");
      const tenantDetails = {
        tenantName: userInfo.tenantname.replace(/\s/g, "").toLowerCase(),
        tenantFullName: userInfo.fullname,
        tenantEmail: userInfo.email,
        tenantPassword: userInfo.password,
        tenantPhone: userInfo.phone,
        tenantAddress: JSON.stringify(userInfo.address),
        tenantCountry: userInfo.country,
        tenantStripe: JSON.stringify({
          subscriptionId: result.data!.subscription_id,
          customerId: result.data!.customer_id,
          price_lookup_key: result.data!.price_lookup_key,
          payment_method_id: result.data!.payment_method_id,
        }),
        tenantTier: userInfo.tenantTier === "Individual" ? "Basic" : "Platinum",
      };
      //console.log(tenantDetails);

      //create a post request using API_URL with axios
      axios
        .post(API_URL + "registration", tenantDetails)
        .then((res) => {
          //console.log(res);
          //console.log(res.data);
          setShowSuccess(true);
        })
        .catch((err) => {
          //console.log(err);
          setErrorMessage("Error! " + err.message);
          setShowError(true);
        })
        .finally(() => {
          handleCloseBackDrop();
        });
    } else {
      //console.log("Error while creating subscription");
      setErrorMessage("Error! " + result!.error);
      setShowError(true);
      handleCloseBackDrop();
    }
  };

  const handleCloseBackDrop = () => {
    setOpenBackDrop(false);
  };
  const handleToggleBackDrop = () => {
    setOpenBackDrop(!openBackdrop);
  };

  const formComponent = [
    <JoinUs onRightArrowClicked={handleOnRightArrowClicked} />,
    <PersonalInfoForm
      userInfo={userInfo}
      onRegisterAccountClicked={handleOnRegisterAccountClicked}
    />,
    <ResidencyInfoForm
      userInfo={userInfo}
      onSaveContinueClicked={handleOnSaveContinueClicked}
    />,
    <BankVerificationForm
      userInfo={userInfo}
      onSaveContinueClicked={handleCreateTenantAccount}
    />,
  ];

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={handleCloseBackDrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={0}>
        <Grid item xs={5}>
          <Poster />
        </Grid>
        <Grid item xs={7} style={{ position: "relative" }}>
          {step === 0 ? (
            <SignInText />
          ) : (
            <SignUpToolbar
              step={step}
              onLeftArrowClicked={handleOnLeftArrowClicked}
            />
          )}
          <div id="homepage-container">
            <Grid container justifyContent="center" alignItems="center">
              <Grid item xs={3} />
              <Grid
                container
                item
                xs={5}
                spacing={2}
                direction="column"
                justifyContent="left"
                alignItems="left"
              >
                <Grid item id="homepage-content">
                  <span id="homepage-title">{"" + titles[step]}</span>
                  <span id="homepage-message">{messages[step]}</span>
                  {formComponent[step]}
                  {step >= 2 ? (
                    <div id="homepage-secure-message">
                      <LockIcon />
                      <span>Your info is safely secured</span>
                    </div>
                  ) : (
                    <></>
                  )}
                  {showSuccess && (
                    <Alert
                      onClose={() => setShowSuccess(false)}
                      severity="success"
                    >
                      Tenant Created! You will receive an email with your login
                      details.
                    </Alert>
                  )}
                  {showError && (
                    <Alert onClose={() => setShowError(false)} severity="error">
                      {errorMessage}
                    </Alert>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default HomePage;
