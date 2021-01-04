import { setLocalStorage, clearLocalStorage,getLocalStorage } from "./localstorage.service";
import axios from "axios";
import { environment } from "../environment";

// authenticate user by pass data to cookie and local storage
export const authenticate = (data, Username, role, next) => {
  // setCookie('AccessToken', data.AccessToken)
  setLocalStorage("AccessToken", data.AccessToken);
  setLocalStorage("ExpiresIn", data.ExpiresIn);
  setLocalStorage("Username", Username);
  setLocalStorage("Role", role);

  next();
};

export const getToken = () => {
  return getLocalStorage("AccessToken");
}

export const getRole = () => {
  return getLocalStorage("Role");
}
export const getUsername = () => {
  return getLocalStorage("Username");
}
export const logOut = () => {
  clearLocalStorage();
};

export const isAuth = () => {
  console.log("check auth");
  if (process.browser) {
    const tokenChecked = localStorage.getItem("AccessToken");
    if (tokenChecked) {
      return true;
    } else {
      return false;
    }
  }
};

export const fetchLogin = (user) => {
  return axios
    .post(`${environment.endpoint}${environment.apiPath.auth.login}`, user)
    .then((response) => {
      return response.data
    })
};

export const fetchLogout = () => {
  return axios
    .post(`${environment.endpoint}${environment.apiPath.auth.logout}`)
};

export const checkToken = () => {
  return axios.get(`${environment.endpoint}${environment.apiPath.auth.main}`)
}

export const changePassword = (oldPassword, newPassword) => {
  return axios.put(`${environment.endpoint}${environment.apiPath.auth.main}`,{
    NewPassword: newPassword,
    OldPassword: oldPassword
  })
}

export const resetCode = (email) => {
  return axios
    .get(
      `${environment.endpoint}${environment.apiPath.auth.resetCode}?Email=${encodeURIComponent(email)}`
    );
  
};

export const checkCode = (email,code) => {
  return axios
    .post( `${environment.endpoint}${environment.apiPath.auth.checkCode}`, {
      Email: email,
      Code: code
    })
};

export const submitPassword = (data) => {
  return axios
    .post(`${environment.endpoint}${environment.apiPath.auth.resetPassword}`, data)
};
