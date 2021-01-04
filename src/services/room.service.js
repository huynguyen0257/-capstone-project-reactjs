import axios from "axios";
import { environment } from "../environment";
import { serialize } from '.'

export const getRooms = (params) => {
    return axios.get(`${environment.endpoint}${environment.apiPath.room.main}?${serialize(params)}`);
  };
  export const getStudentsByRoom = (id) => {
    return axios.get(`${environment.endpoint}${environment.apiPath.room.main}/${id}`);
  };
 