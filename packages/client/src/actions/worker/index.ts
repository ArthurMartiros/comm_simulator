import { ACTION_TYPES, INTEGRATION_TYPES } from "../../constants";
import { IIntegration, IWorker }           from '@ffn/communicator-tools';
import { Worker }                          from '../../models/Worker';
import { addTaskAction }                   from "../task";

const workers = {};

export const setWorkersAction = (worker?: IWorker[]) => ({
  payload: worker,
  type: ACTION_TYPES.SET_WORKERS
});
export const setIntegrationsAction = (integrations: IIntegration[]) => ({
  payload: integrations,
  type: INTEGRATION_TYPES.SET_INTEGRATIONS
});
export const getWorkers: any = () => {
  return async (dispatch, getState, {commApi}) => {
    const users: IWorker[] = await commApi.getEmployees();
    users.forEach((u) => {
      workers[u.id] = new Worker(u);
    });
    return dispatch(setWorkersAction(users))
  }
};
export const getIntegrations: any = () => {
  return async (dispatch, getState, {commApi}) => {
    const integrations: IIntegration[] = await commApi.getIntegrations();
    return dispatch(setIntegrationsAction(integrations))
  }
};
export const selectWorkerAction = (worker: IWorker) => ({
  payload: worker,
  type: ACTION_TYPES.SELECT_WORKER
});
export const deSelectWorkerAction = (worker: IWorker) => ({
  payload: worker,
  type: ACTION_TYPES.DESELECT_WORKER
});
export const updateWorkerAction = (worker: IWorker) => ({
  payload: {workerId: worker.id, status: worker.status, available: worker.available},
  type: ACTION_TYPES.UPDATE_WORKER,
});
export const logoutWorkerAction = (worker: IWorker) => {
  return async (dispatch) => {
    if(worker.online) {
      await workers[worker.id].ws.logout();
      dispatch({
        payload: {id: worker.id, online: false},
        type: ACTION_TYPES.LOGOUT
      })
    }
  }
};

export const disconnectWorkerAction = (worker: IWorker) => {
  return async () => {
    workers[worker.id].stopWs();
  }
};
export const updateWorkerStatus = (worker, status) => {
  return async (dispatch, state) => {
    await workers[worker.id].ws.setStatus(status);
  }
};
export const acceptTaskAction = (taskId, workerId) => {
  return async () => {
    await workers[workerId].ws.assignTask(taskId, workerId)
  }
};
export const completeTaskAction = (taskId: string, workerId) => {
  return async () => {
    await workers[workerId].ws.completeTask(taskId)
  }
};
export const rejectTaskAction = (taskId: string, workerId) => {
  return async () => {
    await workers[workerId].ws.rejectTask(taskId)
  }
};
export const connectAction = async (worker: IWorker) => {
  workers[worker.id].startWs();
  workers[worker.id].ws.init();
  await workers[worker.id].ws.tryConnect(10000);
};

export const connectWorkerAction = (worker: IWorker) => {
  return async (dispatch) => {
    if(!worker.online) {
      await connectAction(worker);
      dispatch({
        payload: {id: worker.id, online: true},
        type: ACTION_TYPES.CONNECT_WORKER
      })
    }
  }
};
export const loginWorkerAction = (worker: IWorker) => {
  return async () => {
    await workers[worker.id].ws.initialize(worker.id);
  }
};
export const subscribeWorkerAction = (worker: IWorker) => {
  return async (dispatch, state) => {
    const subscribedWorker = await workers[worker.id].ws.subscribe({
      workers: [worker.id],
      workerQueues: [worker.id],
    });
    subscribedWorker.tasks.forEach((t) => {
      dispatch(addTaskAction(worker.id, t))
    })
  }
};

