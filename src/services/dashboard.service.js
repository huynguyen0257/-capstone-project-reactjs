import { setLocalStorage, clearLocalStorage,getLocalStorage } from "./localstorage.service";
import axios from "axios";
import { environment } from "../environment";
import {serialize} from '.';
export const getDangerousCaseGroupByPolicy = (params) => {
    return axios
      .get(`${environment.endpoint}${environment.apiPath.dashboard.main}${environment.apiPath.dashboard.DangerousCaseGroupByPolicy}?${serialize(params)}`)
};

export const getNumberOfDangerousCaseByMonth = (params) => {
    return axios
      .get(`${environment.endpoint}${environment.apiPath.dashboard.main}${environment.apiPath.dashboard.NumberOfDangerousCaseByMonth}?${serialize(params)}`)
};


export const getNumberOfStudentGroupByBuilding = () => {
    return axios
      .get(`${environment.endpoint}${environment.apiPath.dashboard.main}${environment.apiPath.dashboard.NumberOfStudentGroupByBuilding}`)
};

export const getNumberOfCaseGroupByBuilding = (params) => {
  return axios
    .get(`${environment.endpoint}${environment.apiPath.dashboard.main}${environment.apiPath.dashboard.NumberOfCaseGroupByBuilding}?${serialize(params)}`)
};
export const getNumberOfStudentGroupByUniversity = () => {
    return axios
      .get(`${environment.endpoint}${environment.apiPath.dashboard.main}${environment.apiPath.dashboard.NumberOfStudentGroupByUniversity}`)
};

export const getRegisterStudentStatus = () => {
  return axios
    .get(`${environment.endpoint}${environment.apiPath.dashboard.main}${environment.apiPath.dashboard.RegisterStudentStatus}`)
};

export const getRegisterStudentStatusByBuilding = (buildingId) => {
  return axios
    .get(`${environment.endpoint}${environment.apiPath.dashboard.main}/Building/${buildingId}${environment.apiPath.dashboard.RegisterStudentStatus}`)
};

export const getNumberOfStudentGroupByUniversityByBuilding = (buildingId)=> {
  return axios
    .get(`${environment.endpoint}${environment.apiPath.dashboard.main}/Building/${buildingId}${environment.apiPath.dashboard.NumberOfStudentGroupByUniversityByBuilding}`)

}

export const getRegisterGuardStatus = () => {
  return axios
    .get(`${environment.endpoint}${environment.apiPath.dashboard.main}${environment.apiPath.dashboard.RegisterGuardStatus}`)
};

// BUILDING
export const getDangerousCaseGroupByPolicyByBuilding = (buildingId, params) => {
  return axios
    .get(`${environment.endpoint}${environment.apiPath.dashboard.main}/Building/${buildingId}${environment.apiPath.dashboard.DangerousCaseGroupByPolicy}?${serialize(params)}`)
};

export const getNumberOfDangerousCaseByMonthByBuilding = (buildingId, params) => {
  return axios
    .get(`${environment.endpoint}${environment.apiPath.dashboard.main}/Building/${buildingId}${environment.apiPath.dashboard.NumberOfDangerousCaseByMonth}?${serialize(params)}`)
};

