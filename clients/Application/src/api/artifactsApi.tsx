import Api from "./api";
import BBPromise from "bluebird";
import axios, { AxiosInstance } from "axios";
import _ from 'lodash';
import authUtils from "../utils/authUtils";

class ArtifactsApi extends Api {
  configClient(additioalHeaders: any = null) {
    const token = authUtils.getIdToken();
    let headers = { Authorization: "Bearer " + token };
    if (additioalHeaders) {
       _.merge(headers, additioalHeaders);
    }

    const client: AxiosInstance = axios.create({
      baseURL: localStorage.getItem("apiGatewayUrl")!,
      timeout: 30000,
      headers,
    });
    return client;
  }
  async getArtifacts(): BBPromise<any> {
    return new BBPromise((resolve, reject) => {
      const url = "/artifacts";
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

export default new ArtifactsApi();
