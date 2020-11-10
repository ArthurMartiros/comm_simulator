import { initialState }     from '../store/initialState';
import { APP_ACTION_TYPES } from '../constants';

export default (state = initialState.app, action: any) => {
  const {type, payload} = action;
  switch (type) {
    case APP_ACTION_TYPES.SET_USER: {
      return {
        ...state,
        user: {
          ...state.user,
          id: payload,
        }
      }
    }
    case APP_ACTION_TYPES.SET_IS_AUTHENTICATED: {
      return {
        ...state,
        isAuthenticated: payload,
      }
    }
    default:
      return state;
  }
}