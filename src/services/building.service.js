import axios from "axios";
import { environment } from "../environment";
import { serialize } from '.'

export const getBuildings = () => {
  return axios.get(
    `${environment.endpoint}${environment.apiPath.building.main}`
  );
};
export const getSecurityMans = () => {
  return axios.get(
    `${environment.endpoint}${environment.apiPath.securityMan.main}`
  );
};
export const getBuildingGuard = () => {
  return axios.get(
    `${environment.endpoint}${environment.apiPath.securityMan.main}${environment.apiPath.securityMan.building_guard}`
  );
};
export const getBuildingById = (id) => {
  return axios.get(
    `${environment.endpoint}${environment.apiPath.building.main}/${id}`
  );
};
export const updateBuilding = (building) => {
  return axios.put(
    `${environment.endpoint}${environment.apiPath.building.main}`,
    building
  );
};
export const updateBuildingImage = (data,id) => {
  return axios.put(
    `${environment.endpoint}${environment.apiPath.building.main}${environment.apiPath.building.image}/${id}`,
    data
  );
};
export const createListBuilding = (buildings) => {
  return axios.post(
    `${environment.endpoint}${environment.apiPath.building.main}/List`,
    buildings
  );
};

export const getBuildingByGuard = () => {
  return axios.get(
    `${environment.endpoint}${environment.apiPath.building.main}/Guard`,
  );
};
