import axios from "axios";
import { environment } from "../environment";

export const getRoles = () => {
    return axios.get(`${environment.endpoint}${environment.apiPath.role.main}`);
  };