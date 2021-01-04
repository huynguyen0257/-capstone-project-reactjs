import { SET_BUILDINGS, SET_BUILDING } from "./building.type";

const initialState = {
  buildings: [],
  building: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BUILDINGS:
      return {
        ...state,
        buildings: action.payload,
      };
    case SET_BUILDING:
      return {
        ...state,
        building: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
