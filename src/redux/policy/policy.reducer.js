import { SET_POLICY_LEVEL,SET_POLICY } from "./policy.type";

const initialState = {
  policyLevels: [],
  policies: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_POLICY_LEVEL:
      return {
        ...state,
        policyLevels: action.payload,
      };
    case SET_POLICY:
      return {
        ...state,
        policies: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
