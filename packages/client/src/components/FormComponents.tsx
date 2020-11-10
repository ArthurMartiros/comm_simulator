import { GenericFieldHTMLAttributes, WrappedFieldProps } from "redux-form";
import { InputGroup, NumericInput }                      from "@blueprintjs/core";
import React                                             from "react";

export const taskDescription = ({input, meta}: WrappedFieldProps) => (
  <InputGroup placeholder="task description" {...input}/>
);
export const presentationTimeout = ({input, meta: {touched, error}, disabled}: WrappedFieldProps & GenericFieldHTMLAttributes) => (
  <div>
    <NumericInput
      disabled={disabled}
      buttonPosition='none'
      name='presentationTimeout'
      placeholder='from 5 to 30'
      allowNumericCharactersOnly={true}
      max={30}
      min={5}
      {...input}
    />
    {touched && ((error && <small className='error'>{error}</small>))}
  </div>
);
export const taskTimeout = ({input, meta: {touched, error}}: WrappedFieldProps) => (
  <div>
    <NumericInput
      {...input}
      required={true}
      buttonPosition='none'
      name='taskTimeout'
      placeholder='from 30 to 345600'
      allowNumericCharactersOnly={true}
      max={345600}
      min={30}
    />
    {touched && ((error && <small className='error'>{error}</small>))}
  </div>
)
export const taskCapacity = ({input, meta: {touched, error}}: WrappedFieldProps) => (
  <div>
    <NumericInput
      {...input}
      buttonPosition='none'
      name='taskCapacity'
      placeholder='from 0 to 1'
      allowNumericCharactersOnly={true}
      max={1}
      min={0}
      minorStepSize={0.01}
      stepSize={0.01}
    />
    {touched && ((error && <small className='error'>{error}</small>))}
  </div>
)
export const taskPriority = ({input, meta: {touched, error}}: WrappedFieldProps) => (
  <div>
    <NumericInput
      {...input}
      buttonPosition='none'
      name='taskPriority'
      placeholder='from 0 to 3'
      allowNumericCharactersOnly={true}
      max={3}
      min={0}
    />
    {touched && ((error && <small className='error'>{error}</small>))}
  </div>
)