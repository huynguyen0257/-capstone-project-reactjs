import { SET_RELATIVES } from "./relative.type";

const initialState = {
  relatives: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RELATIVES:
      return {
        ...state,
        relatives: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
