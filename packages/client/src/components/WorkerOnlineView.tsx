import React                                                              from "react";
import { Button, ButtonGroup, IPanelProps, Switch }                       from "@blueprintjs/core";
import { connect }                                                        from "react-redux";
import { TaskDistributionType, TaskStatus, TaskType }                     from '@ffn/communicator-tools';
import { disconnectWorkerAction, logoutWorkerAction, updateWorkerStatus } from "../actions/worker";
import { generateRandomNumber, generateRandomString }                     from "../utils";
import TaskList                                                           from "./TaskList";
import { Worker }                                                         from "../models/Worker";
import { getWorkerById }                                          from "../selectors";
import { IReduxState }                                                    from "../common/IReduxState";
import { createTaskAction }                                               from "../actions/task";

class WorkerOnlineView extends React.Component<IPanelProps & IProps> {

  render() {
    const {
      worker,
      createTask,
      logOut,
      updateWorkerStatus,
      disconnect,
    } = this.props;
    return (
      <div>
        <div className="worker-btn">
          <ButtonGroup>
            <Button aria-label="Worker-Availability" className={worker.available ? 'cadetblue-color' : 'bisque-color'}>
              <Switch large={true} checked={worker.available} onChange={() => {
                updateWorkerStatus(worker, worker.available ? 'not_available' : 'available')
              }} style={{marginBottom: 0}}/>
            </Button>
            <Button aria-label="Online-CDT" className={'lightsteelblue-color'} onClick={() => {
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
              })
            }}>CDT</Button>
            <Button aria-label="Log-Out" className={'lightgray-color'} onClick={async () => {
              await logOut(worker);
              await disconnect(worker)
            }}>LogOut & Disconnect</Button>
          </ButtonGroup>
        </div>
        <TaskList workerId={worker.id} openPanel={this.props.openPanel}/>
      </div>
    )
  }
}

export default connect((state: IReduxState, props: any) => ({
  worker: getWorkerById(state, props.workerId)
}), {
  createTask: createTaskAction,
  logOut: logoutWorkerAction,
  disconnect: disconnectWorkerAction,
  updateWorkerStatus: updateWorkerStatus,
})(WorkerOnlineView)

interface IProps {
  workerId: string,
  worker: Worker,
  createTask: any,
  logOut: any,
  updateWorkerStatus: any,
  disconnect: any,
}