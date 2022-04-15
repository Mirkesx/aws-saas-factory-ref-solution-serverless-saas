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
  const [email, setEmail] = useState(props.userInfo.email || "");
  const [password, setPassword] = useState(props.userInfo.password || "");
  const [checked, setChecked] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleOnClick = () => {
    let userInfo = props.userInfo;
    userInfo.fullname = fullname;
    userInfo.email = email;
    userInfo.password = password;
    props.onRegisterAccountClicked(userInfo);
  };

  return (
    <Grid container spacing={1} id="personal-info-form-container">
      {[
        {
          id: "fullname",
          label_text: "Your fullname*",
          type: "text",
          placeholder: "Enter your fullname",
          value: fullname,
          setFunction: setFullname,
        },
        {
          id: "email",
          label_text: "Email Address*",
          type: "email",
          placeholder: "Enter your email address",
          value: email,
          setFunction: setEmail,
        },
        {
          id: "password",
          label_text: "Create Password*",
          type: "password",
          placeholder: "Enter your password",
          value: password,
          setFunction: setPassword,
        },
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
          disabled={!checked}
          onClick={handleOnClick}
        >
          Register Account
        </Button>
      </Grid>
    </Grid>
  );
}

export default PersonalInfoForm;
