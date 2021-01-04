import axios from "axios";
import { environment } from "../environment";

export const getPolicyLevels = () => {
  return axios.get(`${environment.endpoint}${environment.apiPath.policyLevel.main}`);
};
export const getPolicies = () => {
  return axios.get(`${environment.endpoint}${environment.apiPath.policy.main}`);
};