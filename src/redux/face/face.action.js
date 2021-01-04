import { PUSH_IMAGE, RESET_IMAGE } from "./face.type";

export const pushImage = (image, location, isFake) => {
  return {
    type: PUSH_IMAGE,
    payload: image,
    payload2: location,
    payload3: isFake
  };
};

export const resetImage = () => {
  return {
    type: RESET_IMAGE,
  };
};