import app                 from './app';
import worker              from './worker';
import { combineReducers } from "redux";
import taskForm            from "./taskForm";
import { reducer as form } from 'redux-form';
import integrations        from "./integration";

export default combineReducers({
  app,
  worker,
  form,
  taskForm,
  integrations,
});
