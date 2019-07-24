import Api, {
  setAuthHeader,
  LOGIN_ENDPOINT,
  LOGOUT_ENDPOINT,
  PASSWORD_ENDPOINT,
  REFRESH_TOKEN_ENDPOINT,
  DEVICE_DATA_ENDPOINT
} from './base.api';

/**
 * @class AuthApi
 * Classe responsável por fazer as chamadas para a Api 
 * do módulo de Autenticação
 */

class AuthApi {

  /**
   * @function loginAsync
   * Faz a chamada de login
   * @param data object 
   * @return Promise
   * @data object
   * data.refresh = string, data.access = string
   */
  // TODO - ainda teremos outros dados a serem enviados no login
  // pois precisamos logar o DEVICE do usuário
  static async loginAsync(data) {
    try {
      const response = await Api.post(LOGIN_ENDPOINT, data);
      setAuthHeader(response.access);
      return response;
    } catch (e) {
      throw (e)
    }
  }

  /**
   * @function logoutAsync
   * @param uid number id do usuário
   * Faz a chamada de logout
   * @return Promise
   */
  // TODO - ainda teremos outros dados a serem enviados no logout
  // pois precisamos logar o DEVICE do usuário
  static async logoutAsync() {
    try {
      //const data = await Api.post(LOGOUT_ENDPOINT, {uid});
      setAuthHeader(null);
      return {};
    } catch (e) {
      throw (e)
    }
  }

  /**
   * @function recoverPasswordAsync
   * @param email string 
   * Envia o email para a recuperação de senha
   * @return Promise
   */
  static async recoverPasswordAsync(email) {
    try {
      const data = await Api.post(PASSWORD_ENDPOINT, {
        email
      });
      return data;
    } catch (e) {
      throw (e)
    }
  }

  /**
   * @function refreshTokenAsync
   * @param refreshToken string 
   * Faz a requisição de troca de authToken
   * @return Promise
   */
  static async refreshTokenAsync(refresh) {
    try {
      const data = await Api.post(REFRESH_TOKEN_ENDPOINT, {
        refresh
      });
      setAuthHeader(data.access);
      return data;
    } catch (e) {
      throw (e)
    }
  }

  /**
   * @function sendDeviceData
   * @param device object 
   * Envia dados do aparelho
   * @return Promise
   */
  static async sendDeviceDataAsync(device) {
    try {
      const data = await Api.post(DEVICE_DATA_ENDPOINT, device);
      return data;
    } catch (e) {
      throw (e)
    }
  }

  static sendDeviceDataPromise(device) {
    return Api.post(DEVICE_DATA_ENDPOINT, device)
      .then(data => {
        return Promise.resolve(data);
      })
      .catch(err => {
        return Promise.reject(err);
      })
  }

  /**
   * @function login
   * @param email string 
   * @param password string
   * Esta é apenas uma versão de teste sem async e await 
   * mas tratanto o then e o catch que é basicamente a 
   * mesma coisa!!!
   * @return Promise
   */
  static login = (email, password) => {
    return Api.post(LOGIN_ENDPOINT, {
      email, password
    })
      .then(data => {
        // set access token to headers
        setAuthHeader(data.access);
        return Promise.resolve(data);
      })
      .catch(err => {
        return Promise.reject(err);
      })
  }

}

export default AuthApi