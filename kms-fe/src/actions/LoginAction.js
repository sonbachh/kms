export const UPDATE_EMAIL = "loginReducer/UPDATE_EMAIL";
export const UPDATE_PASSWORD = "loginReducer/UPDATE_PASSWORD";
export const ON_LOGGEDIN = "loginReducer/ON_LOGGEDIN";

export const updateEmail = (val) => (disptch) => {
  disptch({
    type: UPDATE_EMAIL,
    payload: val,
  });
};

export const updatePassword = (val) => (disptch) => {
  disptch({
    type: UPDATE_PASSWORD,
    payload: val,
  });
};

export const onLoggedin = (val) => (disptch) => {
  disptch({
    type: ON_LOGGEDIN,
    payload: val,
  });
};
