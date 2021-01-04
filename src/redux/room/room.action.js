import {SET_ROOMS} from './room.type'

export const setRooms = (rooms) => {
    return {
        type: SET_ROOMS,
        payload: rooms,
      };
}