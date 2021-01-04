
import {
    SUBMIT_REGISTERINTODORM,
    SET_RELATIVE,
    SET_RELATIVE_REGISTER_STEP,
    SUBMIT_REGISTER_RELATIVE,
    SET_TO_FIRST_STEP,
    SET_SELECTED_STUDENT
  } from "./student.type";
  
  export const submitRegisterIntoDorm = (studentRegister) => {
    return {
      type:  SUBMIT_REGISTERINTODORM,
      payload: studentRegister,
    };
  };

  export const setSelectedStudent = (student) => {
    return {
      type:  SET_SELECTED_STUDENT,
      payload: student,
    };
  };
  export const setRelative = (relative) => {
    return {
      type:  SET_RELATIVE,
      payload: relative,
    };
  };
  export const setRelativeRegisterStep = (step) => {
    return {
      type:  SET_RELATIVE_REGISTER_STEP,
      payload: step,
    };
  };
  export const submitRelative = () => {
    return {
      type:  SUBMIT_REGISTER_RELATIVE,
      payload: null,
    };
  };