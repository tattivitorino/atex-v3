import Api from './base.api';
const ENDPOINT = '/agendamentos';

/**
 * @class AtendimentosApi
 * Classe responsável por fazer as chamadas para a Api 
 * do módulo de Atendimentos
 */

class AtendimentosApi {

  /**
   * @function fetchAtendimentos
   * Lista de atendimentos por usuário (sendo colaboradores externos)
   * @param uid number id do usuário (colaborador externo)
   * @param params object no formato da Config.params do axios
   * @return Promise
   */
  static async fetchAtendimentos(params) {
    try {
      const path = `${ENDPOINT}/`;
      const data = await Api.get(path, { params });
      return data;
    } catch (e) {
      throw (e)
    }
  }

  /**
   * @function fetchAtendimento
   * Atendimento por id
   * @param id number id do Atendimento
   * @return Promise
   */
  static async fetchAtendimento(id) {
    try {
      const path = `${ENDPOINT}/${id}/`;
      const data = await Api.get(path);
      return data;
    } catch (e) {
      throw (e)
    }
  }

  /**
   * @function updateAtendimento
   * Atendimento por id
   * @param data obj
   * @return Promise
   */
  static async updateAtendimento(data) {
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

  /**
   * @function deleteAtendimento
   * Deletar Atendimento por id
   * @param id number
   * @return Promise
   */
  static async deleteAtendimento(id) {
    //console.log(data);
    try {
      let path = `${ENDPOINT}/${id}/`;
      let response = await Api.delete(path);
      return response;
    } catch (e) {
      throw (e)
    }
  }

}

export default AtendimentosApi;