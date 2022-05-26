import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useAppSelector } from "../../../store/hooks";
import DetailsMenu from "./DetailsMenu";
import AuthUtils from "../../../utils/authUtils";
import CognitoApi from "../../../api/cognitoApi";
import TenantsApi from "../../../api/tenantsApi";
import { useAppDispatch } from "../../../store/hooks";
import { logout } from "../../../store/reducers/authSlice";

function TenantUserDetails(props: any) {
  const id_token = useAppSelector((state) => state.auth.id_token);
  const access_token = useAppSelector((state) => state.auth.access_token);
  const [menuOpen, setMenuOpen] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [userName, setUserName] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (access_token) {
      const payload: any = AuthUtils.getAccessTokenPayload();
      setUserName(payload["username"]);
    }
  }, [access_token]);

  useEffect(() => {
    if (id_token && !localStorage.getItem("tenantName")) {
      const payload: any = AuthUtils.getIdTokenPayload();
      TenantsApi.getTenantsNames()
        .then((response: any) => {
          const tenants = response.data;
          const tenantName = tenants.find(
            (tenant: any) => tenant.tenantId === payload["custom:tenantId"]
          )["tenantName"];
          localStorage.setItem("tenantName", tenantName);
          setTenantName(tenantName);
        })
        .catch((error: any) => {
          console.log(error);
        });
    } else if (localStorage.getItem("tenantName") !== null) {
      setTenantName(localStorage.getItem("tenantName")!);
    }
  }, [id_token]);

  const menus = [
    {
      title: tenantName || "",
      class: "tenant-name",
      labels: [
        {
          title: "Test TenantName",
          function: () => {
            console.log("Test");
            closeMenu();
          },
        },
      ],
    },
    {
      title: userName || "",
      class: "user-name",
      labels: [
        {
          title: "Logout",
          function: () => {
            CognitoApi.getCognitoOidc()
              .then((response: any) => {
                dispatch(logout());
                const url = response.data.authorization_endpoint.replace("/oauth2/authorize", "/logout");
                const clientId = localStorage.getItem("appClientId");
                const redirectUrl = `${window.location.origin}/login`;
                const queryParams = `?client_id=${clientId}&logout_uri=${redirectUrl}`;
                AuthUtils.performLogout();
                closeMenu();
                window.location.href = `${url}${queryParams}`;
              })
              .catch((error: any) => {
                console.log(error);
              });
          },
        },
      ],
    },
  ];

  const closeMenu = () => {
    setMenuOpen("");
    setAnchorEl(null);
  };

  return (
    <div className="tenant-user-details">
      {menus.map((item, index) => {
        return (
          <div className={"text " + item.class} key={index}>
            <Button
              variant="text"
              className="title"
              style={{ color: "white" }}
              onClick={(event) => {
                setMenuOpen(item.class);
                setAnchorEl(event.currentTarget);
              }}
              endIcon={<KeyboardArrowDownIcon style={{ color: "white" }} />}
            >
              {item.title}
            </Button>
            <DetailsMenu
              anchorEl={anchorEl!}
              isOpen={item.class === menuOpen ? true : false}
              items={item.labels}
              handleOnClose={() => {
                closeMenu();
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default TenantUserDetails;
