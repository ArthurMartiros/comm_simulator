import { createSelector }                                  from 'reselect';
import { IAppState, IReduxState, ITaskForm, IWorkerState } from "../common/IReduxState";
import { formValueSelector }                               from "redux-form";
import { IWorker }                                         from "@ffn/communicator-tools";

export const getState = (state: IReduxState) => state;
export const getApp = (state: IReduxState) => state.app;
export const getIsAuthenticated = createSelector(getApp, (app: IAppState) => app.isAuthenticated);
export const getWorker = (state: IReduxState) => state.worker;
export const getTaskForm = (state: IReduxState) => state.taskForm;
export const getIntegrations = (state: IReduxState) => state.integrations;
export const getUser = createSelector(getApp, (app: IAppState) => app.user);
export const getAllWorkers = createSelector(getWorker, (workers: IWorkerState) => workers.allWorkers);
export const getSelected = createSelector(getAllWorkers, (workers) => {
  return Object.values(workers)
    .filter((w: any) => w.selected === true)
    .sort((a: any, b: any) => a.integrationId.localeCompare(b.integrationId));
});

export const getWorkerId = (state: IReduxState, id?: string) => id as string;
export const getIntegrationId = (state: IReduxState, integrationId?: string) => integrationId as string;
export const getWorkerById: any = createSelector(getAllWorkers, getWorkerId, (workers: any, id: string) => {
  return workers[id];
});
export const getTaskFormIsOpen = createSelector(getTaskForm, (taskForm: ITaskForm) => taskForm.isOpen);
export const getDuplicatedTask = createSelector(getTaskForm, (taskForm: ITaskForm) => taskForm.duplicatedTask);
export const getDistributionType = createSelector(
  getState,
  (state: IReduxState) => formValueSelector('taskForm')(state, 'distributionType')
);

export const getFormIntegrationId = createSelector(
  getState,
  (state: IReduxState) => formValueSelector('taskForm')(state, 'integrationId')
);

export const getWorkerTasks: any = createSelector(getWorkerById, getWorkerId, (worker: any, id: string) => {
  return Object.values(worker.tasks)
});

export const getWorkersByIntegrationId: any = createSelector(getAllWorkers, getIntegrationId, (worker: any, integrationId: string) => {
  return Object.values(worker).filter((w: IWorker) => w.integrationId === integrationId)
});