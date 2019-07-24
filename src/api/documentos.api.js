import Api from './base.api';
import { UPLOAD_TIMEOUT } from '../config';
const DIRETORIOS_ENDPOINT = '/storage/diretorios';
const TIPOS_ENDPOINT = '/storage/tipos-de-documentos'
const DOCUMENTOS_ENDPOINT = '/storage/documentos'
/**
 * @class DocumentosApi
 * Classe responsável por fazer as chamadas para a Api 
 * do módulo de Documentos
 */

class DocumentosApi {

  /**
   * @function fetchDocumentoTipos
   * Lista de tipos de documentos
   * @return Promise
   */
  static async fetchDocumentoTipos() {
    try {
      const path = `${TIPOS_ENDPOINT}/`;
      const data = await Api.get(path);
      return data;
    } catch (e) {
      throw (e)
    }
  }

  /**
   * @function fetchDocumentos
   * Lista de documentos por pre-cadastro (diretorio)
   * @param id number id do diretorio que é relacionado com o pre-cadastro
   * @param params object no formato da Config.params do axios
   * @return Promise
   */
  static async fetchDocumentos(id, params) {
    try {
      const path = `${DIRETORIOS_ENDPOINT}/${id}/`;
      const data = await Api.get(path, { params });
      return data;
    } catch (e) {
      throw (e)
    }
  }

  /**
   * @function fetchDocumento
   * Documento por id
   * @param id number id do Documento
   * @return Promise
   */
  static async fetchDocumento(id) {
    try {
      const path = `${DOCUMENTOS_ENDPOINT}/${id}/`;
      const data = await Api.get(path);
      return data;
    } catch (e) {
      throw (e)
    }
  }

  /**
   * @function createDocumento
   * Documento por id
   * @param data obj
   * @return Promise
   */
  static async createDocumento(data) {
    try {
      //console.log('API DATA: ', data);
      const path = `${DOCUMENTOS_ENDPOINT}/`;
      const response = await Api.post(path, data, {
        headers: {
          'Content-Type': `multipart/form-data;`,
          'Accept': 'application/json'
        },
        onUploadProgress: progressEvent => {
          let pct = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log(pct)
        }
      });
      return response;
    }
    catch (e) {
      throw (e)
    }
  }

  /**
   * @function updateDocumento
   * Documento por id
   * @param data obj
   * @return Promise
   */
  static async updateDocumento(data) {
    //console.log(data);
    try {
      let path = `${DOCUMENTOS_ENDPOINT}/`;
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
   * @function uploadPromise
   * Upload Documento com upload progress dispatch to redux
   * @param data obj
   * @param onUploadProgress function
   * @return Promise
   */
  static uploadPromise(data, onUploadProgress, timeout) {
    const path = `${DOCUMENTOS_ENDPOINT}/`;
    return Api.post(path, data, {
      timeout,
      headers: {
        'Content-Type': `multipart/form-data;`,
        'Accept': 'application/json'
      },
      onUploadProgress
    })
  }


  /**
   * @function deleteDocumento
   * Deletar Documento por id
   * @param id number
   * @return Promise
   */
  static async deleteDocumento(id) {
    //console.log(data);
    try {
      let path = `${DOCUMENTOS_ENDPOINT}/${id}/`;
      let response = await Api.delete(path);
      return response;
    } catch (e) {
      throw (e)
    }
  }
}

export default DocumentosApi;