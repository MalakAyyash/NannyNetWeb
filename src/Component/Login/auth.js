import Cookies from 'js-cookie';

let authToken = null;
let customerId = null;

export const setAuthToken = (token, id) => {
  authToken = token;
  customerId = id;
  Cookies.set('authToken', token, { expires: 20 });
  Cookies.set('customerId', id, { expires: 20 });
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = Cookies.get('authToken');
  }
  return authToken;
};

export const getCustomerId = () => {
  if (!customerId) {
    customerId = Cookies.get('customerId');
  }
  return customerId;
};

export const clearAuthData = () => {
  authToken = null;
  customerId = null;
  Cookies.remove('authToken');
  Cookies.remove('customerId');
};
