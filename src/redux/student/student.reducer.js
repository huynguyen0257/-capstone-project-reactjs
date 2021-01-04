import {
    SUBMIT_REGISTERINTODORM,
    SET_RELATIVE,
    SUBMIT_REGISTER_RELATIVE,
    SET_RELATIVE_REGISTER_STEP,
    SET_SELECTED_STUDENT
  } from "./student.type";
  
  const initialState = {
    studentRegister: null,
    relative: null,
    relativeImageEnhance: null,
    relativeFaceImage: null,
    relativeRegisterStep: 0,
  };
  
  const studentReducer = (state = initialState, action) => {
    switch (action.type) {
      case SUBMIT_REGISTERINTODORM:
        return {
          ...state,
          studentRegister: action.payload,
        };
      case SET_SELECTED_STUDENT:
        return {
          ...state,
          studentRegister: action.payload,
        };
      case SET_RELATIVE:
        return {
          ...state,
          relative: action.payload,
          relativeRegisterStep : 1
        };
      case SET_RELATIVE_REGISTER_STEP:
        return {
          ...state,
          relativeRegisterStep : action.payload
        };
      case SUBMIT_REGISTER_RELATIVE:
        return {
          ...state,
          relative: action.payload,
          relativeRegisterStep : 4
        };
      default:
        return state;
    }
  };
  
  export default studentReducer;
  