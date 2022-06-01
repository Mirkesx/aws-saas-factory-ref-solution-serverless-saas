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
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [address1, setAddress1] = useState(props.userInfo.address.line1 || "");
  const [isAddress1Valid, setIsAddress1Valid] = useState(false);
  const [address2, setAddress2] = useState(props.userInfo.address.line2 || "");
  const [city, setCity] = useState(props.userInfo.address.city || "");
  const [isCityValid, setIsCityValid] = useState(false);
  const [postal, setPostal] = useState(props.userInfo.address.postal || "");
  const [isPostalValid, setIsPostalValid] = useState(false);
  const [state, setState] = useState(props.userInfo.address.state || "");
  const [isStateValid, setIsStateValid] = useState(false);
  const [country, setCountry] = useState(props.userInfo.country || "none");
  const [isCountryValid, setIsCountryValid] = useState(false);
  
  const handleOnChangePhoneInput = (value: string, country: any, e: any, formattedValue: string) => {
    let newPhone = {
      countryCode: country.countryCode,
      number: value,
      formattedNumber: formattedValue,
    }

    if (newPhone.number.length >= 7 && newPhone.number.length <= 12){
      setIsPhoneValid(true);
    } else{
      setIsPhoneValid(false);
    }
    console.log()
    setPhone(newPhone);
  }

  const handleOnClick = () => {
    let userInfo = props.userInfo;
    userInfo.phone = phone;
    userInfo.address = {
      city: city,
      state: state,
      country: country,
      line1: address1,
      line2: address2,
      postal: postal,
    };
    userInfo.country = country;
    props.onSaveContinueClicked(userInfo);
  };

//form validation functions
  const handlePostalCode = (postal: string) => {//<-----
    if (/^[0-9]+$/.test(postal) && postal.length >= 5 && postal.length <= 10){
      setIsPostalValid(true);
    } else{
      setIsPostalValid(false);
    }
    setPostal(postal);
  };

  const handleCity = (city: string) => {
    if(city){//futher conditions can be implemented
      setIsCityValid(true);
    } else{
      setIsCityValid(false);
    }
    setCity(city);
  };

  const handleAddress1 = (address1: string) => {
    if(address1){//futher conditions can be implemented
      setIsAddress1Valid(true);
    } else{
      setIsAddress1Valid(false);
    }
    setAddress1(address1);
  };

  const handleState = (state: string) => {
    const minStateName = 4;
    if(state.length >= minStateName){
      setIsStateValid(true);
    } else{
      setIsStateValid(false);
    }
    setState(state);
  };

  const handleCountry = (country: any) => {
    if(country){
      setIsCountryValid(true);
    } else{
      setIsCountryValid(false);
    }
    setCountry(country);
  }
//////


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
        <p className="residency-info-form-label">Phone number*</p>
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
          id="city"
          type="text"
          placeholder="City*"
          variant="outlined"
          value={city}
          onChange={(e) => handleCity(e.target.value)}
          style={{width: "30%"}}
        />
        <TextField
          className="code-wallet-input-text-typography"
          id="state"
          type="text"
          placeholder="State, Province or Region*"
          variant="outlined"
          value={state}
          onChange={(e) => handleState(e.target.value)}
          style={{width: "45%"}}
        />
        <TextField
          className="code-wallet-input-text-typography"
          id="postal-code"
          type="text"
          placeholder="Postal Code*"
          variant="outlined"
          value={postal}
          onChange={(e) => handlePostalCode(e.target.value)}
          style={{width: "25%"}}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          className="code-wallet-input-text-typography"
          id="address-1"
          type="text"
          placeholder="Street, Avenue, Company Name, etc.*"
          variant="outlined"
          value={address1}
          onChange={(e) => handleAddress1(e.target.value)}
          fullWidth
        />
        <TextField
          className="code-wallet-input-text-typography"
          id="address-2"
          type="text"
          placeholder="Apartment, Unit, Building, Floor, etc."
          variant="outlined"
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <p className="residency-info-form-label">Country of residence*</p>
      </Grid>
      <Grid item xs={12}>
        <Select
          id="country"
          fullWidth
          value={country}
          onChange={(e) => handleCountry(e.target.value)}
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
          disabled = {(!isPostalValid) || (!isCityValid) || (!isAddress1Valid) || (!isStateValid) || (!isCountryValid) || (!isPhoneValid)}
        >
          {"Save & Continue"}
        </Button>
      </Grid>
    </Grid>
  );
}

export default ResidencyInfoForm;
