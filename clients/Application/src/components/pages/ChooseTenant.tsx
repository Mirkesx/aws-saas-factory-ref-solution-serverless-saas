import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TenantsApi from "../../api/tenantsApi";
import CognitoApi from "../../api/cognitoApi";
import { useAppDispatch } from "../../store/hooks";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { login } from "../../store/reducers/authSlice";

function ChooseTenant() {
  const dispatch = useAppDispatch();
  const [tenants, setTenants] = useState([]);
  const [tenantName, setTenantName] = useState("none");
  const [cognitoUrl, setCognitoUrl] = useState("");
  const [openBackDrop, setOpenBackDrop] = useState(false);
  useEffect(() => {
    TenantsApi.getTenantsNames()
      .then((response: any) => {
        setTenants(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });

    if (window.location.hash && window.location.hash.length > 0) {
      let lochash = window.location.hash.substring(1);
      let reformatted_hash = lochash
        .split("&")
        .map((v: string) => v.split("="))
        .reduce((acc: any, v: string[]) => {
          localStorage.setItem(v[0], v[1]);
          acc[v[0]] = v[1];
          return acc;
        }, {});
      dispatch(
        login({
          access_token: reformatted_hash.access_token,
          id_token: reformatted_hash.id_token,
        })
      );
    }
  }, []);

  useEffect(() => {
    if (tenantName !== "none") {
      TenantsApi.getTenantConfig(tenantName)
        .then((response: any) => {
          //console.log(response.data);
          setTenantConfig(response.data);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }, [tenantName]);

  function setTenantConfig(tenantConfig: any) {
    localStorage.setItem("userPoolId", tenantConfig.userPoolId);
    localStorage.setItem("appClientId", tenantConfig.appClientId);
    localStorage.setItem("apiGatewayUrl", tenantConfig.apiGatewayUrl);
    localStorage.setItem("tenantTier", tenantConfig.tenantTier);
    CognitoApi.getCognitoOidc()
      .then((response: any) => {
        createCognitoUrl(response.data);
        //console.log(response);
      })
      .catch((error: any) => {
        console.log(error);
      })
      .finally(() => {
        setOpenBackDrop(false);
      });
  }

  function createCognitoUrl(oidc: any) {
    const url = oidc.authorization_endpoint;
    const clientId = localStorage.getItem("appClientId");
    const redirectUrl = window.location.href;
    const state = "state";
    const responseType = "token";
    const scope = "openid";
    const queryParams = `?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=${responseType}&scope=${scope}&state=${state}`;
    //console.log(url+queryParams);
    setCognitoUrl(url + queryParams);
  }

  function handleOnSelect(tenantName: string) {
    setCognitoUrl("");
    setTenantName(tenantName);
    setOpenBackDrop(true);
  }

  return (
    <div className="page-panel login-page">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={openBackDrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ height: "100%" }}
      >
        <Grid item xs={3}>
          <Select
            value={tenantName}
            fullWidth
            onChange={(e) => handleOnSelect(e.target.value)}
          >
            <MenuItem disabled value={"none"}>
              <>Please select</>
            </MenuItem>
            {tenants.map((tenant: any, key: any) => (
              <MenuItem key={key} value={tenant.tenantName}>
                {tenant.tenantName}
              </MenuItem>
            ))}
          </Select>
          {tenantName !== "none" && cognitoUrl.length > 0 && (
            <a href={cognitoUrl}>Sign in</a>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default ChooseTenant;
