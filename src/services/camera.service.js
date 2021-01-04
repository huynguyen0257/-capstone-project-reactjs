import axios from "axios";
import { environment } from "../environment";
import { serialize } from '.'
export const getCameras = (query) => {
  return axios.get(`${environment.endpoint}${environment.apiPath.camera.main}?${serialize(query)}`);
};

export const enableCamera = (id) => {
  return axios.put(`${environment.endpoint}${environment.apiPath.camera.main}/${id}${environment.apiPath.camera.enable}`);
};
export const disableCamera = (id) => {
  return axios.put(`${environment.endpoint}${environment.apiPath.camera.main}/${id}${environment.apiPath.camera.disable}`);
};
