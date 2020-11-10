import { applyMiddleware, compose, createStore } from "redux";
import reducers                                  from '../reducers';
import thunkMiddleware                           from "redux-thunk";
import { commApi }                               from "../services/SimCommunicatorApi";

const configureStore = () => {
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware.withExtraArgument({
    commApi,
  }))));
};

export const store = configureStore();
