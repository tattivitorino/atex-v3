import _ from 'lodash';

import {
  FETCHING_ATENDIMENTOS,
  LOADING_ATENDIMENTOS,
  UPDATING_ATENDIMENTOS,
  REQUEST_ATENDIMENTO_ERROR,
  CLEAR_ATENDIMENTO_ERROR,
  SEARCH_ATENDIMENTO_TEXT,
  FETCH_ATENDIMENTOS_SUCCESS,
  FETCH_ATENDIMENTO_SUCCESS,
  CREATE_ATENDIMENTO_SUCCESS,
  UPDATE_ATENDIMENTO_SUCCESS,
  DELETE_ATENDIMENTO_SUCCESS
} from '../actions';

const INITIAL_STATE = {
  fetching: false,
  loading: false,
  updating: false,
  success: true,
  error: null,
  atendimentoList: [],
  atendimento: {},
  searchText: '',
  limit: 20,
  count: 0,
  page: 1,
  next: null,
  previous: null
}

const sortList = (list, key, order) => {
  return _.orderBy(list, [key], [order]);
}

const atendimentos = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHING_ATENDIMENTOS:
      return { ...state, fetching: action.fetching, error: null, success: null }

    case LOADING_ATENDIMENTOS:
      return { ...state, loading: action.loading, error: null, success: null }

    case UPDATING_ATENDIMENTOS:
      return { ...state, updating: action.updating, error: null, success: null }

    case REQUEST_ATENDIMENTO_ERROR:
      return {
        ...state,
        fetching: false,
        loading: false,
        updating: false,
        success: null,
        error: action.error
      }

    case SEARCH_ATENDIMENTO_TEXT:
      return { ...state, searchText: action.text }

    case FETCH_ATENDIMENTOS_SUCCESS:
      const { results, count, page, next, previous } = action.data;
      const l = page === 1 ? results : [...state.atendimentoList, ...results];
      return {
        ...state,
        fetching: false,
        loading: false,
        updating: false,
        success: null,
        atendimentoList: l,
        count,
        page,
        next,
        previous
      }

    case FETCH_ATENDIMENTO_SUCCESS:
      return {
        ...state,
        fetching: false,
        loading: false,
        updating: false,
        success: null,
        atendimento: action.data
      }

    case CREATE_ATENDIMENTO_SUCCESS:
      const ll = [action.data].concat(state.atendimentoList);
      return {
        ...state,
        updating: false,
        success: true,
        atendimentoList: ll
      }

    case UPDATE_ATENDIMENTO_SUCCESS:
      const { id, ...rest } = action.data;
      return {
        ...state,
        updating: false,
        success: true,
        atendimento: {
          ...state.atendimento,
          ...action.data
        },
        atendimentoList: state.atendimentoList.map(item => {
          if (item.id === id) {
            return { ...item, ...rest }
          }
          return item;
        })
      }

    case DELETE_ATENDIMENTO_SUCCESS:
      return {
        ...state,
        fetching: false,
        loading: false,
        updating: false,
        atendimentoList: state.atendimentoList.filter(item => item.id !== action.id)
      };

    case CLEAR_ATENDIMENTO_ERROR:
      return { ...state, error: null }

    default:
      return state;
  }
}

export default atendimentos;