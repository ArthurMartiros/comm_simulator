import { qsParse }    from '@ffn/communicator-tools';
import { commApi }    from "./SimCommunicatorApi";
import { localStore } from "./LocalStore";

class AuthService {

  public async login() {
    const {location} = window;
    const query: any = qsParse(location.search);
    if (query.code) {
      localStore.authCode = query.code;
    }
    const res = await commApi.login();
    if (res.accessToken) {
      if (query.code) {
        localStore.authCode = '';
      }
    } else if (res.redirectUrl) {
      location.href = res.redirectUrl;
    }
    return true;
  }

  public logout() {
    localStore.accessToken = void 0;
    localStore.idToken = void 0;
    localStore.refreshToken = void 0;
    window.location.href = localStore.logoutUrl;
  }
}

export const auth = new AuthService();