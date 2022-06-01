import { useState } from "react";
import {
  Grid,
  TextField,
  Checkbox,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const label = { inputProps: { "aria-label": "Accept Terms&Condition" } };

type PropTypes = {
  onRegisterAccountClicked: (userInfo: any) => void;
  userInfo: any;
};

function PersonalInfoForm(props: PropTypes) {
  const [showPassword, setShowPassword] = useState(false);
  const [fullname, setFullname] = useState(props.userInfo.fullname || "");
  const [errorFullname, setErrorFullname] = useState("");
  const [email, setEmail] = useState(props.userInfo.email || "");
  const [errorEmail, setErrorEmail] = useState("");
  const [tenantname, setTenantname] = useState(props.userInfo.tenantname || "");
  const [errorTenantname, setErrorTenantname] = useState("");
  const [password, setPassword] = useState(props.userInfo.password || "");
  const [checked, setChecked] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  

  const handleOnClick = () => {
    let userInfo = props.userInfo;
    userInfo.fullname = fullname;
    userInfo.email = email;
    userInfo.tenantname = tenantname;
    userInfo.password = password;
    props.onRegisterAccountClicked(userInfo);
  };

  const handleOnChangeEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase())) {
      setErrorEmail("");
      setEmail(email);
    } else {
      setErrorEmail("Invalid email");
      setEmail(email);
    }
  };

//new validation functions
  const handleOnChangeFullname = (fullname: string ) =>{
    if (fullname){//just not empty. further conditions can be applied
      setErrorFullname("");
    } else{
      setErrorFullname("Invalid fullname");
    }
    setFullname(fullname);
  }

  const handleOnChangeTenantname = (tenantname: string ) =>{
    const format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    const minChar = 4;
    const maxChar = 15;

    if (tenantname.length >= minChar && tenantname.length <= maxChar && (!tenantname.match(format))){
      setErrorTenantname("");
    } else{
      setErrorTenantname("Tenant name should be 4-15  characters and shouldn't include any special character!");
    }
    setTenantname(tenantname);
  }
//

  return (
    <Grid container spacing={1} id="personal-info-form-container">
      {[
        {
          id: "fullname",
          label_text: "Your fullname*",
          type: "text",
          placeholder: "Enter your fullname",
          value: fullname,
          setFunction: handleOnChangeFullname,
          helperText: errorFullname || "",
        },
        {
          id: "email",
          label_text: "Email Address*",
          type: "email",
          placeholder: "Enter your email address",
          value: email,
          setFunction: handleOnChangeEmail,
          helperText: errorEmail || "",
        },
        {
          id: "tenantname",
          label_text: "Tenant Name*",
          type: "text",
          placeholder: "Enter your tenant name",
          value: tenantname,
          setFunction: handleOnChangeTenantname,
          helperText: errorTenantname || "",
        },
        // {
        //   id: "password",
        //   label_text: "Create Password*",
        //   type: "password",
        //   placeholder: "Enter your password",
        //   value: password,
        //   setFunction: setPassword,
        //   helperText: "",
        // },
      ].map((item, index) => {
        return (
          <>
            <Grid item xs={12}>
              <p className="personal-info-form-label">{item.label_text}</p>
            </Grid>
            <Grid item xs={12}>
              <TextField
                className="code-wallet-input-text-typography"
                id={item.id}
                type={
                  item.type === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : item.type
                }
                placeholder={item.placeholder}
                variant="outlined"
                value={item.value || ""}
                fullWidth
                required
                onChange={(e) => item.setFunction(e.target.value)}
                error={item.helperText !== ""}
                helperText={item.helperText}
                InputProps={{
                  endAdornment:
                    item.type === "password" ? (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                }}
              />
            </Grid>
          </>
        );
      })}
      <Grid item xs={12}>
        <Checkbox
          {...label}
          checked={checked}
          onChange={() => setChecked(!checked)}
        />{" "}
        <span className="personal-info-form-label">
          I agree to terms {"&"} conditions
        </span>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          fullWidth
          disabled={((!checked) || (!fullname) || (errorEmail.length > 1 || !email ) || (errorTenantname.length > 1 || !tenantname) )}
          onClick={handleOnClick}
        >
          Register Account
        </Button>
      </Grid>
    </Grid>
  );
}

export default PersonalInfoForm;
