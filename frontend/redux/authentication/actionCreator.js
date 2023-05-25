import actions from './actions';
import axios from 'axios';

const {
  loginBegin,
  loginSuccess,
  loginErr,
  logoutBegin,
  logoutSuccess,
  logoutErr,
} = actions;

const login = async (dispatch, values, callback) => {
  dispatch(loginBegin());
  try {
    const response = await axios.post(
      `http://localhost:4000/api/login`,
      values,
    );
    if (response.data.errors) {
      dispatch(loginErr(response.data.errors));
    } else {
      localStorage.setItem('token', response.data.token);
      dispatch(loginSuccess(true));
      callback();
    }
  } catch (err) {
    dispatch(loginErr(err));
  }
};

const register = async (dispatch, values, callback) => {
  dispatch(loginBegin());
  try {
    const response = await axios.post(
      `http://localhost:4000/api/register`,
      values,
    );
    if (response.data.errors) {
      dispatch(loginErr('Registration failed!'));
    } else {
      dispatch(loginSuccess(false));
      callback();
    }
  } catch (err) {
    dispatch(loginErr(err));
  }
};

const logOut = async (dispatch, callback) => {
  dispatch(logoutBegin());
  try {
    localStorage.removeItem('token');
    dispatch(logoutSuccess(false));
    callback();
  } catch (err) {
    dispatch(logoutErr(err));
  }
};

export { login, logOut, register };
