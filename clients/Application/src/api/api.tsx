import axios, { AxiosInstance } from "axios";
import { IRestResponse, IDataResponse } from "../interfaces/rest";
import BBPromise from "bluebird";
// import _ from "lodash";

BBPromise.config({ cancellation: true });

export default class Api {
  axiosClient: any = null;
  configClient(additioalHeaders: any = null) {
    // const token = authutils.getToken();
    // let headers = { Authorization: "BEARER " + token };
    // if (additioalHeaders) {
    //   _.merge(headers, additioalHeaders);
    // }

    const client: AxiosInstance = axios.create({
      baseURL: this.baseUrl(),
      timeout: 30000,
      //   headers,
    });
    return client;
  }

  getClient(
    callback: (client: AxiosInstance) => void,
    additionalHeaders: any = null
    // refreshToken = Constants.jwt.TOKEN_AUTOREFRESH_ACTIVE
  ) {
    // const token = authutils.getToken();
    const client: AxiosInstance = this.configClient(additionalHeaders);
    // const tokenIsExpiring = Constants.jwt.TOKEN_LOOKAHEAD_ACTIVE
    //   ? authutils.isTokenExpiresIn(Constants.jwt.TOKEN_LOOKAHEAD_SECS)
    //   : true;

    // if (token && tokenIsExpiring && refreshToken) {
    //   this.refreshToken(client).then((client: AxiosInstance) => {
    //     callback(client);
    //   });
    // } else {
    //   if (token) {
    //     Helpers.log("Token is still fine: I do not refresh it...");
    //   } else {
    //     Helpers.log("Token not set!");
    //   }
    //   try {
    //     callback(client);
    //   } catch (error) {
    //     Helpers.log(error);
    //   }
    // }
    try {
      callback(client);
    } catch (error) {
      console.log(error);
    }
  }

  baseUrl() {
    const location = window.location;
    const baseurl = location.protocol + "//" + location.host;

    return baseurl;
  }

  getResponseData(response: IRestResponse): IDataResponse | null {
    if (!response) {
      return null;
    }
    const data = response.data;
    return data;
  }

  getResponsePayload(response: IRestResponse): any {
    if (response && this.getResponseData(response)) {
      return this.getResponseData(response)!.payload;
    }
    return null;
  }

  getResponseMessage(response: IRestResponse): any {
    if (response && this.getResponseData(response)) {
      return this.getResponseData(response)!.message;
    }
    return null;
  }

  getDataStatus(response: IRestResponse): any {
    if (response && this.getResponseData(response)) {
      return this.getResponseData(response)!.status;
    }
    return null;
  }

  generateFakeResponse(
    payload: any,
    status: "success" | "error",
    reststatus = 200
  ): IRestResponse {
    const response: IRestResponse = {
      config: null,
      headers: null,
      request: null,
      status: reststatus,
      statusText: "",
      data: {
        status,
        error: "",
        message: "",
        payload,
      },
    };
    return response;
  }
}
