import {SET_SOCKET} from './socket.type'

export const setSocket = (socket) => {
    return {
      type: SET_SOCKET,
      payload: socket
    };
  };