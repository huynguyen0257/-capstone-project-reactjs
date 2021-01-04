import axios from "axios";
import { environment } from "../environment";

export const addToken = (model) => {
    return axios
      .post(`${environment.endpoint}${environment.apiPath.deviceToken.main}`, model)
      .then((response) => {
        return response.data
      })
  };