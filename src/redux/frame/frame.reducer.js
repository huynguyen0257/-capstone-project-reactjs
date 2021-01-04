import { SET_FRAME, SET_FRAME_FACES } from "./frame.type";

const initialState = {
  C01: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FRAME:
      if(action.payload3) {
        state['RAW' + action.payload2] = action.payload
      } else {
        state[action.payload2] = action.payload
      }
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default reducer;
