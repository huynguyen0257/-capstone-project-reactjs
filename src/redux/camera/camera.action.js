import { CAMERA_DETECTED} from './camera.type'

export const setCameraDetected = (camera_code) => {
    return {
        type: CAMERA_DETECTED,
        payload: camera_code
    }
}