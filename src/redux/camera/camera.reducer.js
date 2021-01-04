import { CAMERA_DETECTED } from "./camera.type";

const initialState = {
  camera_detected: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CAMERA_DETECTED:
      return {
        ...state,
        camera_detected: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
