import { SET_USERS,SET_USER_REGISTER_FACE } from "./user.type";

const initialState = {
  users: [],
  userRegister: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS:
      return {
        ...state,
        users: action.payload,
      };
      case SET_USER_REGISTER_FACE:
        return {
          ...state,
          userRegister: action.payload,
        };
    default:
      return state;
  }
};

export default reducer;
