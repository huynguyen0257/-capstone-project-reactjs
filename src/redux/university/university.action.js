import {SET_UNIVERSITIES} from './university.type'

export const setUniversities = (universities) => {
    return {
        type: SET_UNIVERSITIES,
        payload: universities,
      };
}