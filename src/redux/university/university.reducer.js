import { SET_UNIVERSITIES } from "./university.type";

const initialState = {
  universities: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_UNIVERSITIES:
      return {
        ...state,
        universities: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
