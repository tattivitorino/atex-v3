export const FETCH_DOCUMENTO_TIPOS_REQUEST = 'FETCH_DOCUMENTO_TIPOS_REQUEST';
export const FETCH_DOCUMENTO_TIPOS_SUCCESS = 'FETCH_DOCUMENTO_TIPOS_SUCCESS';

export const FETCH_DOCUMENTOS_REQUEST = 'FETCH_DOCUMENTOS_REQUEST';
export const FETCH_DOCUMENTOS_SUCCESS = 'FETCH_DOCUMENTOS_SUCCESS';

export const FETCH_DOCUMENTO_REQUEST = 'FETCH_DOCUMENTO_REQUEST';
export const FETCH_DOCUMENTO_SUCCESS = 'FETCH_DOCUMENTO_SUCCESS';

export const FETCH_DOCUMENTOS_PENDENTES_REQUEST = 'FETCH_DOCUMENTOS_PENDENTES_REQUEST';
export const FETCH_DOCUMENTOS_PENDENTES_SUCCESS = 'FETCH_DOCUMENTOS_PENDENTES_SUCCESS';

export const CREATE_DOCUMENTO_REQUEST = 'CREATE_DOCUMENTO_REQUEST';
export const CREATE_DOCUMENTO_SUCCESS = 'CREATE_DOCUMENTO_SUCCESS';
export const UPDATE_DOCUMENTO_REQUEST = 'UPDATE_DOCUMENTO_REQUEST';
export const UPDATE_DOCUMENTO_SUCCESS = 'UPDATE_DOCUMENTO_SUCCESS';
export const UPLOAD_DOCUMENTO_REQUEST = 'UPLOAD_DOCUMENTO_REQUEST';
export const UPLOAD_DOCUMENTO_SUCCESS = 'UPLOAD_DOCUMENTO_SUCCESS';

export const UPLOAD_DOCUMENTO_PROGRESS = 'UPLOAD_DOCUMENTO_PROGRESS';
export const UPLOAD_DOCUMENTO_FAILURE = 'UPLOAD_DOCUMENTO_FAILURE';

export const DELETE_DOCUMENTO_REQUEST = 'DELETE_DOCUMENTO_REQUEST';
export const DELETE_DOCUMENTO_SUCCESS = 'DELETE_DOCUMENTO_SUCCESS';

export const SEARCH_DOCUMENTO_TEXT = 'SEARCH_DOCUMENTO_TEXT';

export const FETCHING_DOCUMENTOS = 'FETCHING_DOCUMENTOS';
export const LOADING_DOCUMENTOS = 'LOADING_DOCUMENTOS';
export const UPDATING_DOCUMENTOS = 'UPDATING_DOCUMENTOS';
export const UPLOADING_DOCUMENTOS = 'UPLOADING_DOCUMENTOS';

export const REQUEST_DOCUMENTO_ERROR = 'REQUEST_DOCUMENTO_ERROR';

export const CLEAR_DOCUMENTO_ERROR = 'CLEAR_DOCUMENTO_ERROR';


export const fetchDocumentoTiposRequest = () => ({
  type: FETCH_DOCUMENTO_TIPOS_REQUEST
})
export const fetchDocumentoTiposSuccess = data => ({
  type: FETCH_DOCUMENTO_TIPOS_SUCCESS,
  data
})

export const fetchDocumentosRequest = params => ({
  type: FETCH_DOCUMENTOS_REQUEST,
  params
})
export const fetchDocumentosSuccess = data => ({
  type: FETCH_DOCUMENTOS_SUCCESS,
  data
})

export const fetchDocumentoRequest = id => ({
  type: FETCH_DOCUMENTO_REQUEST,
  id
})
export const fetchDocumentoSuccess = data => ({
  type: FETCH_DOCUMENTO_SUCCESS,
  data
})

export const fetchDocumentosPendentesRequest = () => ({
  type: FETCH_DOCUMENTOS_PENDENTES_REQUEST,

})
export const fetchDocumentosPendentesSuccess = data => ({
  type: FETCH_DOCUMENTOS_PENDENTES_SUCCESS,
  data
})

export const createDocumentoRequest = data => ({
  type: CREATE_DOCUMENTO_REQUEST,
  data
})
export const createDocumentoSuccess = data => ({
  type: CREATE_DOCUMENTO_SUCCESS,
  data
})


export const updateDocumentoRequest = data => ({
  type: UPDATE_DOCUMENTO_REQUEST,
  data
})
export const updateDocumentoSuccess = data => ({
  type: UPDATE_DOCUMENTO_SUCCESS,
  data
})

export const uploadDocumentoRequest = data => ({
  type: UPLOAD_DOCUMENTO_REQUEST,
  data
})
export const uploadDocumentoSuccess = data => ({
  type: UPLOAD_DOCUMENTO_SUCCESS,
  data
})

export const uploadDocumentoProgress = progress => ({
  type: UPLOAD_DOCUMENTO_PROGRESS,
  progress
})
export const uploadDocumentoFailure = error => ({
  type: UPLOAD_DOCUMENTO_FAILURE,
  error
})

export const deleteDocumentoRequest = data => ({
  type: DELETE_DOCUMENTO_REQUEST,
  data
})
export const deleteDocumentoSuccess = id => ({
  type: DELETE_DOCUMENTO_SUCCESS,
  id
})


export const searchDocumentoText = text => ({
  type: SEARCH_DOCUMENTO_TEXT,
  text
})


export const fetchingDocumentos = fetching => ({
  type: FETCHING_DOCUMENTOS,
  fetching
})

export const loadingDocumentos = loading => ({
  type: LOADING_DOCUMENTOS,
  loading
})

export const updatingDocumentos = updating => ({
  type: UPDATING_DOCUMENTOS,
  updating
})

export const uploadingDocumentos = uploading => ({
  type: UPLOADING_DOCUMENTOS,
  uploading
})

export const requestDocumentoError = error => ({
  type: REQUEST_DOCUMENTO_ERROR,
  error
})

export const clearDocumentoError = () => ({
  type: CLEAR_DOCUMENTO_ERROR
})