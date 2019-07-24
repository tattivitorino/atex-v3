import {
  API_BASE_URL,
  API_TIMEOUT,
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY
} from '../config';

//https://github.com/axios/axios
import axios from 'axios';
import store from '../store';

import {
  getStorageItemAsync,
  setStorageItemAsync,
  deleteStorageItemAsync
} from '../services/PersistService';

import { tokenRefreshSuccess, logoutRequest } from '../store/actions';

const JWTDecode = require('jwt-decode');

export const LOGIN_ENDPOINT = '/token/';
export const LOGOUT_ENDPOINT = '/logout';
export const PASSWORD_ENDPOINT = '/password/request_new_password';
export const REFRESH_TOKEN_ENDPOINT = '/token/refresh/';
export const DEVICE_DATA_ENDPOINT = '/pushtoken/login/'
export const USER_ENDPOINT = '/users';

export const setAuthHeader = (token = null) => {
  if (token) Api.defaults.headers['Authorization'] = `Bearer ${token}`;
  else Api.defaults.headers['Authorization'] = null;
}

//https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
// Função que verifica e retorna a mensagem de erro
const parseError = error => {
  let msg;
  if (error.response) {
    switch (error.response.status) {
      case 0:
        msg = 'ERRO 0: Erro desconhecido.';
        break;
      case 400:
        const errorData = error.response.data;
        msg = 'Verificar os campos: \n';
        Object.keys(errorData).forEach((key, index) => {
          msg += `${key.toUpperCase()} - `;
          errorData[key].forEach((k, i) => {
            if (i > 0) msg += '\n';
            msg += `${errorData[key][i]}`;
          })
        })
        break;
      case 401:
        //msg = 'ERRO 401: Requisição não autorizada. URL: ' + error.config.url;
        msg = `ERRO 401: ${error.response.data.detail}.`;
        break;
      case 404:
        msg = 'ERRO 404: Recurso não encontrado.';
        break;
      case 405:
        msg = 'ERRO 405: Método não permitido.';
        break;
      case 500:
        msg = 'ERRO 500: Erro interno de servidor.';
        break;
      case 504:
        msg = 'ERRO 504: Requisição expirada.';
        break;
      default:
        msg = 'Erro desconhecido.';
    }
    if (error.response.status != 400) msg += ` URL: ${error.config.url}`;
  }
  else if (error.request) {
    msg = 'Erro na requisição.';
    msg += ` URL: ${error.config.url}`;
  } else {
    msg = error.message;
  }
  return msg;
}

// Criar a instância do Axios 
const Api = axios.create({
  baseURL: API_BASE_URL,
  responseType: 'json',
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
});

// apenas logando o request para verificar parametros
Api.interceptors.request.use(
  config => {
    console.log('RequestInterceptor REQUEST CONFIG: ', config.method, config.url);
    if (config.data) console.log('RequestInterceptor REQUEST DATA: ', JSON.stringify(config.data));
    return config;
  },
  err => Promise.reject(err)
);

let isFetchingToken = false;
let tokenSubscribers = [];

/**
 * Se tivermos outras requisições enquanto o "isFetchingToken" = true
 * elas entrarão na fila aqui
 */
const subscribeTokenRefresh = cb => {
  tokenSubscribers.push(cb);
}

/**
 * No refresh do token chamamos as funções que estão na fila
 */
const onTokenRefreshed = (err, token) => {
  tokenSubscribers.map(cb => cb(err, token));
}

const handleRefreshTokenExpired = (error = null) => {
  //console.log('HANDLE REFRESH TOKEN EXPIRED: ', error);
  store.dispatch(logoutRequest())
}

/*
  Response Schema
  response.data = provided by the server
  response.status = 200, 300, 500 and so on
  response.statusText = HTTP Status message
  response.headers
  response.config
  response.request
  when using .then the response does not come with response.request
*/
const responseSuccess = response => {
  //console.log('ResponseInterceptor RESPONSE: ', JSON.stringify(response.status))

  if ((response.status >= 200 && response.status <= 207) && response.data) {
    return response.data;
  }

  //verificação de status e response para outras APIS eg. randomuser.me
  if (response.status == 200 && response.error) {
    return Promise.reject({ message: response.error.message });
  }

  // verificação de outro erro qualquer
  return Promise.reject({ message: `Requisição completou mas com status: ${response.status} e texto: ${response.statusText}` });
}

/**
   * https://gist.github.com/alfonmga/96474f6adb6ed8dee8bc8bf8627c0ae1
   * lidar com token expirado
   * obs importante no link acima:
   * IMPORTANT: if an invalid refresh token is sent to our API endpoint /auth/refresh_access_token BACKEND MUST RETURN A 403 HTTP CODE NOT A 401 HTTP CODE otherwise it will produce an infinite loop. BTW, also login API endpoint must return a 403 if invalid credentials are provided or 423 if account is locked/banned.
   * 
   * https://www.npmjs.com/package/axios-auth-refresh
   * Axios plugin that makes it easy to implement automatic refresh of authorization via axios' interceptors. 
   * 
   * https://github.com/functionalStoic/my-idea-pool-client/blob/master/src/api/utils/axiosInstance.js
*/

/**
 * error.response.data object
 * error.response.data.code string "token_not_valid"
 * {
    "detail": "Given token not valid for any token type",
    "code": "token_not_valid",
    "messages": [
      {
        "token_class": "AccessToken",
        "token_type": "access",
        "message": "Token is invalid or expired"
      }
    ]
  }
*/

const responseError = error => {
  //console.log('ResponseInterceptor ERROR: ', JSON.stringify(error))

  if (!error.response || !error.response.status) {

    if (error.code) {
      console.log('ResponseInterceptor ERROR: ', error.code)
      let msg = `${error.code} - SEM RESPOSTA DA API :(`;
      if (error.code === 'ECONNABORTED') msg = '*** A conexão com o servidor excedeu o limite de tempo! ***';
      return Promise.reject({ message: msg });
    }

    console.log('ResponseInterceptor ERROR: ', JSON.stringify(error))
    return Promise.reject({ message: 'SEM RESPOSTA DA API :(' });
  }

  if (error.response.status) {
    console.log(`ResponseInterceptor ERROR ${error.response.status}: `, JSON.stringify(error.response.data))
  }

  let msg = '';
  const originalRequest = error.config;

  if (originalRequest.url.includes(LOGIN_ENDPOINT)
    || originalRequest.url.includes(PASSWORD_ENDPOINT)) {
    msg = parseError(error);
    return Promise.reject({ message: msg })
  }

  if (error.response.status !== 401) {
    msg = parseError(error);
    return Promise.reject({ message: msg })
  }

  if (error.response.status === 401 && error.response.data.code !== 'token_not_valid') {
    msg = parseError(error);
    return Promise.reject({ message: msg })
  }

  if (!isFetchingToken) {
    isFetchingToken = true;
    //console.log('IS FETCHING TOKEN');
    let refreshToken;

    try {
      //recupera o refreshToken no state
      const state = store.getState();
      refreshToken = state.auth.refreshToken;
      //console.log('REFRESH TOKEN: ', refreshToken);
      if (!refreshToken) throw new Error('token não existe');

      const isRefreshTokenExpired = JWTDecode(refreshToken).exp < Date.now() / 1000;
      //console.log('EXPIRED REFRESH TOKEN?', isRefreshTokenExpired);
      if (isRefreshTokenExpired) throw new Error('token invalido');

    } catch (e) {
      onTokenRefreshed(e);
      tokenSubscribers = [];
      return handleRefreshTokenExpired(e);
    }

    Api.post(REFRESH_TOKEN_ENDPOINT, {
      refresh: refreshToken
    })
      .then(response => {
        //console.log('REFRESH TOKEN RESPONSE: ', response);

        const { access } = response;
        isFetchingToken = false;

        // retomar requisições que estão na fila
        onTokenRefreshed(null, access)
        tokenSubscribers = [];

        setAuthHeader(access)
        const { user_id, exp } = JWTDecode(access);
        const credentials = {
          access, refresh: refreshToken, uid: user_id, exp
        }
        store.dispatch(tokenRefreshSuccess(credentials));

        // joga o token na persistencia de novo
        try {
          setStorageItemAsync(AUTH_TOKEN_KEY, access);
        } catch (e) { }
      })
      .catch(err => {
        //console.log('REFRESH TOKEN ERROR: ', err);
        onTokenRefreshed(new Error('Não foi possível atualizar o seu token de acesso! Por favor faça login novamente!'));
        tokenSubscribers = [];
        return handleRefreshTokenExpired('Não foi possível atualizar o seu token de acesso! Por favor faça login novamente!');
      });

    //As requisições com 401 neste momento serão colocadas na fila

    const tokenSubscriber = new Promise((resolve, reject) => {
      subscribeTokenRefresh((err, token) => {
        if (err) return reject(err);

        Api.defaults.headers['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return resolve(Api(originalRequest));
      })
    });
    return tokenSubscriber;
  }

}

Api.interceptors.response.use(responseSuccess, responseError);

export default Api;
