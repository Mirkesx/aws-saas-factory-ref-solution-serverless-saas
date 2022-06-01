import { useState } from "react";
import { Grid, Button, ButtonGroup } from "@mui/material";
import CardInput from "../CardInput";
import _ from 'lodash';

const cost_map: any = {
  Individual: {
    monthly: 1,
    yearly: 10,
  },
  Organization: {
    monthly: 5,
    yearly: 50,
  },
};

type PropTypes = {
  onSaveContinueClicked: (userInfo: any) => void;
  userInfo: any;
};

function BankVerificationForm(props: PropTypes) {
  const [selected, setSelected] = useState("monthly");
  const [subscriptionType, setSubscriptionType] = useState(
    props.userInfo.stripeInformation.subscriptionType ||
      props.userInfo.tenantTier.toLowerCase() + "-monthly"
  );

  const [isCardValid, setIsCardValid] = useState(false);

  const tier = props.userInfo.tenantTier || "";
  const price = cost_map[tier][selected] || 0;

  const handleClick = async (event: any) => {
    let userInfo = props.userInfo;
    userInfo.stripeInformation.subscriptionType = subscriptionType;
    props.onSaveContinueClicked(userInfo);
  };

  const handleClickButtonGroup = (type: string) => {
    setSelected(type);
    setSubscriptionType(props.userInfo.tenantTier.toLowerCase() + "-" + type);
  };

  const handleValidation = async (event: any) => {
    if (event.complete){
      setIsCardValid(true);
    } else{
      setIsCardValid(false);
    }
  }

  return (
    <Grid container spacing={1} id="bank-verification-form-container">
    <Grid item xs={12}>
      <p className="bank-verification-form-label">
        Insert a valid card as payment method
      </p>
    </Grid>
      <Grid item xs={12}>
        <CardInput onSaveContinueClicked={handleValidation}/>
      </Grid>
      <Grid item xs={12}>
        <p className="bank-verification-form-label">
          Choose your subscription type
        </p>
      </Grid>
      <Grid
        container
        item
        xs={12}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <ButtonGroup
          id="button-group"
          variant="contained"
          aria-label="button group"
        >
          <Button
            disabled={selected === "monthly"}
            className="button-group-button"
            onClick={() => handleClickButtonGroup("monthly")}
          >
            Monthly
          </Button>
          <Button
            disabled={selected === "yearly"}
            className="button-group-button"
            onClick={() => handleClickButtonGroup("yearly")}
          >
            Yearly
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12}>
        <div>
          <h3>{tier}: {_.capitalize(selected)} plan</h3>
          <h5>30-days trial then it costs ${price}.00 / {selected === 'monthly' ? 'month' : 'year'}</h5>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Button 
          id="submit" 
          variant="contained" 
          fullWidth 
          onClick={handleClick}
          disabled={!isCardValid}
        >
          {"Complete Registration"}
        </Button>
      </Grid>
    </Grid>
  );
}

export default BankVerificationForm;
