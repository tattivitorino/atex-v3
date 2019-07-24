import Api from './base.api';
import moment from 'moment';

import { AsyncStorage, NetInfo } from 'react-native';
import {
  PROFISSAOLIST_KEY,
  ESTADOCIVILLIST_KEY,
  NACIONALIDADELIST_KEY
} from '../config';

const ENDPOINT = '/pre-cadastros';
const DADOS_CADASTRAIS_ENDPOINT = '/dados-cadastrais';

/**
 * @class ClientsApi
 * Classe responsável por fazer as chamadas para a Api 
 * do módulo de Clientes
 */

class ClientesApi {

  /**
   * @function fetchClientes
   * Lista de clientes por usuário (sendo colaboradores externos)
   * @param params object no formato da Config.params do axios
   * @return Promise
   */
  static async fetchClientes(params) {
    try {
      //const path = `${ENDPOINT}/${uid}`;
      const path = `${ENDPOINT}/`;
      const data = await Api.get(path, { params });
      return data;
    } catch (e) {
      throw (e)
    }
  }

  /**
   * @function fetchCliente
   * Cliente por id
   * @param id number id do Cliente
   * @return Promise
   */
  static async fetchCliente(id) {
    try {
      const path = `${ENDPOINT}/${id}/`;
      const data = await Api.get(path);
      return data;
    } catch (e) {
      throw (e)
    }
  }

  /**
   * @function updateCliente
   * Cliente por id
   * @param data obj
   * @return Promise
   */
  static async updateCliente(data) {
    //console.log(data);
    try {
      let path = `${ENDPOINT}/`;
      let response;

      if (data.id) {
        path += `${data.id}/`;
        response = await Api.put(path, data);
      }
      else {
        response = await Api.post(path, data);
      }
      return response;
    } catch (e) {
      throw (e)
    }
  }

  static async uploadAvatar(id, data) {
    try {
      const path = `${ENDPOINT}/${id}/`;
      const response = await Api.patch(path, data);
      return response;
    } catch (e) {
      throw (e)
    }
  }

  static async fetchDadosCadastrais(node) {
    try {

      const key = node === 'estado-civil' ? ESTADOCIVILLIST_KEY : NACIONALIDADELIST_KEY;
      const storageData = await AsyncStorage.getItem(key);
      //console.log('DATA FROM STORAGE', storageData);

      if (storageData !== null) {
        const { timestamp, results } = JSON.parse(storageData);
        if (results && results.length) return results;
        await AsyncStorage.removeItem(key)
      }

      const now = moment().valueOf();

      const path = `${DADOS_CADASTRAIS_ENDPOINT}/${node}/`;
      const data = await Api.get(path);
      //console.log(data);


      const { results } = data;
      if (results && results.length) {
        await AsyncStorage.setItem(key, JSON.stringify({ timestamp: now, results }));
      }
      return results;

    } catch (e) {
      throw (e)
    }
  }

  static async fetchProfissaoList() {
    try {

      //const keys = await AsyncStorage.getAllKeys();
      //console.log('STORAGE KEYS: ', keys);

      const storageData = await AsyncStorage.getItem(PROFISSAOLIST_KEY);
      if (storageData !== null) {
        const { timestamp, results } = JSON.parse(storageData);
        if (results && results.length) return results;
        await AsyncStorage.removeItem(PROFISSAOLIST_KEY)
      }

      const now = moment().valueOf();

      const path = `${DADOS_CADASTRAIS_ENDPOINT}/profissao/`;
      const data = await Api.get(path);
      //console.log(data);


      const { results } = data;
      if (results && results.length) {
        await AsyncStorage.setItem(PROFISSAOLIST_KEY, JSON.stringify({ timestamp: now, results }));
      }

      //console.log('SAVE TO STORAGE', save);
      return results;

    } catch (e) {
      throw (e)
    }
  }

}

export default ClientesApi;