import { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

type PropTypes = {
    onSaveContinueClicked: (userInfo: any) => void;
    userInfo: any;
};

function ResidencyInfoForm(props: PropTypes) {
  const [phone, setPhone] = useState(props.userInfo.phone || "");
  const [address, setAddress] = useState(props.userInfo.address || "");
  const [country, setCountry] = useState(props.userInfo.country || "none");
  
  const handleOnChangePhoneInput = (value: string, country: any, e: any, formattedValue: string) => {
    let newPhone = {
      countryCode: country.countryCode,
      number: value,
      formattedNumber: formattedValue,
    }
    setPhone(newPhone);
  }

  const handleOnClick = () => {
    let userInfo = props.userInfo;
    userInfo.phone = phone;
    userInfo.address = address;
    userInfo.country = country;
    props.onSaveContinueClicked(userInfo);
  };

  // Have to register the languages you want to use
  countries.registerLocale(enLocale);
  const countryObj = countries.getNames("en", { select: "official" });
  const countryArr = Object.entries(countryObj).map(([key, value]) => {
    return {
      label: value,
      value: key,
    };
  });

  return (
    <Grid container spacing={1} id="residency-info-form-container">
      <Grid item xs={12}>
        <p className="residency-info-form-label">Phone number</p>
      </Grid>
      <Grid item xs={12}>
        <PhoneInput
          country={phone.countryCode}
          value={phone.number}
          inputProps={{
            name: "phone",
            id: "phone",
          }}
          enableSearch={true}
          specialLabel=""
          inputClass="residency-info-phone-number-input"
          onChange={handleOnChangePhoneInput}
        />
      </Grid>
      <Grid item xs={12}>
        <p className="residency-info-form-label">Your address</p>
      </Grid>
      <Grid item xs={12}>
        <TextField
          className="code-wallet-input-text-typography"
          id="address"
          type="text"
          placeholder="Enter your address"
          variant="outlined"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <p className="residency-info-form-label">Country of residence</p>
      </Grid>
      <Grid item xs={12}>
        <Select
          id="country"
          fullWidth
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="code-wallet-input-text-typography"
        >
          <MenuItem disabled value={"none"}>
            <>Please select</>
          </MenuItem>
          {!!countryArr?.length &&
            countryArr.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
        </Select>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleOnClick}
        >
          {"Save & Continue"}
        </Button>
      </Grid>
    </Grid>
  );
}

export default ResidencyInfoForm;
