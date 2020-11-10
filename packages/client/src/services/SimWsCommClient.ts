import { WsCommClient } from "@ffn/communicator-tools";

export class SimWsCommClient extends WsCommClient {
  public async initialize(asUser?: string) {
    const result = await this.sendRequest('initialize', {
      accessToken: this.store.accessToken,
      idToken: this.store.idToken,
      refreshToken: this.store.refreshToken,
      asUser,
    });
    return result.body;
  }

  public destructWs() {
    this.destruct();
  }
}