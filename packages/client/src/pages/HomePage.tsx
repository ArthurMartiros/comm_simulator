import React, { useCallback, useEffect }                                from 'react';
import {
  Alignment,
  Button,
  Classes,
  Menu,
  MenuItem,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  Popover,
  Position,
  Tooltip,
}                                                                       from "@blueprintjs/core";
import { SelectMenuItem }                                               from "../components/SelectMenuItem";
import {
  connectWorkerAction,
  deSelectWorkerAction,
  disconnectWorkerAction,
  loginWorkerAction,
  logoutWorkerAction,
  selectWorkerAction,
  subscribeWorkerAction
}                                                                       from "../actions/worker";
import { useDispatch, useSelector, useStore }                           from "react-redux";
import {
  getAllWorkers,
  getDuplicatedTask,
  getIntegrations,
  getSelected,
  getWorkersByIntegrationId
}                                                                       from "../selectors";
import WorkerView                                                       from "../components/WorkerView";
import {
  IWorker,
  TaskDistributionType,
  TaskStatus,
  TaskType,
}                                                                       from "@ffn/communicator-tools";
import { generateRandomNumber, generateRandomString, selectRandomItem } from "../utils";
import TaskForm                                                         from "../components/TaskForm";
import { openTaskFormAction }                                           from "../actions/taskForm";
import { createTaskAction }                                             from "../actions/task";
import { IReduxState }                                                  from "../common/IReduxState";

const HomePage = () => {
  const integrations = useSelector(getIntegrations);
  const allWorkers = useSelector(getAllWorkers) || [];
  const selected = useSelector(getSelected);
  const dispatch = useDispatch();
  const selectWorker = useCallback((w) => dispatch(selectWorkerAction(w)), [dispatch]);
  const deSelectWorker = useCallback((w) => dispatch(deSelectWorkerAction(w)), [dispatch]);
  const connectWorker = useCallback((w) => dispatch(connectWorkerAction(w)), [dispatch]);
  const loginWorker = useCallback((w) => dispatch(loginWorkerAction(w)), [dispatch]);
  const subscribeWorker = useCallback((w) => dispatch(subscribeWorkerAction(w)), [dispatch]);
  const logoutWorkers = useCallback((w) => dispatch(logoutWorkerAction(w)), [dispatch]);
  const disconnectWorkers = useCallback((w) => dispatch(disconnectWorkerAction(w)), [dispatch]);
  const integrationId = Object.keys(integrations)[0];
  const workersByIntegration = useSelector(useCallback((state: IReduxState) => getWorkersByIntegrationId(state, integrationId), [integrationId]));
  const taskFormInitialValues = {
    integrationId: integrationId,
    description: '',
    type: 'general',
    distributionType: "direct",
    id: workersByIntegration.length && workersByIntegration[0].id,
    online: true,
    presentationTimeout: '',
    taskTimeout: '',
    taskCapacity: '',
    taskPriority: ''
  };
  const duplicatedTask = useSelector(getDuplicatedTask);
  const store = useStore();
  const state = store.getState();
  const createRandomTask = useCallback(() => {
    const integrationId = selectRandomItem(Object.keys(integrations));
    const filteredWorkersByIntId: any = getWorkersByIntegrationId(state, integrationId);
    const workerFilterId = selectRandomItem(filteredWorkersByIntId.map((w) => w.id));
    const taskType = selectRandomItem([TaskDistributionType.round_robin, TaskDistributionType.direct]);
    const workerRole = selectRandomItem(['sales', 'uw', '']);
    dispatch(createTaskAction({
      integrationId: integrationId,
      description: `GT_${generateRandomString()}`,
      contactId: localStorage.contactId,
      type: TaskType.general,
      status: TaskStatus.distributing,
      distributionType: taskType,
      distributionInfo: {
        workerFilter: taskType === TaskDistributionType.round_robin ?
          {
            online: true,
            available: selectRandomItem([true, false]),
            ...(workerRole && {role: workerRole}),
          } : {
            id: workerFilterId
          },
        ...(taskType === TaskDistributionType.round_robin && {presentationTimeout: generateRandomNumber(5, 30),}),
        taskTimeout: generateRandomNumber(30, 120),
        taskCapacity: Number(Math.random().toFixed(2)),
        taskPriority: generateRandomNumber(0, 4),
      }
    } as any));
  }, [dispatch, integrations, state]);
  const connectLoginAll = () => {
    return Promise.all(Object.values(allWorkers).map((w) => {
      return new Promise(async (resolve) => {
        await connectWorker(w);
        await loginWorker(w);
        await subscribeWorker(w);
        resolve();
      })
    }))
  };
  const connectLoginSelected = () => {
    return Promise.all(selected.map((w) => {
      return new Promise(async (resolve) => {
        await connectWorker(w);
        await loginWorker(w);
        await subscribeWorker(w);
        resolve();
      })
    }))
  };
  const logoutDisconnectAll = () => {
    return Promise.all(Object.values(allWorkers).filter((w) => w.online).map((w) => {
      return new Promise(async (resolve) => {
        await logoutWorkers(w);
        await disconnectWorkers(w);
        resolve();
      })
    }))
  };
  const logoutDisconnectSelected = () => {
    return Promise.all(selected.filter((w) => w.online).map((w) => {
      return new Promise(async (resolve) => {
        await logoutWorkers(w);
        await disconnectWorkers(w);
        resolve();
      })
    }))
  };
  const duplicateTask = useCallback(() => dispatch(createTaskAction(duplicatedTask)), [dispatch, duplicatedTask]);
  useEffect(() => {
    Object.values(allWorkers).filter((w: any) => w.integrationId === 'suip').slice(0, 5).forEach((w) => {
      selectWorker(w)
    })
  }, [dispatch]);
  return <div>
    <Navbar className="navbar-top" fixedToTop={true}>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button aria-label='Open-Create-Task-Form' className={Classes.MINIMAL} text={'Open Create Task Form'}
                onClick={useCallback(() => dispatch(openTaskFormAction()), [dispatch])}/>
        <TaskForm initialValues={taskFormInitialValues}/>
        {Object.keys(duplicatedTask).length > 0 && <Tooltip content="duplicate task" position={Position.BOTTOM}>
            <Button alia-label='duplicate' className={Classes.MINIMAL} icon="duplicate" onClick={duplicateTask}/>
        </Tooltip>}
        <NavbarDivider/>
        <Button aria-label="Create-Random-Task" className={Classes.MINIMAL} text={'Create Random Task'}
                onClick={createRandomTask}/>
        <NavbarDivider/>
        <Popover inheritDarkTheme={false} content={<Menu>
          <MenuItem aria-label="Logout-Disconnect-All" className={Classes.MINIMAL} text={'Logout & Disconnect All'}
                    disabled={!Object.values(allWorkers).map((w: any) => w.online).includes(true)}
                    onClick={async () => await logoutDisconnectAll()}/>
          <MenuItem aria-label="Logout-Disconnect-Selected" className={Classes.MINIMAL}
                    text={'Logout & Disconnect Selected'}
                    disabled={!selected.map((w: any) => w.online).includes(true)}
                    onClick={async () => await logoutDisconnectSelected()}/>
        </Menu>} position={Position.BOTTOM}>
          <Button aria-label="Disconnect" text='Disconnect' className={Classes.MINIMAL}/>
        </Popover>
        <NavbarDivider/>
        <Popover inheritDarkTheme={false} content={<Menu>
          <MenuItem aria-label="Connect-Login-All" className={Classes.MINIMAL} text={'Connect & Login All'}
                    disabled={!Object.values(allWorkers).map((w) => w.online).includes(false)}
                    onClick={async () => await connectLoginAll()}/>
          <MenuItem aria-label="Connect-Login-Selected" className={Classes.MINIMAL} text={'Connect & Login Selected'}
                    disabled={!selected.map((w: any) => w.online).includes(false)}
                    onClick={async () => await connectLoginSelected()}/>
        </Menu>} position={Position.BOTTOM}>
          <Button aria-label="Connect" text='Connect' className={Classes.MINIMAL}/>
        </Popover>
        <NavbarDivider/>
        <Popover inheritDarkTheme={false} content={<Menu>
          {Object.values(allWorkers).sort((a, b) => a.integrationId.localeCompare(b.integrationId)).map((w: IWorker) => {
            return <SelectMenuItem ariaLabel={`Select-Worker-${w.username}`}
                                   key={w.id}
                                   text={<div className='selectDeselect'>
                                     <div>{w.name}</div>
                                     <div>{w.integrationId}</div>
                                   </div>}
                                   selected={selected.map((s: any) => s.id).includes(w.id)}
                                   onItemSelected={() => {
                                     selectWorker(w)
                                   }}
                                   onItemDeSelected={() => {
                                     deSelectWorker(w)
                                   }}/>
          })}
        </Menu>} position={Position.BOTTOM}>
          <Tooltip content="add workers" position={Position.BOTTOM}>
            <Button aria-label="Add-Worker" className={Classes.MINIMAL} icon="add"/>
          </Tooltip>
        </Popover>
      </NavbarGroup>
    </Navbar>
    <div className='grid-container'>
      {selected.map((w: IWorker) => {
        return <WorkerView key={w.id} connected={w.online} worker={w} className={'grid-item'}/>
      })}
    </div>
  </div>
};

export default HomePage;