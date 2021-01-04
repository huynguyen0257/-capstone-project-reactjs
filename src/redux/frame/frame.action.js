import { SET_FRAME_FACES, SET_FRAME } from "./frame.type";

export const setFrame = (camera_code, raw, frame) => {
  return {
    type: SET_FRAME,
    payload: frame,
    payload2: camera_code,
    payload3: raw
  };
};

// export const setFrameFaces = (frame, faces) => {
//   return {
//     type: SET_FRAME_FACES,
//     payload: frame,
//     payload2: faces
//   };
// };