import { put, call, all, takeLatest, takeEvery, select, delay, fork } from 'redux-saga/effects';
import moment from 'moment';

import { showAlert, showConfirm } from '../../utils';
import { ALERT_DELAY, DOCUMENTOLIST_KEY } from '../../config';
import NavigationService from '../../services/NavigationService';

import { AsyncStorage } from 'react-native';

import {
  fetchingClientes,
  loadingClientes,
  updatingClientes,
  requestClienteError,
  //clearClienteError,
  FETCH_CLIENTES_REQUEST,
  FETCH_CLIENTE_REQUEST,
  CREATE_CLIENTE_REQUEST,
  UPDATE_CLIENTE_REQUEST,
  //FETCH_DCAD_REQUEST,
  //FETCH_PROFISSOES_REQUEST,
  FETCH_COMBOLIST_REQUEST,
  fetchClientesSuccess,
  fetchClienteSuccess,
  createClienteSuccess,
  updateClienteSuccess,
  fetchDcadSuccess,
  fetchProfissoesSuccess,
  uploadingAvatar,
  UPLOAD_AVATAR_REQUEST,
  uploadAvatarSuccess
} from '../actions';

import ClientesApi from '../../api/clientes.api';
import DocumentosApi from '../../api/documentos.api';

import { onlyNumbers, reverseDate } from '../../utils';


export function* fetchDcadSaga({ node }) {
  try {
    const response = yield call(ClientesApi.fetchDadosCadastrais, node);
    yield put(fetchDcadSuccess({ results: response, node: node }))
  } catch (e) {
    //console.log(e);
    //yield put(requestDocumentoError(e.message))
  }
}

export function* fetchProfissoesSaga() {
  try {
    const response = yield call(ClientesApi.fetchProfissaoList);
    yield put(fetchProfissoesSuccess(response))
  } catch (e) {
    //console.log(e);
    //yield put(requestDocumentoError(e.message))
  }
}

export function* fetchComboListSaga() {
  try {
    const [profissaoList, estadoCivilList, nacionalidadeList] = yield all([
      call(ClientesApi.fetchProfissaoList),
      call(ClientesApi.fetchDadosCadastrais, 'estado-civil'),
      call(ClientesApi.fetchDadosCadastrais, 'nacionalidade')
    ]);
    yield put(fetchDcadSuccess({ results: estadoCivilList, node: 'estado-civil' }))
    yield put(fetchDcadSuccess({ results: nacionalidadeList, node: 'nacionalidade' }))
    yield put(fetchProfissoesSuccess(profissaoList))
  }
  catch (e) {
    console.log(e);
  }
}

export function* fetchClientesSaga({ params }) {
  const action = params.page === 1 ? fetchingClientes(true) : loadingClientes(true);
  yield put(action);
  try {
    //const uid = yield select(state => state.auth.user.id)
    const response = yield call(ClientesApi.fetchClientes, params);
    yield put(fetchClientesSuccess({ ...response, page: params.page }));
  } catch (e) {
    yield put(requestClienteError(e.message))
  }
}

export function* fetchClienteSaga({ id }) {
  yield put(fetchingClientes(true));
  try {
    const response = yield call(ClientesApi.fetchCliente, id)
    const did = response.diretorio_documentos;
    response.documentos = [];

    if (did) {
      const docsResponse = yield call(DocumentosApi.fetchDocumentos, did, {})
      if (docsResponse.documentos) response.documentos = docsResponse.documentos;

      let docList = [];
      const storageData = yield call(AsyncStorage.getItem, DOCUMENTOLIST_KEY);

      if (storageData !== null) {
        docList = JSON.parse(storageData);
        //console.log('DOC LIST: ', docList);
        docList.forEach(item => {
          if (item.diretorio === did) response.documentos.unshift(item);
        });
      }
    }
    //console.log('RESPONSE: ', response);

    yield put(fetchClienteSuccess(response))
  } catch (e) {
    console.log(e);
    yield put(requestClienteError(e.message))
  }
}

/**
 * @param data
 * {
    "bairro": "Perdizes",
    "celular": "(11) 98435 2233",
    "cep": "05019-000",
    "cidade": "São Paulo",
    "cpf": "191.077.688-26",
    "data_nascimento": "07/04/1975",
    "email": "tatti.gillespie@gmail.com",
    "estado": "SP",
    "logradouro": "Rua Diana",
    "nome": "Tatiana Vitorino ",
    "numero": "989",
    "rg": "249476563",
    "telefone_fixo": "(11) 2222 2222",
  }
 */
export function* updateClienteSaga({ type, data }) {
  //console.log('SAGA ACTION.DATA: ', data.data_nascimento);
  yield put(updatingClientes(true));
  try {
    delete data.documentos;
    delete data.avatar;

    Object.keys(data).forEach(key => {
      //console.log(key, data[key], typeof (data[key]));
      if (data[key] === "") {
        //console.log('STRING VAZIA: ', key, data[key]);
        data[key] = null;
        return;
      }

      if (data[key] !== null
        && data[key] !== undefined
        && data[key].length) {
        if (key == 'cpf') data[key] = onlyNumbers(data[key]);
        if (key == 'celular') data[key] = onlyNumbers(data[key]);
        if (key == 'telefone_fixo') data[key] = onlyNumbers(data[key]);
        if (key == 'cep') data[key] = onlyNumbers(data[key]);
        if (key == 'data_nascimento') data[key] = reverseDate(data[key]);
      }

    });
    //console.log(data);
    const response = yield call(ClientesApi.updateCliente, { ...data });
    const action = type === CREATE_CLIENTE_REQUEST ? createClienteSuccess(response) : updateClienteSuccess(response);
    yield put(action);

    yield delay(ALERT_DELAY);
    if (type === CREATE_CLIENTE_REQUEST) {
      showConfirm('Pré-cadastro', 'Os dados foram gravados com sucesso! Você deseja adicionar documentos para este Pré-cadastro?', () => {
        NavigationService.back(null)
      }, () => {
        NavigationService.navigate('ClienteAddDoc', { backTo: 'ClienteList' });
      })
    } else {
      showAlert('Pré-cadastro', 'Os dados foram gravados com sucesso!', () => {
        NavigationService.back(null)
      });
    }

  } catch (e) {
    yield put(requestClienteError(null))
    yield delay(ALERT_DELAY);
    showAlert('Pré-cadastro', e.message, null);
  }
}

const parseAvatarData = (data) => {
  const { uri, width, height } = data;

  const timestamp = moment().valueOf();
  const uriParts = uri.split('.');
  const fileType = uriParts[uriParts.length - 1];
  const fileName = `${timestamp}.${fileType}`;
  const mimeType = `image/${fileType}`;

  const formData = new FormData();
  formData.append('avatar', {
    uri,
    type: mimeType,
    name: fileName
  });
  formData.append('meta_dados', JSON.stringify({
    mimeType,
    fileName,
    width,
    height
  }));
  return formData;
}

export function* uploadAvatarSaga({ type, data }) {
  yield put(uploadingAvatar(true));
  try {
    const formData = parseAvatarData(data);
    const response = yield call(ClientesApi.uploadAvatar, data.id, formData);
    yield put(uploadAvatarSuccess(response));
    yield delay(ALERT_DELAY);
    showAlert('Upload Avatar', 'Os dados foram gravados com sucesso!', () => {
      NavigationService.back(null)
    });
  }
  catch (e) {
    yield put(requestClienteError(null))
    yield delay(ALERT_DELAY);
    showAlert('Upload Avatar', e.message, null);
  }
}

export default function* clientes() {
  yield takeLatest(FETCH_CLIENTES_REQUEST, fetchClientesSaga)
  yield takeLatest(FETCH_CLIENTE_REQUEST, fetchClienteSaga)
  yield takeLatest(CREATE_CLIENTE_REQUEST, updateClienteSaga)
  yield takeLatest(UPDATE_CLIENTE_REQUEST, updateClienteSaga)
  yield takeLatest(UPLOAD_AVATAR_REQUEST, uploadAvatarSaga);
  yield takeLatest(FETCH_COMBOLIST_REQUEST, fetchComboListSaga)
  //yield takeEvery(FETCH_DCAD_REQUEST, fetchDcadSaga)
  //yield takeLatest(FETCH_PROFISSOES_REQUEST, fetchProfissoesSaga)
}