import {
  SET_NOTIFICATIONS,
  PUSH_NOTIFICATION,
  UPDATE_IS_READ,
  UPDATE_IS_READ_ALL
} from "./notification.type";

const initialState = {
  notifications: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };
    case PUSH_NOTIFICATION:
      if (state.notifications == null) state.notifications = [];
      state.notifications.unshift(action.payload);
      return {
        ...state,
        notifications: state.notifications,
      };
    case UPDATE_IS_READ:
      state.notifications.forEach(e => {if(e.Id === action.payload) e.IsRead = true})
      return {
        ...state,
        notifications: state.notifications,
      };
    case UPDATE_IS_READ_ALL:
      state.notifications.forEach(e => {e.IsRead = true})
      return {
        ...state,
        notifications: state.notifications,
      };
    default:
      return state;
  }
};

export default reducer;
