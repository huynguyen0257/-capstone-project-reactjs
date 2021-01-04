import { SET_ROOMS } from "./room.type";

const initialState = {
  rooms: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROOMS:
      return {
        ...state,
        rooms: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
