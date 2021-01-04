import { SET_CASE_HISTORY_STATUS } from "./case.type";

const initialState = {
  caseHistoryStatus: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CASE_HISTORY_STATUS:
      return {
        ...state,
        caseHistoryStatus: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
