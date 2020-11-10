import { IIntegration, ITask, IWorker } from '@ffn/communicator-tools';

export interface IReduxState {
  worker: IWorkerState;
  taskForm: ITaskForm;
  app: IAppState;
  integrations: IIntegrationState
}

export interface IAppState {
  isAuthenticated: boolean;
  user: IUserState
}

export interface IWorkerState {
  allWorkers: { [k: string]: IWState}
}

export interface IWState extends IWorker{
  tasks: { [k: string]: ITask, },
  selected: boolean
}

export interface ITaskForm {
  isOpen: boolean,
  duplicatedTask: any,
}

export interface IIntegrationState {
  [k: string]: IIntegration
}

export interface IUserState {
  id: string
}