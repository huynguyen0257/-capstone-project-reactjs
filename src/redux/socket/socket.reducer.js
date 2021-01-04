import { SET_SOCKET } from "./socket.type";

const initialState = {
  socket: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SOCKET:
      return {
        ...state,
        socket: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
