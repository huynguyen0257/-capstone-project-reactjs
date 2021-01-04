import axios from "axios";
import { environment } from "../environment";

export const getUniversities = () => {
  return axios.get(`${environment.endpoint}${environment.apiPath.university.main}`);
};
export const getUniversityById = (id) => {
  return axios.get(`${environment.endpoint}${environment.apiPath.university.main}/${id}`);
};
export const createUniversity = (university) => {
  return axios.post(`${environment.endpoint}${environment.apiPath.university.main}`, university);
};
export const updateUniversity = (university) => {
  return axios.put(`${environment.endpoint}${environment.apiPath.university.main}`, university);
};