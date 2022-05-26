import jwt_decode from "jwt-decode";
import * as Constants from "../constants";
import moment from "moment";

class AuthUtils {
  getAccessToken() {
    return localStorage.getItem(Constants.jwt.AUTHTOKEN_NAME) || null;
  }

  getIdToken() {
    return localStorage.getItem(Constants.jwt.IDAUTHTOKEN_NAME) || null;
  }

  setToken(token: any) {
    localStorage.setItem(Constants.jwt.AUTHTOKEN_NAME, token);
  }

  deleteAccessToken() {
    localStorage.removeItem(Constants.jwt.AUTHTOKEN_NAME);
  }

  performLogout() {
    localStorage.clear();
  }

  getAccessTokenPayload() {
    const token = this.getAccessToken();
    const payload = jwt_decode(token!);
    return payload;
  }

  getIdTokenPayload() {
    const token = this.getIdToken();
    const payload = jwt_decode(token!);
    return payload;
  }

  getTokenExpirationDate(ishuman = false) {
    const token: any = this.getAccessTokenPayload(); //either one of them is fine, because they have same expiration time
    let expDate = null;
    if (token) {
      expDate = ishuman ? moment(token.exp * 1000).format() : token.exp;
    }
    return expDate;
  }

  getTokenTimeToExpire() {
    const exp = this.getTokenExpirationDate();
    return exp ? moment(exp * 1000).fromNow(true) : 0;
  }

  checkToken() {
    const token = this.getAccessToken();
    if (token) {
      const expired = this.isTokenExpired();
      if (expired) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  isTokenExpiresIn(secs: number) {
    const expDate = this.getTokenExpirationDate();
    if (!expDate) return true;
    const time = moment().add(secs, "s").unix();
    return expDate < time;
  }

  isTokenExpired() {
    return this.isTokenExpiresIn(0);
  }
}

const authUtils = new AuthUtils();
export default authUtils;