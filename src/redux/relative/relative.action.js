import {SET_RELATIVES} from './relative.type'

export const setRelatives = (relatives) => {
    return {
        type: SET_RELATIVES,
        payload: relatives,
      };
}