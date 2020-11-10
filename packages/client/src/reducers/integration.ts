import { initialState }      from "../store/initialState";
import { INTEGRATION_TYPES } from "../constants";

export default (state = initialState.integrations, action: any) => {
  const {type, payload} = action;

  switch (type) {
    case INTEGRATION_TYPES.SET_INTEGRATIONS: {
      return payload.reduce((p, c) => {
        p[c.id] = c;
        return p;
      }, {});
    }
    default:
      return state;
  }
}