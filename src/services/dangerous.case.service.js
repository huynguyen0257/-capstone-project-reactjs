import axios from "axios";
import { environment } from "../environment";
import { serialize } from '.'

export const getDangerousCases = (query) => {
  return axios.get(`${environment.endpoint}${environment.apiPath.dangerousCase.main}?${serialize(query)}`);
};

export const getDangerousCasesByStudentId = (query) => {
  return axios.get(`${environment.endpoint}${environment.apiPath.dangerousCase.student}?${serialize(query)}`);
};

export const getDangerousCaseById = (id) => {
  return axios.get(`${environment.endpoint}${environment.apiPath.dangerousCase.main}/${id}`);
};

export const getCaseHistoryStatus = () => {
  return axios.get(`${environment.endpoint}${environment.apiPath.caseHistoryStatus.main}`);
};
export const createDangerousCase = (data) => {
  return axios.post(`${environment.endpoint}${environment.apiPath.dangerousCase.main}`,data);
};
export const uploadFileCase = (data,caseId) => {
  console.log(`${environment.endpoint}${environment.apiPath.dangerousCase.main}/${caseId}`,data);
  return axios.put(`${environment.endpoint}${environment.apiPath.dangerousCase.main}/${caseId}`,data);
};

export const updateStep = (model) => {
  return axios.put(`${environment.endpoint}${environment.apiPath.dangerousCase.main}/Step`, model);
};

// export const createUser = (model) => {
//   return axios.post(`${environment.endpoint}${environment.apiPath.dangerousCase.main}`, model);
// };
