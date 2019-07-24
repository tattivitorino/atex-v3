import _ from 'lodash';

import {
  FETCHING_DOCUMENTOS,
  LOADING_DOCUMENTOS,
  UPDATING_DOCUMENTOS,
  REQUEST_DOCUMENTO_ERROR,
  CLEAR_DOCUMENTO_ERROR,
  UPLOAD_DOCUMENTO_FAILURE,
  SEARCH_DOCUMENTO_TEXT,
  FETCH_DOCUMENTO_TIPOS_SUCCESS,
  FETCH_DOCUMENTOS_SUCCESS,
  FETCH_DOCUMENTOS_PENDENTES_SUCCESS,
  FETCH_DOCUMENTO_SUCCESS,
  CREATE_DOCUMENTO_SUCCESS,
  UPDATE_DOCUMENTO_SUCCESS,
  UPLOAD_DOCUMENTO_SUCCESS,
  DELETE_DOCUMENTO_SUCCESS,
  UPLOAD_DOCUMENTO_PROGRESS,

  UPLOADING_DOCUMENTO_QUEUE,
  UPLOADING_DOCUMENTO_QUEUE_ERROR,
  UPLOAD_DOCUMENTO_QUEUE_PROGRESS

} from '../actions';

const INITIAL_STATE = {
  fetching: false,
  loading: false,
  updating: false, //create docs
  progress: 0,
  success: null,
  error: null,
  documentoTipoList: [],
  documentoList: [],
  uploadingDocumentoPendente: false,
  documentoPendenteList: [],
  documento: {},
  searchText: ''
}

const sortList = (list, key, order) => {
  return _.orderBy(list, [key], [order]);
}

const documentos = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHING_DOCUMENTOS:
      return { ...state, fetching: action.fetching, error: null, success: null }

    case LOADING_DOCUMENTOS:
      return { ...state, loading: action.loading, error: null, success: null }

    case UPDATING_DOCUMENTOS:
      return { ...state, updating: action.updating, error: null, success: null }

    case REQUEST_DOCUMENTO_ERROR:
    case UPLOAD_DOCUMENTO_FAILURE:
      return {
        ...state,
        fetching: false,
        loading: false,
        updating: false,
        success: null,
        error: action.error
      }

    case UPLOAD_DOCUMENTO_PROGRESS:
      return {
        ...state,
        progress: action.progress
      };

    case SEARCH_DOCUMENTO_TEXT:
      return { ...state, searchText: action.text }

    case FETCH_DOCUMENTO_TIPOS_SUCCESS:
      return {
        ...state,
        documentoTipoList: action.data.results
      }

    case FETCH_DOCUMENTOS_SUCCESS:
      return {
        ...state,
        fetching: false,
        loading: false,
        updating: false,
        documentoList: action.data.documentos
      }

    case FETCH_DOCUMENTOS_PENDENTES_SUCCESS:
      return {
        ...state,
        uploadingDocumentoPendente: false,
        documentoPendenteList: action.data
      }

    case FETCH_DOCUMENTO_SUCCESS:
      return {
        ...state,
        fetching: false,
        loading: false,
        updating: false,
        documento: action.data
      }

    case CREATE_DOCUMENTO_SUCCESS:
      return {
        ...state,
        fetching: false,
        loading: false,
        updating: false,
        success: true,
        progress: 0,
        documentoList: [action.data].concat(state.documentoList)
      }

    case UPDATE_DOCUMENTO_SUCCESS:
      const { id, ...rest } = action.data;
      return {
        ...state,
        fetching: false,
        loading: false,
        updating: false,
        success: true,
        progress: 0,
        documento: {
          ...state.documento,
          ...action.data
        },
        documentoList: state.documentoList.map(item => {
          if (item.id === id) {
            return { ...item, ...rest }
          }
          return item;
        })
      }

    case UPLOAD_DOCUMENTO_SUCCESS:
      //console.log('DOC REDUCER ACTION.DATA:', action.data)
      const { timestamp } = action.data;
      return {
        ...state,
        fetching: false,
        loading: false,
        updating: false,
        success: true,
        progress: 0,
        documento: {
          ...state.documento,
          progressDoc: 100,
          uploadingDoc: false,
          ...action.data
        },
        documentoList: state.documentoList.map(item => {
          if (item.id === timestamp) {
            return { ...item, progressDoc: 100, uploadingDoc: false, ...action.data }
          }
          return item;
        })
      }

    case DELETE_DOCUMENTO_SUCCESS:
      return {
        ...state,
        fetching: false,
        loading: false,
        updating: false,
        documentoList: state.documentoList.filter(item => item.id !== action.id)
      };

    case UPLOADING_DOCUMENTO_QUEUE:
      return {
        ...state,
        uploadingDocumentoPendente: true,
        documentoPendenteList: state.documentoPendenteList ? state.documentoPendenteList.map(item => {
          if (item.id === action.data.id) {
            return { ...item, uploadingDoc: true, errorDoc: null }
          }
          return item;
        }) : []
      }

    case UPLOADING_DOCUMENTO_QUEUE_ERROR:

      return {
        ...state,
        uploadingDocumentoPendente: false,
        documentoPendenteList: state.documentoPendenteList ? state.documentoPendenteList.map(item => {
          if (item.id === action.data.id) {
            return { ...item, uploadingDoc: false, errorDoc: action.data.error, progressDoc: 0 }
          }
          return item;
        }) : []
      }

    case UPLOAD_DOCUMENTO_QUEUE_PROGRESS:
      return {
        ...state,
        documentoPendenteList: state.documentoPendenteList ? state.documentoPendenteList.map(item => {
          if (item.id === action.data.id) {
            return { ...item, progressDoc: action.data.progress }
          }
          return item;
        }) : []
      }

    case CLEAR_DOCUMENTO_ERROR:
      return { ...state, error: null }

    default:
      return state;
  }
}

export default documentos;