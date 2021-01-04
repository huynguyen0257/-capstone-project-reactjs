import { SET_POLICY_LEVEL,SET_POLICY } from "./policy.type";

export const setPolicyLevels = (policyLevels) => {
  return {
    type: SET_POLICY_LEVEL,
    payload: policyLevels,
  };
};
export const setPolicies = (policies) => {
  return {
    type: SET_POLICY,
    payload: policies,
  };
};