import axios from "axios";
import { environment } from "../environment";

export const getNotifications = () => {
  return axios.get(
    `${environment.endpoint}${environment.apiPath.notification.main}`
  );
};

export const readNotification = (id) => {
  return axios.put(`${environment.endpoint}${environment.apiPath.notification.main}/${id}`)
}

export const readAllNotification = () => {
  return axios.put(`${environment.endpoint}${environment.apiPath.notification.main}/MarkAllRead`)
}