import { ITask }             from '@ffn/communicator-tools';
import { TASK_ACTION_TYPES } from "../../constants";

export const createTaskAction = (task: ITask) => {
  return async (dispatch, getState, {commApi}) => {
    await commApi.createTask(task);
  }
};
export const addTaskAction = (workerId: string, task: ITask) => ({
  payload: {workerId, task},
  type: TASK_ACTION_TYPES.ADD_TASK,
});
export const updateTaskAction = (workerId: string, task: ITask) => ({
  payload: {workerId, task},
  type: TASK_ACTION_TYPES.UPDATE_TASK,
});
export const removeTaskAction = (workerId: string, task: ITask) => ({
  payload: {workerId, task},
  type: TASK_ACTION_TYPES.REMOVE_TASK,
});