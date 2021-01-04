import axios from "axios";
import { environment } from "../environment";
import { serialize } from '.'

export const getRelatives = (query) => {
  return axios.get(
    `${environment.endpoint}${environment.apiPath.relative.main}s?${serialize(query)}`
  );
};
export const createRelative = (relative) => {
  return axios.post(`${environment.endpoint}${environment.apiPath.relative.main}`, relative);
};
export const checkOut = (id) => {
  return axios.put(`${environment.endpoint}${environment.apiPath.relative.main}/${id}/${environment.apiPath.relative.checkOut}`);
}

export const registerRelativeFace = (data) => {
  return axios.put(`${environment.endpoint}${environment.apiPath.relative.main}/RegisterFace`, data);
};