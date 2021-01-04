import { SET_CASE_HISTORY_STATUS } from "./case.type";

export const setCaseHistoryStatus = (caseHistoryStatus) => {
  return {
    type: SET_CASE_HISTORY_STATUS,
    payload: caseHistoryStatus,
  };
};