import { useState } from "react";
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
import Alert from '@mui/material/Alert';
import { environment } from "../../environments/environment";

function HomePage() {
  const [openBackdrop, setOpenBackDrop] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [step, setStep] = useState(0);
  const [userInfo, setUserInfo] = useState({
    fullname: "",
    email: "",
    password: "",
    phone: {
      countryCode: "us",
      number: "",
      formattedNumber: "",
    },
    address: "",
    country: "",
    bvn: "",
    tenantTier: "",
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
          address: "",
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
    console.log(userInfo);
    setStep(2);
  };

  const handleOnSaveContinueClicked = (userInfo: any) => {
    setUserInfo(userInfo);
    setStep(3);
  };

  const handleCreateTenantAccount = (userInfo: any) => {
    setUserInfo(userInfo);
    const API_URL = `${environment.apiGatewayUrl}` + "registration";
    //const API_URL = "https://httpdump.io/ekekx";
    const tenantDetails = {
      tenantName: userInfo.fullname.replace(/\s/g, "").toLowerCase(),
      tenantFullName: userInfo.fullname,
      tenantEmail: userInfo.email,
      tenantPassword: userInfo.password,
      tenantPhone: userInfo.phone,
      tenantAddress: userInfo.address,
      tenantCountry: userInfo.country,
      tenantBvn: userInfo.bvn,
      tenantTier: userInfo.tenantTier === "Individual" ? "Basic" : "Platinum",
    };

    //create a post request using API_URL with axios
    handleToggleBackDrop();
    axios
      .post(API_URL, tenantDetails)
      .then((res) => {
        console.log(res);
        console.log(res.data);
        setShowSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setShowError(true);
      })
      .finally(() => {
        handleCloseBackDrop();
      });
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
                  {showSuccess && <Alert onClose={() => setShowSuccess(false)} severity="success">Tenant Created! You will receive an email with your login details.</Alert>}
                  {showError && <Alert onClose={() => setShowError(false)} severity="error">Error! Tenant not created!</Alert>}
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
