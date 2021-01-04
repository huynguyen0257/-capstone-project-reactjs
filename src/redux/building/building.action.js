import {SET_BUILDINGS, SET_BUILDING} from './building.type'

export const setBuildings = (buildings) => {
    return {
        type: SET_BUILDINGS,
        payload: buildings,
      };
}

export const setBuilding = (building) => {
  return {
      type: SET_BUILDING,
      payload: building,
    };
}