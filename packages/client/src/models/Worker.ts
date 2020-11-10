import { bound, IEmployee, IEmployeeSettings, IPriorityQueue, SubscriptionTypes } from "@ffn/communicator-tools";
import { LocalStore }                                                             from "../services/LocalStore";
import { SimWsCommClient }                                                        from "../services/SimWsCommClient";
import { store }                                                                  from "../store";
import { addTaskAction, removeTaskAction, updateTaskAction }                      from "../actions/task";
import { updateWorkerAction }                                                     from "../actions/worker";

export class Worker implements IEmployee {
  readonly id: string;
  readonly deviceId: string;
  readonly username: string;
  integrationId: string;
  priorityQueues: Map<number, IPriorityQueue>;
  currentPriority: number;
  role: string;
  name: string;
  status: string;
  available: boolean;
  online: boolean;

  public readonly store: LocalStore;
  public ws: SimWsCommClient;

  public startWs() {
    if (this.ws) {
      this.stopWs();
    }
    this.ws = new SimWsCommClient(this.store);
    this.ws.broadcastMessage.attach(this.onBroadcastMessage);
  }

  public stopWs() {
    this.ws.broadcastMessage.detach(this.onBroadcastMessage);
    this.ws.stopCheckHeartbeat();
    this.ws.close();
    this.ws.destructWs();
    this.ws = null;
  }

  @bound
  protected onBroadcastMessage(message) {
    console.info(this.username, message);
    switch (message.type) {
      case SubscriptionTypes.TaskAdded:
        store.dispatch(addTaskAction(this.id, message.data));
        break;
      case SubscriptionTypes.TaskUpdated:
        store.dispatch(updateTaskAction(this.id, message.data));
        break;
      case SubscriptionTypes.TaskRemoved:
        store.dispatch(removeTaskAction(this.id, message.data));
        break;
      case SubscriptionTypes.WorkerUpdated:
        store.dispatch(updateWorkerAction(message.data));
        break;
    }
  }

  constructor(opts) {
    this.id = opts.id;
    this.username = opts.username;
    this.integrationId = opts.integrationId;
    this.role = opts.role;
    this.name = opts.name;
    this.status = opts.status;
    this.available = opts.available;
    this.online = opts.online;
    this.deviceId = opts.deviceId;
    this.store = new LocalStore();
    if (!this.deviceId) {
      this.store.deviceId = this.deviceId = `${this.username}-${window.localStorage.getItem('deviceId')}`;
    }
  }

  internalNumber: string;
  isRemoved: boolean;
  isTest: boolean;
  readonly oktaId: string;
  phone: string;
  settings: IEmployeeSettings;


}