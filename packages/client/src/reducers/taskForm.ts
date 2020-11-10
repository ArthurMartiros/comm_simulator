import { initialState }           from "../store/initialState";
import { TASK_FORM_ACTION_TYPES } from "../constants";

export default (state = initialState.taskForm, action: any) => {
  const {type ,payload} = action;
  switch (type) {
    case TASK_FORM_ACTION_TYPES.OPEN_TASK_FORM : {
      return {
        ...state,
        isOpen: payload.isOpen,
      }
    }
    case TASK_FORM_ACTION_TYPES.CANCEL_TASK_FORM : {
      return {
        ...state,
        isOpen: payload.isOpen,
      }
    }
    case TASK_FORM_ACTION_TYPES.CONFIRM_TASK_FORM : {
      return {
        ...state,
        isOpen: payload.isOpen,
        duplicatedTask: payload.duplicatedTask,
      }
    }
    default:
      return state
  }
}