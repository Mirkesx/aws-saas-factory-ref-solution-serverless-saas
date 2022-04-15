import { useState } from "react";
import { Grid, TextField, Button } from "@mui/material";
import "react-phone-input-2/lib/material.css";

type PropTypes = {
  onSaveContinueClicked: (userInfo: any) => void;
  userInfo: any;
};

function BankVerificationForm(props: PropTypes) {
  const [bvn, setBvn] = useState(props.userInfo.bvn || "");

  const handleClick = () => {
    let userInfo = props.userInfo;
    userInfo.bvn = bvn;
    props.onSaveContinueClicked(userInfo);
  };
  return (
    <Grid container spacing={1} id="bank-verification-form-container">
      <Grid item xs={12}>
        <p className="bank-verification-form-label">
          Bank verification number (BVN)
        </p>
      </Grid>
      <Grid item xs={12}>
        <TextField
          className="code-wallet-input-text-typography"
          id="bvn"
          type="text"
          placeholder="Enter your BVN"
          variant="outlined"
          fullWidth
          value={bvn}
          onChange={(e) => setBvn(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" fullWidth onClick={handleClick}>
          {"Save & Continue"}
        </Button>
      </Grid>
    </Grid>
  );
}

export default BankVerificationForm;
