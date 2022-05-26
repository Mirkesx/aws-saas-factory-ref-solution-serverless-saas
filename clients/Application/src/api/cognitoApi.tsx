import Api from "./api";
import BBPromise from "bluebird";
import axios, { AxiosInstance } from "axios";

class CognitoApi extends Api {
  configClient() {
    let userPoolId = localStorage.getItem("userPoolId");
    let region = userPoolId!.split("_")[0];
    const client: AxiosInstance = axios.create({
      baseURL: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/`,
      timeout: 30000,
    });
    return client;
  }
  async getCognitoOidc(): BBPromise<any> {
    return new BBPromise((resolve, reject) => {
      const url = "/.well-known/openid-configuration";
      const params = {};
      this.getClient((axiosClient: AxiosInstance) => {
        axiosClient
          .get(url, { params })
          .then((response: any) => {
            resolve(response);
          })
          .catch((error: any) => {
            resolve(error);
          });
      });
    });
  }
}

export default new CognitoApi();
