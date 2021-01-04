import axios from "axios";
import { environment } from "../environment";
import { serialize } from '.'
export const getConfiguration = (key) => {
  return axios.get(`${environment.endpoint}${environment.apiPath.configuration.main}/${key}`);
};
export const updateConfiguration = (data) => {
    return axios.put(`${environment.endpoint}${environment.apiPath.configuration.main}`, data);
  };
  