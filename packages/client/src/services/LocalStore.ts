import { IEmployee, ls, Store } from "@ffn/communicator-tools";

export class LocalStore implements Store {
  @ls
  accessToken: string;
  @ls
  authCode: string;
  deviceId: string;
  @ls
  idToken: string;
  @ls
  logoutRedirectUrl: string;
  @ls
  logoutUrl: string;
  @ls
  redirectUri: string;
  @ls
  refreshToken: string;
  @ls
  serverUrl: string;
  @ls
  wsUrl: string;
  subscribed: string;
  user: IEmployee;
  version: string;
  @ls
  contactId: string;
}

export const localStore = new LocalStore();