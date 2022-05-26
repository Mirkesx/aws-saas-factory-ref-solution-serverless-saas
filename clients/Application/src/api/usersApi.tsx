import Api from "./api";
import BBPromise from "bluebird";
import axios, { AxiosInstance } from "axios";
import { environment } from "../environments/environments.prod";
import _ from 'lodash';
import authUtils from "../utils/authUtils";

class UsersApi extends Api {
  configClient(additioalHeaders: any = null) {
    const token = authUtils.getIdToken();
    let headers = { Authorization: "Bearer " + token };
    if (additioalHeaders) {
       _.merge(headers, additioalHeaders);
    }

    const client: AxiosInstance = axios.create({
      baseURL: environment.regApiGatewayUrl,
      timeout: 30000,
      headers,
    });
    return client;
  }
  async getUsersList(): BBPromise<any> {
    return new BBPromise((resolve, reject) => {
      const url = "/users";
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

  async createUser(user: any): BBPromise<any> {
    return new BBPromise((resolve, reject) => {
      const url = "/user";
      const params = user;
      this.getClient((axiosClient: AxiosInstance) => {
        axiosClient
          .post(url, { ...params })
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

export default new UsersApi();
