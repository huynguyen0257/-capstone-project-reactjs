import axios from "axios";
import { environment } from "../environment";

export const checkYPR = (image) => {
    return axios
      .post(`${environment.endpoint}${environment.apiPath.user.main}/FaceCheckYPR`, {
          "Image": image
      })
  };
  