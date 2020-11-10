import { IReduxState } from "../common/IReduxState";

export const initialState: IReduxState = {
  worker: {
    allWorkers: {},
  },
  integrations: {},
  taskForm: {
    isOpen: false,
    duplicatedTask: {},
  },
  app: {
    user: {
      id: '',
    },
    isAuthenticated: false,
  }
};