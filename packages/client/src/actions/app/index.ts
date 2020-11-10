import { APP_ACTION_TYPES } from "../../constants";

export const setUser = (userId: string) => ({
  payload: userId,
  type: APP_ACTION_TYPES.SET_USER
});
export const setIsAuthenticated = (isAuthenticated: boolean) => ({
  payload: isAuthenticated,
  type: APP_ACTION_TYPES.SET_IS_AUTHENTICATED
});
export const setContactAction = () => {
  return async (dispatch, getState, {commApi}) => {
    const contact = await commApi.createContact();
    return contact.body.id;
  }
};