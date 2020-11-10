import React, { useCallback }                                                            from 'react';
import { Alert, Divider, Label }                                                         from "@blueprintjs/core";
import { useDispatch, useSelector }                                                      from "react-redux";
import {
  getDistributionType,
  getFormIntegrationId,
  getIntegrations,
  getTaskFormIsOpen,
  getWorkersByIntegrationId
}                                                                                        from "../selectors";
import { cancelTaskFormAction, confirmTaskFormAction }                                   from "../actions/taskForm";
import { Field, Form, reduxForm }                                                        from "redux-form";
import {
  maxPresentationTimeout,
  maxTaskCapacity,
  maxTaskPriority,
  maxTaskTimeout,
  minPresentationTimeout,
  minTaskCapacity,
  minTaskPriority,
  minTaskTimeout,
  required
}                                                                                        from "../utils/formValidate";
import { presentationTimeout, taskCapacity, taskDescription, taskPriority, taskTimeout } from "./FormComponents";
import { TaskDistributionType, TaskStatus }                                              from "@ffn/communicator-tools";
import { generateRandomString }                                                          from "../utils";
import { createTaskAction }                                                              from "../actions/task";
import { IReduxState }                                                                   from "../common/IReduxState";

const TaskForm = (props: any) => {
  const formIsOpen = useSelector(getTaskFormIsOpen);
  const integrations = useSelector(getIntegrations);
  const dispatch = useDispatch();
  const distributionType = useSelector(getDistributionType);
  const formIntegrationId = useSelector(getFormIntegrationId);
  const {handleSubmit} = props;
  const workersByIntegrationId = useSelector(useCallback((state: IReduxState) => getWorkersByIntegrationId(state, formIntegrationId), [formIntegrationId]));
  const formOnSubmit = useCallback((values: any) => {
    const {
      id,
      taskTimeout,
      taskCapacity,
      taskPriority,
      description,
      online,
      available,
      role,
      distributionType,
      presentationTimeout,
      ...rest
    } = values;
    const task = {
      ...rest,
      description: description || `GT_${generateRandomString()}`,
      contactId: localStorage.contactId,
      status: TaskStatus.distributing,
      distributionType,
      distributionInfo: {
        workerFilter: distributionType === TaskDistributionType.round_robin ?
          {
            online,
            ...(available && {available: available === 'true'}),
            ...(role && {role}),
          } : {
            id
          },
        ...(distributionType === TaskDistributionType.round_robin && {presentationTimeout}),
        taskTimeout,
        taskCapacity,
        taskPriority,
      },
    };
    dispatch(createTaskAction(task));
    dispatch(confirmTaskFormAction(task));
  }, [dispatch]);
  return (
    <Alert
      isOpen={formIsOpen}
      cancelButtonText={'Cancel'}
      onCancel={useCallback(() => dispatch(cancelTaskFormAction()), [dispatch])}
      onConfirm={handleSubmit}
    ><Form className='form' onSubmit={handleSubmit(formOnSubmit)}>
      <div className={'form-group-part'}>
        General
        <Divider/>
        <Label className="bp3-inline label">
          Integration Id
          <Field
            name='integrationId'
            component='select'
            className='select'>
            {Object.keys(integrations).map((i) => {
              return <option key={`integrationId${i}`} value={i}>{i}</option>
            })}
          </Field>
        </Label>
        <Label className="bp3-inline label">
          Description
          <Field
            name='description'
            component={taskDescription}
          />
        </Label>
        <Label className="bp3-inline label">
          Type
          <Field
            name='type'
            component='select'
            className='select'>
            <option value="general">general</option>
          </Field>
        </Label>
        <Label className="bp3-inline label">
          DistributionType
          <Field
            name='distributionType'
            component='select'
            className='select'>
            <option value="direct">direct</option>
            <option value="round_robin">round_robin</option>
          </Field>
        </Label>
      </div>
      <div className={'form-group-part'}>
        WorkerFilter
        <Divider/>
        <Label className="bp3-inline label">
          Id
          <Field
            disabled={distributionType === TaskDistributionType.round_robin}
            name='id'
            component='select'
            className='select'>
            {workersByIntegrationId.map((w) => {
              return <option key={w.id} value={w.id}>{w.username}</option>
            })}
          </Field>
        </Label>
        <Label className="bp3-inline label">
          Online
          <Field
            disabled={distributionType === TaskDistributionType.direct}
            name='online'
            parse={(value: string) => value === 'true'}
            component='select'
            className='select'>
            <option value="true">true</option>
            <option value="false">false</option>
          </Field>
        </Label>
        <Label className="bp3-inline label">
          Available
          <Field
            disabled={distributionType === TaskDistributionType.direct}
            name='available'
            component='select'
            className='select'>
            <option value="">--</option>
            <option value="true">available</option>
            <option value="false">not_available</option>
          </Field>
        </Label>
        <Label className="bp3-inline label">
          Role
          <Field
            disabled={distributionType === TaskDistributionType.direct}
            name='role'
            component='select'
            className='select'>
            <option value="">--</option>
            <option value="uw">uw</option>
            <option value="sales">sales</option>
          </Field>
        </Label>
      </div>
      <div className={'form-group-part'}>
        Distribution Info
        <Divider/>
        <Label className="bp3-inline label">
          Presentation Timeout
          <Field
            validate={distributionType === TaskDistributionType.round_robin ? [required, minPresentationTimeout, maxPresentationTimeout] : []}
            name='presentationTimeout'
            component={presentationTimeout}
            parse={(value: string) => value && Number(value)}
            disabled={distributionType === TaskDistributionType.direct}>
          </Field>
        </Label>
        <Label className="bp3-inline label">
          Task Timeout
          <Field
            validate={[required, minTaskTimeout, maxTaskTimeout]}
            name='taskTimeout'
            parse={(value: string) => value && Number(value)}
            component={taskTimeout}>
          </Field>
        </Label>
        <Label className="bp3-inline label">
          Task Capacity
          <Field
            validate={[required, minTaskCapacity, maxTaskCapacity]}
            name='taskCapacity'
            parse={(value: string) => value && Number(value)}
            component={taskCapacity}>
          </Field>
        </Label>
        <Label className="bp3-inline label">
          Task Priority
          <Field
            validate={[required, minTaskPriority, maxTaskPriority]}
            name='taskPriority'
            parse={(value: string) => value && Number(value)}
            component={taskPriority}>
          </Field>
        </Label>
      </div>
    </Form>
    </Alert>
  )
};

export default reduxForm({
  form: 'taskForm',
})(TaskForm);