import { CommunicatorApi, ITask } from "@ffn/communicator-tools";
import { localStore }             from "./LocalStore";

class SimCommunicatorApi extends CommunicatorApi {

  constructor() {
    super(localStore);
    this.store.redirectUri = window.origin;
    this.store.logoutRedirectUrl = `${window.origin}/?logout=true`;
  }

  async getIntegrations() {
    const res = await this.get('/api/integration');
    return res.body;
  }

  async createTask(task: ITask) {
    await this.post('/api/task', {body: task});
  }

  async createContact() {
    return this.post('/api/contact', {
      body: {
        phones: [
          {number: "+11199337755"}
        ]
      }
    });
  }
}

export const commApi = new SimCommunicatorApi();