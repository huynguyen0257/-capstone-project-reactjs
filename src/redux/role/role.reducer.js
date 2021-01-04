import { SET_ROLES } from "./role.type";

const initialState = {
  roles: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROLES:
      return {
        ...state,
        roles: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
