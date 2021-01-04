import axios from "axios";
import { environment } from "../environment";
import { serialize } from '.'

export const getStudents = (params) => {
  return axios.get(`${environment.endpoint}${environment.apiPath.student.main}?${serialize(params)}`);
};
export const getStudentsByGuard = (query) => {
  return axios.get(`${environment.endpoint}${environment.apiPath.student.main}?${serialize(query)}`);
};
export const getStudentById = (id) => {
  return axios.get(`${environment.endpoint}${environment.apiPath.student.main}/${id}`);
};
export const createListStudent = (students) => {
  return axios.post(`${environment.endpoint}${environment.apiPath.student.main}/List`, students);
};
export const registerToEnterDorm = (student) => {
  return axios.put(`${environment.endpoint}${environment.apiPath.student.main}`, student);
};