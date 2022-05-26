import { useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import "../../css/LateralMenu.css";
import {
  sign_icon,
  verify_icon,
  signed_icon,
  add_icon,
  account_icon,
  settings_icon,
} from "../../icons/LateralMenuIcons";

function LateralMenu(props: any) {
  const [activeTab, setActiveTab] = useState(props.history.location.pathname.length > 1 ? props.history.location.pathname.substr(1) : "sign-file");
  const items = [
    {
      title: "Sign a file",
      icon: sign_icon,
      type: "sign-file",
      function: () => {
        props.history.push("/sign-file");
        setActiveTab("sign-file");
      },
    },
    {
      title: "Verify a signed file",
      icon: verify_icon,
      type: "verify-file",
      function: () => {
        props.history.push("/verify-file");
        setActiveTab("verify-file");
      },
    },
    {
      title: "signed files",
      icon: signed_icon,
      type: "signed-files",
      function: () => {
        props.history.push("/signed-files");
        setActiveTab("signed-files");
      },
    },
    {
      title: "add a certificate",
      icon: add_icon,
      type: "add-certificate",
      function: () => {
        props.history.push("/add-certificate");
        setActiveTab("add-certificate");
      },
    },
    {
      title: "account",
      icon: account_icon,
      type: "account",
      function: () => {
        props.history.push("/account");
        setActiveTab("account");
      },
    },
    {
      title: "settings",
      icon: settings_icon,
      type: "settings",
      function: () => {
        props.history.push("/settings");
        setActiveTab("settings");
      },
    },
  ];

  return (
    <Box className="lateral-menu">
      <Stack spacing={2}>
        {items.map((item, index) => {
          return (
            <div key={index} onClick={item.function} className={item.type === activeTab ? "item active" : "item "}>
              <div className="icon">{item.icon}</div>
              <div className="title">{item.title}</div>
            </div>
          );
        })}
      </Stack>
    </Box>
  );
}

export default LateralMenu;
