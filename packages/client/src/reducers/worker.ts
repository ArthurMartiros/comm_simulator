import { ACTION_TYPES, TASK_ACTION_TYPES } from "../constants";
import { initialState }                    from "../store/initialState";

export default (state = initialState.worker, action: any) => {
  const {type, payload} = action;

  switch (type) {
    case ACTION_TYPES.SET_WORKERS: {
      const workers = payload.reduce((p: any, c: any) => {
        p[c.id] = Object.assign(c, {tasks: {}, selected: false});
        return p;
      }, {});
      return {
        ...state,
        allWorkers: workers,
      }
    }
    case TASK_ACTION_TYPES.ADD_TASK :
    case TASK_ACTION_TYPES.UPDATE_TASK : {
      return {
        ...state,
        allWorkers: {
          ...state.allWorkers,
          [payload.workerId]: {
            ...state.allWorkers[payload.workerId],
            tasks: {
              ...state.allWorkers[payload.workerId].tasks,
              [payload.task.id]: payload.task,
            }
          }
        }
      }
    }
    case TASK_ACTION_TYPES.REMOVE_TASK : {
      const {[payload.task.id]:t1,...allWorkersTasks} = state.allWorkers[payload.workerId].tasks;

      return {
        ...state,
        allWorkers:{
          ...state.allWorkers,
          [payload.workerId]:{
            ...state.allWorkers[payload.workerId],
            tasks:allWorkersTasks
          }
        }
      }
    }
    case ACTION_TYPES.SELECT_WORKER: {
      return {
        ...state,
        allWorkers: {
          ...state.allWorkers,
          [payload.id]: {
            ...state.allWorkers[payload.id],
            selected: true
          }
        }
      }
    }
    case ACTION_TYPES.DESELECT_WORKER: {
      return {
        ...state,
        allWorkers: {
          ...state.allWorkers,
          [payload.id]: {
            ...state.allWorkers[payload.id],
            selected: false
          }
        },
      }
    }
    case ACTION_TYPES.CONNECT_WORKER: {
      return {
        ...state,
        allWorkers: {
          ...state.allWorkers,
          [payload.id]: {
            ...state.allWorkers[payload.id],
            online: payload.online
          }
        }
      }
    }
    case ACTION_TYPES.LOGOUT: {
      return {
        ...state,
        allWorkers: {
          ...state.allWorkers,
          [payload.id]: {
            ...state.allWorkers[payload.id],
            online: payload.online
          }
        }
      }
    }
    case ACTION_TYPES.UPDATE_WORKER: {
      return {
        ...state,
        allWorkers: {
          ...state.allWorkers,
          [payload.workerId]: {
            ...state.allWorkers[payload.workerId],
            status: payload.status,
            available: payload.available
          }
        }
      }
    }
    case ACTION_TYPES.DISCONNECT_ALL: {
      Object.values(state.allWorkers).map((w) => {
        return w.online = payload
      });
      return {
        ...state,
        allWorkers: {
          ...state.allWorkers
        }
      }
    }
    default:
      return state;
  }
}