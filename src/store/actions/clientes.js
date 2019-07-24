export const FETCH_CLIENTES_REQUEST = 'FETCH_CLIENTES_REQUEST';
export const FETCH_CLIENTES_SUCCESS = 'FETCH_CLIENTES_SUCCESS';

export const FETCH_CLIENTE_REQUEST = 'FETCH_CLIENTE_REQUEST';
export const FETCH_CLIENTE_SUCCESS = 'FETCH_CLIENTE_SUCCESS';

export const CREATE_CLIENTE_REQUEST = 'CREATE_CLIENTE_REQUEST';
export const CREATE_CLIENTE_SUCCESS = 'CREATE_CLIENTE_SUCCESS';

export const UPDATE_CLIENTE_REQUEST = 'UPDATE_CLIENTE_REQUEST';
export const UPDATE_CLIENTE_SUCCESS = 'UPDATE_CLIENTE_SUCCESS';

export const CREATE_CLIENTE_DOCUMENTO_SUCCESS = 'CREATE_CLIENTE_DOCUMENTO_SUCCESS';
export const UPLOAD_CLIENTE_DOCUMENTO_SUCCESS = 'UPLOAD_CLIENTE_DOCUMENTO_SUCCESS';
export const DELETE_CLIENTE_DOCUMENTO_SUCCESS = 'DELETE_CLIENTE_DOCUMENTO_SUCCESS';

export const UPLOAD_AVATAR_REQUEST = 'UPLOAD_AVATAR_REQUEST';
export const UPLOAD_AVATAR_SUCCESS = 'UPLOAD_AVATAR_SUCCESS';

export const SEARCH_CLIENTE_TEXT = 'SEARCH_CLIENTE_TEXT';
export const SEARCH_PROFISSAO_TEXT = 'SEARCH_PROFISSAO_TEXT';

export const FETCH_DCAD_REQUEST = 'FETCH_DCAD_REQUEST';
export const FETCH_DCAD_SUCCESS = 'FETCH_DCAD_SUCCESS';

export const FETCH_PROFISSOES_REQUEST = 'FETCH_PROFISSOES_REQUEST';
export const FETCH_PROFISSOES_SUCCESS = 'FETCH_PROFISSOES_SUCCESS';

export const FETCH_COMBOLIST_REQUEST = 'FETCH_COMBOLIST_REQUEST';

export const FETCHING_CLIENTES = 'FETCHING_CLIENTES';
export const LOADING_CLIENTES = 'LOADING_CLIENTES';
export const UPDATING_CLIENTES = 'UPDATING_CLIENTES';
export const UPLOADING_AVATAR = 'UPLOADING_AVATAR';

export const UPLOADING_DOCUMENTO_QUEUE = 'UPLOADING_DOCUMENTO_QUEUE';
export const UPLOADING_DOCUMENTO_QUEUE_ERROR = 'UPLOADING_DOCUMENTO_QUEUE_ERROR';
export const UPLOAD_DOCUMENTO_QUEUE_PROGRESS = 'UPLOAD_DOCUMENTO_QUEUE_PROGRESS';

export const REQUEST_CLIENTE_ERROR = 'REQUEST_CLIENTE_ERROR';

export const CLEAR_CLIENTE_ERROR = 'CLEAR_CLIENTE_ERROR';


export const fetchClientesRequest = params => ({
  type: FETCH_CLIENTES_REQUEST,
  params
})
export const fetchClientesSuccess = data => ({
  type: FETCH_CLIENTES_SUCCESS,
  data
})


export const fetchClienteRequest = id => ({
  type: FETCH_CLIENTE_REQUEST,
  id
})
export const fetchClienteSuccess = data => ({
  type: FETCH_CLIENTE_SUCCESS,
  data
})

export const createClienteRequest = data => ({
  type: CREATE_CLIENTE_REQUEST,
  data
})
export const createClienteSuccess = data => ({
  type: CREATE_CLIENTE_SUCCESS,
  data
})

export const createClienteDocumentoSuccess = data => ({
  type: CREATE_CLIENTE_DOCUMENTO_SUCCESS,
  data
})
export const uploadClienteDocumentoSuccess = data => ({
  type: UPLOAD_CLIENTE_DOCUMENTO_SUCCESS,
  data
})
export const deleteClienteDocumentoSuccess = id => ({
  type: DELETE_CLIENTE_DOCUMENTO_SUCCESS,
  id
})


export const updateClienteRequest = data => ({
  type: UPDATE_CLIENTE_REQUEST,
  data
})
export const updateClienteSuccess = data => ({
  type: UPDATE_CLIENTE_SUCCESS,
  data
})

export const uploadAvatarRequest = data => ({
  type: UPLOAD_AVATAR_REQUEST,
  data
})
export const uploadAvatarSuccess = data => ({
  type: UPLOAD_AVATAR_SUCCESS,
  data
})

export const searchClienteText = text => ({
  type: SEARCH_CLIENTE_TEXT,
  text
})

export const searchProfissaoText = text => ({
  type: SEARCH_PROFISSAO_TEXT,
  text
})

export const fetchDcadRequest = node => ({
  type: FETCH_DCAD_REQUEST,
  node
})
export const fetchDcadSuccess = data => ({
  type: FETCH_DCAD_SUCCESS,
  data
})

export const fetchProfissoesRequest = () => ({
  type: FETCH_PROFISSOES_REQUEST
})
export const fetchProfissoesSuccess = data => ({
  type: FETCH_PROFISSOES_SUCCESS,
  data
})

export const fetchComboListRequest = () => ({
  type: FETCH_COMBOLIST_REQUEST
})


export const fetchingClientes = fetching => ({
  type: FETCHING_CLIENTES,
  fetching
})

export const loadingClientes = loading => ({
  type: LOADING_CLIENTES,
  loading
})

export const updatingClientes = updating => ({
  type: UPDATING_CLIENTES,
  updating
})

export const uploadingAvatar = uploading => ({
  type: UPLOADING_AVATAR,
  uploading
})

export const uploadingDocumentoQueue = data => ({
  type: UPLOADING_DOCUMENTO_QUEUE,
  data
})
export const uploadingDocumentoQueueError = data => ({
  type: UPLOADING_DOCUMENTO_QUEUE_ERROR,
  data
})
export const uploadDocumentoQueueProgress = data => ({
  type: UPLOAD_DOCUMENTO_QUEUE_PROGRESS,
  data
})

export const requestClienteError = error => ({
  type: REQUEST_CLIENTE_ERROR,
  error
})

export const clearClienteError = () => ({
  type: CLEAR_CLIENTE_ERROR
})