import {
  SUBMIT_MAIL_OK,
  SUBMIT_MAIL_REQ,
  SUBMIT_MAIL_FAILED,
  SUBMIT_CODE_REQ,
  SUBMIT_CODE_OK,
  SUBMIT_CODE_FAILED,
  SUBMIT_PASSWORD_REQ,
  SUBMIT_PASSWORD_FAILED,
  SUBMIT_PASSWORD_OK,
} from "./auth.type";

const initialState = {
  loading: false,
  mail: null,
  error: null,
  step: 0,
  code: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_MAIL_REQ:
      return {
        ...state,
        loading: true,
        mail: action.payload,
      };
    case SUBMIT_MAIL_OK:
      return {
        ...state,
        loading: false,
        step: 1,
      };
    case SUBMIT_MAIL_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SUBMIT_CODE_REQ:
      return {
        ...state,
        loading: true,
      };
    case SUBMIT_CODE_OK:
      return {
        ...state,
        loading: false,
        step: 2,
        code: action.payload
      };
    case SUBMIT_CODE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SUBMIT_PASSWORD_REQ:
      return {
        ...state,
        loading: true,
      };
    case SUBMIT_PASSWORD_OK:
      return {
        ...state,
        loading: false,
        step: 3,
      };
    case SUBMIT_PASSWORD_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
