import React                                          from 'react';
import {
  Button,
  Callout,
  PanelStack,
}                                                     from "@blueprintjs/core";
import { connect }                                    from "react-redux";
import {
  connectWorkerAction,
  loginWorkerAction,
  subscribeWorkerAction
}                                                     from "../actions/worker";
import { TaskDistributionType, TaskStatus, TaskType } from '@ffn/communicator-tools';
import { generateRandomNumber, generateRandomString } from "../utils";
import WorkerOnlineView                               from "./WorkerOnlineView";
import { createTaskAction }                           from "../actions/task";

export class WorkerView extends React.Component<any, any> {
  render() {
    const {
      connected,
      className,
      connectWorker,
      worker,
      loginWorker,
      subscribeWorker,
      createTask,
    } = this.props;
    return (
      connected ?
        <Callout className={className} intent={"success"} icon={false}>
          <PanelStack
            initialPanel={{
              component: WorkerOnlineView,
              props: {workerId: worker.id},
              title: `${worker.username}_view`
            }}
            className='panel-stack'/>
        </Callout> :
        <Callout className={className} intent={"danger"} icon={false}>
          <div className="offline-view">
            <p>{worker.username}</p>
            <p><Button aria-label="Offline-CDT" onClick={
              () => {
                createTask({
                  integrationId: worker.integrationId,
                  description: `GT_${generateRandomString()}`,
                  type: TaskType.general,
                  contactId: localStorage.contactId,
                  status: TaskStatus.distributing,
                  distributionType: TaskDistributionType.direct,
                  distributionInfo: {
                    workerFilter: {
                      id: worker.id,
                    },
                    taskTimeout: generateRandomNumber(30, 60),
                    taskCapacity: Number(Math.random().toFixed(2)),
                    taskPriority: generateRandomNumber(0, 4),
                  },
                });
              }
            }>Create Direct Task (CDT)</Button></p>
            <p><Button aria-label="Connect-Worker" onClick={
              async () => {
                await connectWorker(worker);
                await loginWorker(worker);
                await subscribeWorker(worker);
              }
            }>Connect & Login</Button></p>
          </div>
        </Callout>
    );
  }
}

export default connect(() => ({}), {
  loginWorker: loginWorkerAction,
  subscribeWorker: subscribeWorkerAction,
  connectWorker: connectWorkerAction,
  createTask: createTaskAction,
})(WorkerView);