import axios from "axios";
import {
  environment
} from "../environment";
import {
  serialize
} from '.'

export const getUsers = (params) => {
  return axios.get(`${environment.endpoint}${environment.apiPath.user.main}?${serialize(params)}`);
};

export const getUserById = (id) => {
  return axios.get(`${environment.endpoint}${environment.apiPath.user.main}/${id}`);
};
export const getUserByCode = (code) => {
  return axios.get(`${environment.endpoint}${environment.apiPath.user.main}${environment.apiPath.user.getByCode}/${code}`);
};

export const updateUser = (user) => {
  return axios.put(`${environment.endpoint}${environment.apiPath.user.main}`, user);
};

export const createUser = (user) => {
  return axios.post(`${environment.endpoint}${environment.apiPath.user.main}`, user);
};

export const toggleActive = (id, value) => {
  return axios.put(`${environment.endpoint}${environment.apiPath.user.main}/${id}/${environment.apiPath.user.toggleActive}`, value);
}
export const uploadAvatar = (data) => {
  return axios.put(`${environment.endpoint}${environment.apiPath.user.main}/Avatar`, data);
}
export const uploadUserAvatar = (data, id) => {
  return axios.put(`${environment.endpoint}${environment.apiPath.user.main}/Avatar/${id}`, data);
}
export const removeFaceImage = (data) => {
  return axios.put(`${environment.endpoint}${environment.apiPath.user.main}/FaceImages`, data);
}
export const registerFace = (data) => {
  return axios.put(`${environment.endpoint}${environment.apiPath.user.main}/RegisterFace`, data);
}