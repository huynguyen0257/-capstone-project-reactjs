import {
  SUBMIT_MAIL_OK,
  SUBMIT_MAIL_REQ,
  SUBMIT_MAIL_FAILED,
  SUBMIT_CODE_REQ,
  SUBMIT_CODE_OK,
  SUBMIT_CODE_FAILED,
  SUBMIT_PASSWORD_FAILED,
  SUBMIT_PASSWORD_OK,
  SUBMIT_PASSWORD_REQ,
} from "./auth.type";

export const submitMailReq = (mail) => {
  return {
    type: SUBMIT_MAIL_REQ,
    payload: mail,
  };
};

export const submitMailOK = () => {
  return {
    type: SUBMIT_MAIL_OK,
  };
};

export const submitMailFailed = (error) => {
  return {
    type: SUBMIT_MAIL_FAILED,
    payload: error,
  };
};

export const submitCodeReq = () => {
  return {
    type: SUBMIT_CODE_REQ,
  };
};

export const submitCodeOK = (code) => {
  return {
    type: SUBMIT_CODE_OK,
    payload: code
  };
};

export const submitCodeFailed = (error) => {
  return {
    type: SUBMIT_CODE_FAILED,
    payload: error,
  };
};

export const submitPasswordReq = () => {
  return {
    type: SUBMIT_PASSWORD_REQ,
  };
};

export const submitPasswordOK = () => {
  return {
    type: SUBMIT_PASSWORD_OK,
  };
};

export const submitPasswordFailed = (error) => {
  return {
    type: SUBMIT_PASSWORD_FAILED,
    payload: error,
  };
};
