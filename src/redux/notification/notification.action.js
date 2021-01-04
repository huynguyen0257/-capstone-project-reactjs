import { SET_NOTIFICATIONS, PUSH_NOTIFICATION, UPDATE_IS_READ, UPDATE_IS_READ_ALL } from "./notification.type";

export const setListNotification = (notifications) => {
  return {
    type: SET_NOTIFICATIONS,
    payload: notifications,
  };
};

export const pushNotification = (notification) => {
  return {
    type: PUSH_NOTIFICATION,
    payload: notification,
  };
};

export const updateIsRead = (id) => {
  return {
    type: UPDATE_IS_READ,
    payload: id,
  };
};

export const updateIsReadAll = () => {
  return {
    type: UPDATE_IS_READ_ALL,
  }
}