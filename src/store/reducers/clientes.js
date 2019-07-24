import _ from 'lodash';

import {
  FETCHING_CLIENTES,
  LOADING_CLIENTES,
  UPDATING_CLIENTES,
  REQUEST_CLIENTE_ERROR,
  CLEAR_CLIENTE_ERROR,
  SEARCH_CLIENTE_TEXT,
  SEARCH_PROFISSAO_TEXT,
  FETCH_CLIENTES_SUCCESS,
  FETCH_CLIENTE_SUCCESS,
  CREATE_CLIENTE_SUCCESS,
  UPDATE_CLIENTE_SUCCESS,
  UPLOAD_AVATAR_SUCCESS,
  FETCH_DCAD_SUCCESS,
  FETCH_PROFISSOES_SUCCESS,
  CREATE_CLIENTE_DOCUMENTO_SUCCESS,
  DELETE_CLIENTE_DOCUMENTO_SUCCESS,
  UPLOADING_AVATAR,

  UPLOADING_DOCUMENTO_QUEUE,
  UPLOADING_DOCUMENTO_QUEUE_ERROR,
  UPLOAD_DOCUMENTO_QUEUE_PROGRESS,

  UPLOAD_CLIENTE_DOCUMENTO_SUCCESS
} from '../actions';

const INITIAL_STATE = {
  fetching: false,
  loading: false,
  updating: false,
  uploading: false,
  success: null,
  error: null,
  clienteList: [],
  cliente: {},
  searchText: '',
  searchProfissaoText: '',
  limit: 20,
  count: 0,
  page: 1,
  next: null,
  previous: null,
  profissaoList: [],
  nacionalidadeList: [],
  estadoCivilList: [],
  sexoList: [
    { id: "F", nome: "Feminino" },
    { id: "M", nome: "Masculino" }
  ]
}

const sortList = (list, key, order) => {
  return _.orderBy(list, key, order);
}

const getListItemById = (list, id) => {
  return _.find(list, { id }) || null;
}

const clientes = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHING_CLIENTES:
      return { ...state, fetching: action.fetching, error: null, success: null }

    case LOADING_CLIENTES:
      return { ...state, loading: action.loading, error: null, success: null }

    case UPDATING_CLIENTES:
      return { ...state, updating: action.updating, error: null, success: null }

    case UPLOADING_AVATAR:
      return { ...state, uploading: action.uploading, error: null, success: null }

    case REQUEST_CLIENTE_ERROR:
      return {
        ...state,
        fetching: false,
        loading: false,
        updating: false,
        uploading: false,
        success: null,
        error: action.error
      }

    case SEARCH_CLIENTE_TEXT:
      return { ...state, searchText: action.text }

    case SEARCH_PROFISSAO_TEXT:
      return { ...state, searchProfissaoText: action.text }

    case FETCH_CLIENTES_SUCCESS:
      const { results, count, page, next, previous } = action.data;
      const l = page === 1 ? results : [...state.clienteList, ...results];
      return {
        ...state,
        fetching: false,
        loading: false,
        updating: false,
        clienteList: l,
        count,
        page,
        next,
        previous
      }

    case FETCH_DCAD_SUCCESS:
      //console.log(action.data);
      const { results: list, node } = action.data;
      const lstr = node === 'estado-civil' ? 'estadoCivilList' : `${node}List`;
      return {
        ...state,
        [lstr]: list
      }

    case FETCH_PROFISSOES_SUCCESS:
      return {
        ...state,
        profissaoList: action.data
      }


    case FETCH_CLIENTE_SUCCESS:
      const { profissao, estado_civil, sexo, nacionalidade } = action.data;
      const profData = getListItemById(state.profissaoList, profissao);
      const estCivilData = getListItemById(state.estadoCivilList, estado_civil);
      const sexData = getListItemById(state.sexoList, sexo);
      const nacData = getListItemById(state.nacionalidadeList, nacionalidade);

      return {
        ...state,
        fetching: false,
        cliente: { ...action.data, profData, estCivilData, sexData, nacData }
      }

    case CREATE_CLIENTE_SUCCESS:
      const ll = [action.data].concat(state.clienteList);
      return {
        ...state,
        updating: false,
        success: true,
        cliente: {
          ...state.cliente,
          ...action.data
        },
        clienteList: sortList(ll, ['nome'], ['asc'])
      }

    case UPDATE_CLIENTE_SUCCESS:
      const { id, ...rest } = action.data;
      const lll = state.clienteList.map(item => {
        if (item.id === id) {
          return { ...item, ...rest }
        }
        return item;
      })
      return {
        ...state,
        updating: false,
        success: true,
        cliente: {
          ...state.cliente,
          ...action.data
        },
        clienteList: sortList(lll, ['nome'], ['asc'])
      }

    case UPLOAD_AVATAR_SUCCESS:
      const { id: cid, avatar } = action.data;
      return {
        ...state,
        uploading: false,
        cliente: {
          ...state.cliente,
          avatar: avatar
        },
        clienteList: state.clienteList.map(item => {
          if (item.id === cid) {
            return { ...item, avatar }
          }
          return item;
        })
      };

    case CREATE_CLIENTE_DOCUMENTO_SUCCESS:
      return {
        ...state,
        cliente: {
          ...state.cliente,
          documentos: [action.data].concat(state.cliente.documentos)
        }
      }

    case UPLOADING_DOCUMENTO_QUEUE:
      return {
        ...state,
        cliente: {
          ...state.cliente,
          documentos: state.cliente.documentos ? state.cliente.documentos.map(item => {
            if (item.id === action.data.id) {
              return { ...item, uploadingDoc: true, errorDoc: null }
            }
            return item;
          }) : null
        }
      };

    case UPLOAD_DOCUMENTO_QUEUE_PROGRESS:
      return {
        ...state,
        cliente: {
          ...state.cliente,
          documentos: state.cliente.documentos ? state.cliente.documentos.map(item => {
            if (item.id === action.data.id) {
              return { ...item, progressDoc: action.data.progress }
            }
            return item;
          }) : null
        }
      };

    case UPLOADING_DOCUMENTO_QUEUE_ERROR:
      return {
        ...state,
        cliente: {
          ...state.cliente,
          documentos: state.cliente.documentos ? state.cliente.documentos.map(item => {
            if (item.id === action.data.id) {
              return { ...item, uploadingDoc: false, errorDoc: action.data.error, progressDoc: 0 }
            }
            return item;
          }) : null
        }
      };

    case UPLOAD_CLIENTE_DOCUMENTO_SUCCESS:
      //console.log('CLIENTE REDUCER ACTION.DATA:', action.data)
      const { timestamp } = action.data;
      return {
        ...state,
        cliente: {
          ...state.cliente,
          documentos: state.cliente.documentos ? state.cliente.documentos.map(item => {
            if (item.id === timestamp) {
              return { ...item, progressDoc: 100, uploadingDoc: false, ...action.data }
            }
            return item;
          }) : null
        }
      }

    case DELETE_CLIENTE_DOCUMENTO_SUCCESS:
      return {
        ...state,
        cliente: {
          ...state.cliente,
          documentos: state.cliente.documentos ? state.cliente.documentos.filter(item => item.id !== action.id) : null
        }
      }

    case CLEAR_CLIENTE_ERROR:
      return { ...state, error: null }

    default:
      return state;
  }
}

export default clientes;