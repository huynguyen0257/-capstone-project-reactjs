import {SET_ROLES} from './role.type'

export const setRoles = (roles) => {
    return {
        type: SET_ROLES,
        payload: roles,
      };
}