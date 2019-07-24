import Api from './base.api';
const ENDPOINT = '/users';

/**
 * @class UserApi
 * Classe responsável por fazer as chamadas para a Api 
 * do módulo de Usuário
 */

class UsersApi {

  static async fetchUsers(params) {
    try {
      const path = `${ENDPOINT}/`;
      const config = { params };
      const data = await Api.get(path, config);
      return data;
    } catch (e) {
      throw (e)
    }
  }

  static async fetchUser(id) {
    try {
      const path = `${ENDPOINT}/${id}/`;
      const data = await Api.get(path);
      return data;
    } catch (e) {
      throw (e)
    }
  }

  static fetchUserPromise(id) {
    const path = `${ENDPOINT}/${id}/`;
    return Api.get(path)
      .then(user => {
        return Promise.resolve(user)
      })
      .catch(err => {
        return Promise.reject(err);
      })
  }

  static async saveUser(data) {
    try {
      let path = `${ENDPOINT}/`;
      let response;

      if (data.id) {
        path += `${data.id}/`;
        response = await Api.put(path);
      }
      else {
        response = await Api.post(path);
      }
      return response;
    } catch (e) {
      throw (e)
    }
  }

}

export default UsersApi;