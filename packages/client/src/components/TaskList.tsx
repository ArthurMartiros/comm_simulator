import { ITask, TaskDistributionType, TaskStatus, TaskType }      from '@ffn/communicator-tools';
import { Button, ButtonGroup, Card, Tag }                         from "@blueprintjs/core";
import { getFirstLetters }                                        from "../utils";
import React, { useCallback }                                     from "react";
import TaskDetails                                                from "./TaskDetails";
import { useDispatch, useSelector }                               from "react-redux";
import { IReduxState }                                            from "../common/IReduxState";
import { getWorkerTasks }                                         from "../selectors";
import { acceptTaskAction, completeTaskAction, rejectTaskAction } from "../actions/worker";

const TaskList = ({openPanel, workerId}) => {
  const openTaskDetails = (task: ITask) => {
    openPanel({
      component: TaskDetails,
      props: {task: task},
      title: task.description
    });
  };
  const taskList: any = useSelector(useCallback((state: IReduxState) => getWorkerTasks(state, workerId), [workerId]));
  const dispatch = useDispatch();
  const acceptTask = useCallback((tId) =>
    dispatch(acceptTaskAction(tId, workerId)), [dispatch, workerId]);
  const rejectTask = useCallback((tId) =>
    dispatch(rejectTaskAction(tId, workerId)), [dispatch, workerId]);
  const completeTask = useCallback((tId) =>
    dispatch(completeTaskAction(tId, workerId)), [dispatch, workerId]);

  return (
    <div className="task-list">
      {taskList && taskList.length ? taskList.filter((task: ITask) => task.type === TaskType.general).map((t: ITask) => {
        return (
          <Card className="btn-group" key={t.id}>
            <ButtonGroup>
              <Tag className="tag">{t.distributionType && getFirstLetters(t.distributionType)}</Tag>
              <Tag className="tag">{t.distributionInfo && t.distributionInfo.taskPriority}</Tag>
              <Tag className="tag">{t.distributionInfo && t.distributionInfo.taskCapacity}</Tag>
              <Tag aria-label="Task-Description" minimal={true} interactive={true} className="tag"
                   style={{padding: '0 15px'}}
                   onClick={() => openTaskDetails(t)}>{t.description}</Tag>
            </ButtonGroup>
            {t.status !== TaskStatus.assigned ?
              <ButtonGroup>
                <Button intent={"success"} className="margin-right" aria-label="Accept-Task"
                        onClick={() => acceptTask(t.id)}>A</Button>
                {t.distributionType !== TaskDistributionType.direct && t.distributionInfo.allowReject ?
                  <Button intent={"danger"} aria-label="Reject-Task" onClick={() => {
                    rejectTask(t.id);
                  }}>R</Button> : void 0}
              </ButtonGroup>
              : <Button intent={"primary"} aria-label="Complete_Task" onClick={() => completeTask(t.id)}>C</Button>}
          </Card>
        );
      }) : void 0}
    </div>
  );
}

export default TaskList;