import { SET_USERS, SET_USER_REGISTER_FACE } from "./user.type";

export const setUsers = (users) => {
  return {
    type: SET_USERS,
    payload: users,
  };
};

export const setUserRegisterFace = (user) => {
  return {
    type: SET_USER_REGISTER_FACE,
    payload: user,
  };
};
