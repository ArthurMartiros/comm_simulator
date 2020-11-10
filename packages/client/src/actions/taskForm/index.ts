import { TASK_FORM_ACTION_TYPES } from "../../constants";
import { ITask }                  from "@ffn/communicator-tools";

export const openTaskFormAction = () => ({
  type: TASK_FORM_ACTION_TYPES.OPEN_TASK_FORM,
  payload: {isOpen: true}
});
export const cancelTaskFormAction = () => ({
  type: TASK_FORM_ACTION_TYPES.CANCEL_TASK_FORM,
  payload: {isOpen: false}
});
export const confirmTaskFormAction = (task: ITask) => ({
  type: TASK_FORM_ACTION_TYPES.CONFIRM_TASK_FORM,
  payload: {isOpen: false, duplicatedTask: task}
});