export const FETCH_ATENDIMENTOS_REQUEST = 'FETCH_ATENDIMENTOS_REQUEST';
export const FETCH_ATENDIMENTOS_SUCCESS = 'FETCH_ATENDIMENTOS_SUCCESS';

export const FETCH_ATENDIMENTO_REQUEST = 'FETCH_ATENDIMENTO_REQUEST';
export const FETCH_ATENDIMENTO_SUCCESS = 'FETCH_ATENDIMENTO_SUCCESS';

export const CREATE_ATENDIMENTO_REQUEST = 'CREATE_ATENDIMENTO_REQUEST';
export const CREATE_ATENDIMENTO_SUCCESS = 'CREATE_ATENDIMENTO_SUCCESS';

export const UPDATE_ATENDIMENTO_REQUEST = 'UPDATE_ATENDIMENTO_REQUEST';
export const UPDATE_ATENDIMENTO_SUCCESS = 'UPDATE_ATENDIMENTO_SUCCESS';

export const DELETE_ATENDIMENTO_REQUEST = 'DELETE_ATENDIMENTO_REQUEST';
export const DELETE_ATENDIMENTO_SUCCESS = 'DELETE_ATENDIMENTO_SUCCESS';

export const SEARCH_ATENDIMENTO_TEXT = 'SEARCH_ATENDIMENTO_TEXT';

export const FETCHING_ATENDIMENTOS = 'FETCHING_ATENDIMENTOS';
export const LOADING_ATENDIMENTOS = 'LOADING_ATENDIMENTOS';
export const UPDATING_ATENDIMENTOS = 'UPDATING_ATENDIMENTOS';
export const REQUEST_ATENDIMENTO_ERROR = 'REQUEST_ATENDIMENTO_ERROR';

export const CLEAR_ATENDIMENTO_ERROR = 'CLEAR_ATENDIMENTO_ERROR';


export const fetchAtendimentosRequest = params => ({
  type: FETCH_ATENDIMENTOS_REQUEST,
  params
})
export const fetchAtendimentosSuccess = data => ({
  type: FETCH_ATENDIMENTOS_SUCCESS,
  data
})

export const fetchAtendimentoRequest = id => ({
  type: FETCH_ATENDIMENTO_REQUEST,
  id
})
export const fetchAtendimentoSuccess = data => ({
  type: FETCH_ATENDIMENTO_SUCCESS,
  data
})

export const createAtendimentoRequest = data => ({
  type: CREATE_ATENDIMENTO_REQUEST,
  data
})
export const createAtendimentoSuccess = data => ({
  type: CREATE_ATENDIMENTO_SUCCESS,
  data
})


export const updateAtendimentoRequest = data => ({
  type: UPDATE_ATENDIMENTO_REQUEST,
  data
})
export const updateAtendimentoSuccess = data => ({
  type: UPDATE_ATENDIMENTO_SUCCESS,
  data
})

export const deleteAtendimentoRequest = id => ({
  type: DELETE_ATENDIMENTO_REQUEST,
  id
})
export const deleteAtendimentoSuccess = id => ({
  type: DELETE_ATENDIMENTO_SUCCESS,
  id
})


export const searchAtendimentoText = text => ({
  type: SEARCH_ATENDIMENTO_TEXT,
  text
})


export const fetchingAtendimentos = fetching => ({
  type: FETCHING_ATENDIMENTOS,
  fetching
})

export const loadingAtendimentos = loading => ({
  type: LOADING_ATENDIMENTOS,
  loading
})

export const updatingAtendimentos = updating => ({
  type: UPDATING_ATENDIMENTOS,
  updating
})

export const requestAtendimentoError = error => ({
  type: REQUEST_ATENDIMENTO_ERROR,
  error
})

export const clearAtendimentoError = () => ({
  type: CLEAR_ATENDIMENTO_ERROR
})