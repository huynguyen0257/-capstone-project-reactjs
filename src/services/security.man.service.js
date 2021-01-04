import axios from "axios";
import { environment } from "../environment";
import { serialize } from '.'

export const getSecurityGuard = (params) => {
    return axios.get(`${environment.endpoint}${environment.apiPath.securityMan.main}?${serialize(params)}`);
};
export const createListSecurityGuard = (data) => {
    return axios.post(`${environment.endpoint}${environment.apiPath.securityMan.main}/List`,data);
};

// export const getsecurityManById = (id) => {
//   return axios.get(`${environment.endpoint}${environment.apiPath.securityMan.main}/${id}`);
// };

// export const updatesecurityMan = (securityMan) => {
//   return axios.put(`${environment.endpoint}${environment.apiPath.securityMan.main}`, securityMan);
// };

// export const createsecurityMan = (securityMan) => {
//   return axios.post(`${environment.endpoint}${environment.apiPath.securityMan.main}`, securityMan);
// };

export const toggleActive = (id) => {
    return axios.put(`${environment.endpoint}${environment.apiPath.securityMan.main}/${id}/${environment.apiPath.securityMan.toggleActive}`);
}

export const toggleOnline = (id, online) => {
    return axios.put(`${environment.endpoint}${environment.apiPath.securityMan.main}`,{
        Id: id,
        IsOnline: online
    });
}
