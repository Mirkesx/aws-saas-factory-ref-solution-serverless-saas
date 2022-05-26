import Api from "./api";
import BBPromise from "bluebird";
import axios, { AxiosInstance } from "axios";
import { environment } from "../environments/environments.prod";

class TenantsApi extends Api {
  configClient(additioalHeaders: any = null) {
    // const token = authutils.getToken();
    // let headers = { Authorization: "BEARER " + token };
    // if (additioalHeaders) {
    //   _.merge(headers, additioalHeaders);
    // }

    const client: AxiosInstance = axios.create({
      baseURL: environment.regApiGatewayUrl,
      timeout: 30000,
      //   headers,
    });
    return client;
  }
  async getTenantsNames(): BBPromise<any> {
    return new BBPromise((resolve, reject) => {
      const url = "/tenants-names";
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

  async getTenantConfig(tenantName: string): BBPromise<any> {
    return new BBPromise((resolve, reject) => {
      const url = `/tenant/init/${tenantName}`;
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

export default new TenantsApi();
