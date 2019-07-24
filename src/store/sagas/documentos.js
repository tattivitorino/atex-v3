import { put, call, takeLatest, select, delay, takeEvery, fork, take } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';

import moment from 'moment';

import { showAlert } from '../../utils';
import { ALERT_DELAY, VIDEO_TYPES, AUDIO_TYPES, DOC_TYPES, DOCUMENTOLIST_KEY, IMAGE_TYPES, UPLOAD_TIMEOUT } from '../../config';
import NavigationService from '../../services/NavigationService';

import * as FileSystem from 'expo-file-system';
import { NetInfo, AsyncStorage } from 'react-native';

import {
  fetchingDocumentos,
  loadingDocumentos,
  updatingDocumentos,
  requestDocumentoError,
  clearDocumentoError,
  uploadDocumentoFailure,
  FETCH_DOCUMENTO_TIPOS_REQUEST,
  FETCH_DOCUMENTOS_REQUEST,
  FETCH_DOCUMENTOS_PENDENTES_REQUEST,
  FETCH_DOCUMENTO_REQUEST,
  CREATE_DOCUMENTO_REQUEST,
  UPDATE_DOCUMENTO_REQUEST,
  UPLOAD_DOCUMENTO_REQUEST,
  DELETE_DOCUMENTO_REQUEST,
  fetchDocumentoTiposSuccess,
  fetchDocumentosSuccess,
  fetchDocumentosPendentesSuccess,
  fetchDocumentoSuccess,
  createDocumentoSuccess,
  createClienteDocumentoSuccess,
  updateDocumentoSuccess,
  deleteDocumentoSuccess,
  deleteClienteDocumentoSuccess,
  uploadDocumentoSuccess,
  uploadClienteDocumentoSuccess,
  uploadDocumentoProgress,
  uploadingDocumentoQueue,
  uploadingDocumentoQueueError,
  uploadDocumentoQueueProgress
} from '../actions';

import DocumentosApi from '../../api/documentos.api';
import { onlyNumbers, reverseDate, parseDatetimeToDjango } from '../../utils';

const createUploader = (data, timeout = UPLOAD_TIMEOUT) => {
  let emit;
  const chan = eventChannel((emitter) => {
    emit = emitter;
    return () => { };
  });
  const uploadProgressCb = ({ total, loaded }) => {
    const percentage = Math.round((loaded * 100) / total);
    emit(percentage);
    if (percentage === 100) emit(END);
  };
  const uploadPromise = DocumentosApi.uploadPromise(data, uploadProgressCb, timeout);
  return [uploadPromise, chan];
}

function* uploadProgressWatcher(chan, id = null) {
  while (true) {
    const progress = yield take(chan);
    if (id) yield put(uploadDocumentoQueueProgress({ progress, id }))
    else yield put(uploadDocumentoProgress(progress))
  }
}


function* fetchDocumentoTiposSaga() {
  try {
    const response = yield call(DocumentosApi.fetchDocumentoTipos);
    yield put(fetchDocumentoTiposSuccess({ ...response }))
  } catch (e) {
    //yield put(requestDocumentoError(e.message))
  }
}

function* fetchDocumentosSaga({ params }) {
  const action = params.page === 1 ? fetchingDocumentos(true) : loadingDocumentos(true);
  yield put(action);
  try {
    const id = yield select(state => state.clientes.cliente.diretorio_documentos)
    const apiResponse = yield call(DocumentosApi.fetchDocumentos, id, params);

    let docList = [];
    const storageData = yield call(AsyncStorage.getItem, DOCUMENTOLIST_KEY);
    if (storageData !== null) {
      docList = JSON.parse(storageData);
      //console.log('DOC LIST: ', docList);
      docList.forEach(item => {
        if (item.diretorio === id) apiResponse.unshift(item);
      });
    }

    yield put(fetchDocumentosSuccess({ ...apiResponse, page: params.page }))
  } catch (e) {
    yield put(requestDocumentoError(e.message))
  }
}

function* fetchDocumentosPendentesSaga() {
  try {
    let docList = [];
    let filteredList = [];
    const uid = yield select(state => state.auth.uid);
    const storageData = yield call(AsyncStorage.getItem, DOCUMENTOLIST_KEY);
    if (storageData !== null) {
      docList = JSON.parse(storageData);
      //console.log('DOC LIST: ', docList);
      if (docList.length) {
        filteredList = docList.filter(item => {
          return item.uid === uid;
        })
      }
    }
    yield put(fetchDocumentosPendentesSuccess(filteredList))
  } catch (e) {
    console.log(e)
  }
}

function* fetchDocumentoSaga({ id }) {
  yield put(loadingDocumentos(true));
  try {
    const response = yield call(DocumentosApi.fetchDocumento, id)
    yield put(fetchDocumentoSuccess(response))
  } catch (e) {
    //console.log(e);
    yield put(requestDocumentoError(e.message))
  }
}

function* deleteDocumentoSaga({ data }) {
  //console.log('DELETE DOC SAGA DATA: ', data);
  //yield put(updatingDocumentos(true));
  try {
    if (data.status === 'PU') {
      let docList = [];
      const storageData = yield call(AsyncStorage.getItem, DOCUMENTOLIST_KEY);
      if (storageData !== null) {
        docList = JSON.parse(storageData);
        docList.forEach((item, index) => {
          if (item.id === data.id) {
            formDataIndex = index;
            return;
          }
        })
        docList.splice(formDataIndex, 1);
        yield call(AsyncStorage.setItem, DOCUMENTOLIST_KEY, JSON.stringify(docList));
        yield call(FileSystem.deleteAsync, data.arquivo, { idempotent: true });
        yield put(fetchDocumentosPendentesSuccess(docList))
        yield put(deleteDocumentoSuccess(data.id))
        yield put(deleteClienteDocumentoSuccess(data.id))
      }
    } else {
      yield call(DocumentosApi.deleteDocumento, data.id);
      yield put(deleteDocumentoSuccess(data.id))
      yield put(deleteClienteDocumentoSuccess(data.id))
    }
  }
  catch (e) {
    yield put(requestDocumentoError(null));
    yield delay(ALERT_DELAY);
    showAlert('Documento', e.message, null);
  }
}

function* updateDocumentoSaga({ type, data }) {
  //console.log('SAGA ACTION.DATA: ', data);
  yield put(updatingDocumentos(true));

  try {

    // verificar se o diretorio do pre-cadastro existe, se não, criar
    const docsDirectory = yield call(handleDataDirectoryAsync, data);

    // save/move temp file to docsDirectory
    // prepare formData
    // get fileInfo e meta_dados caso precise salvar local
    const { formData, fileInfo, meta_dados } = yield call(parseDocumentDataAsync, data, docsDirectory);
    //console.log('FORM DATA: ', formData, fileInfo, meta_dados);

    //Verificar tipo da conexão... se não for wifi não vai subir o arquivo
    const { type: connType, effectiveType } = yield call(NetInfo.getConnectionInfo);
    //console.log('NET INFO: ', connType, effectiveType);

    let response;
    let savedLocal = false;

    if (connType === 'wifi') {
      const func = type === CREATE_DOCUMENTO_REQUEST ? DocumentosApi.createDocumento : DocumentosApi.updateDocumento;
      response = yield call(func, formData);
    } else {
      response = yield call(saveDocumentLocalAsync, fileInfo, data, meta_dados);
      savedLocal = true;
    }

    const action = type === CREATE_DOCUMENTO_REQUEST ? createDocumentoSuccess(response) : updateDocumentoSuccess(response);
    yield put(action);

    if (type === CREATE_DOCUMENTO_REQUEST) yield put(createClienteDocumentoSuccess(response));

    yield delay(ALERT_DELAY);

    let msg = savedLocal === true ? 'O seu aparelho não possue conexão suficiente para o envio de documentos. Os dados foram gravados porém o envio será feito quando houver WIFI. Na lista de documentos você terá a opção de tentar novamente.' : 'Os dados foram gravados com sucesso!';
    showAlert('Documento', msg, null);

  } catch (e) {
    yield put(requestDocumentoError(null));
    yield delay(ALERT_DELAY);
    showAlert('Documento', e.message, null);
  }
}

const handleDataDirectoryAsync = async (data) => {
  //get directory info
  try {

    const clienteDirectoryStr = `${FileSystem.documentDirectory}storage_${data.diretorio_documentos}`;
    let infoDirectory = await FileSystem.getInfoAsync(clienteDirectoryStr)

    if (infoDirectory.exists === false) {
      await FileSystem.makeDirectoryAsync(clienteDirectoryStr);
      infoDirectory = await FileSystem.getInfoAsync(clienteDirectoryStr);
    }

    let uri = infoDirectory.uri;
    if (infoDirectory.uri.substring(infoDirectory.uri.length - 1) !== '/') uri = infoDirectory.uri + '/';
    return uri;

  } catch (e) {
    throw ({
      code: 'handleDirectory',
      message: e.message
    })
  }
}

const parseDocumentDataAsync = async (data, docsDirectory) => {
  try {
    const { uri, width, height, type, arquivo, diretorio_documentos, tipo_documento, referencia, duration, size, sizeReadable, extension, source } = data;
    if (!arquivo) throw new Error('Você precisa escolher um arquivo!')

    const timestamp = moment().valueOf();
    const fileName = `${timestamp}.${extension}`;
    let mimeType;

    if (source === 'document') {
      if (VIDEO_TYPES.includes(extension)) {
        mimeType = `video/${extension}`
      }
      else if (AUDIO_TYPES.includes(extension)) {
        mimeType = `audio/${extension}`
      }
      else if (IMAGE_TYPES.includes(extension)) {
        mimeType = `image/${extension}`
      }
      else {
        mimeType = DOC_TYPES[extension];
      }
    } else {
      mimeType = `${type}/${extension}`
    }

    if (!mimeType) throw new Error(`Tipo de arquivo não permitido: .${extension}!`);

    await FileSystem.moveAsync({
      from: uri,
      to: docsDirectory + fileName
    })

    const fileInfo = await FileSystem.getInfoAsync(docsDirectory + fileName);
    //console.log('DOCUMENT INFO: ', fileInfo);


    const formData = new FormData()
    formData.append('diretorio', diretorio_documentos);
    formData.append('tipo_documento', tipo_documento);
    if (referencia) formData.append('referencia', referencia);
    formData.append('arquivo', {
      uri: fileInfo.uri,
      type: mimeType,
      name: fileName
    });
    const meta_dados = JSON.stringify({
      mimeType,
      fileName,
      width,
      height,
      duration,
      size,
      sizeReadable,
      extension
    });
    formData.append('meta_dados', meta_dados);
    return { formData, fileInfo, meta_dados };

  } catch (e) {
    //console.log(e);
    throw ({
      code: 'parseDocument',
      message: e.message
    });
  }
}

const saveDocumentLocalAsync = async (fileInfo, data, meta_dados, cliente, uid) => {
  try {
    let docList = [];

    const storageData = await AsyncStorage.getItem(DOCUMENTOLIST_KEY);
    if (storageData !== null) {
      docList = JSON.parse(storageData);
    }
    const timestamp = moment().valueOf();
    const fileData = {
      uid,
      pid: cliente.id,
      pnome: cliente.nome,
      id: timestamp,
      tipo_documento: data.tipo_documento,
      referencia: data.referencia,
      diretorio: data.diretorio_documentos,
      arquivo: fileInfo.uri,
      status: 'PU',
      comentario: null,
      meta_dados,
      uploadingDoc: false,
      progressDoc: 0,
      errorDoc: null
    }

    console.log(fileData);
    docList.push(fileData);

    await AsyncStorage.setItem(DOCUMENTOLIST_KEY, JSON.stringify(docList));
    return fileData;

  } catch (e) {
    throw ({
      code: 'saveLocal',
      message: e.message
    })
  }
}

function* uploadDocumentoProgressSaga({ type, data }) {
  console.log('UPLOAD DOC SAGA DATA: ', data);
  /**
   * Object {
      "arquivo": "file:///var/mobile/Containers/Data/Application/FBF3C4F0-6C83-43F4-882F-F1BD008CED5B/Documents/ExponentExperienceData/%2540tattivitorino%252Fatex-mob-ce/storage_28/1562335854421.mov",
      "comentario": null,
      "diretorio": 28,
      "errorDoc": null,
      "id": 1562335854892,
      "meta_dados": "{\"mimeType\":\"video/mov\",\"fileName\":\"1562335854421.mov\",\"width\":1080,\"height\":1920,\"duration\":12866.666666666668,\"size\":7326748,\"sizeReadable\":\"7.33 MB\",\"extension\":\"mov\"}",
      "pid": 4,
      "pnome": "Jon Snow",
      "progressDoc": 0,
      "referencia": undefined,
      "status": "PU",
      "tipo_documento": 8,
      "uploadingDoc": false,
    }
   */
  // dispatch action no cliente uploadingDoc = true 
  // dispatch action no documento uploadingDoc = true 
  // {type:UPLOADING_DOCUMENTO_QUEUE, data:{id:data.id}}

  yield put(uploadingDocumentoQueue({ id: data.id }))

  try {

    const meta_dados = JSON.parse(data.meta_dados)
    const formData = new FormData()
    formData.append('diretorio', data.diretorio);
    formData.append('tipo_documento', data.tipo_documento);
    if (data.referencia) formData.append('referencia', data.referencia);
    formData.append('arquivo', {
      uri: data.arquivo,
      type: meta_dados.mimeType,
      name: meta_dados.fileName
    });
    formData.append('meta_dados', data.meta_dados);
    console.log('FORM DATA: ', formData);

    //const response = yield call(DocumentosApi.createDocumento, formData);
    const [uploadPromise, chan] = yield call(createUploader, formData, 20000);
    yield fork(uploadProgressWatcher, chan, data.id);
    response = yield call(() => uploadPromise);

    let docList = [];
    let formDataIndex;

    const storageData = yield call(AsyncStorage.getItem, DOCUMENTOLIST_KEY);
    if (storageData !== null) {
      docList = JSON.parse(storageData);
      //console.log('DOC LIST: ', docList.length, docList)
      //console.log('DOC LIST LENGHT B4: ', docList.length)
    }
    docList.forEach((item, index) => {
      if (item.id === data.id) {
        formDataIndex = index;
        return;
      }
    })
    docList.splice(formDataIndex, 1);
    //console.log('DOC LIST LENGHT AFTER: ', docList.length)

    yield call(AsyncStorage.setItem, DOCUMENTOLIST_KEY, JSON.stringify(docList));

    yield put(fetchDocumentosPendentesSuccess(docList))
    yield put(uploadDocumentoSuccess({ ...response, timestamp: data.id }))
    yield put(uploadClienteDocumentoSuccess({ ...response, timestamp: data.id }));

  }
  catch (e) {
    console.log(e)
    yield put(uploadingDocumentoQueueError({ error: e.message, id: data.id }))
  }
}

function* createDocumentoProgressSaga({ type, data }) {
  console.log('UPLOAD DOC SAGA DATA: ', data);

  let fInfo;
  let mDados;
  let response;

  yield put(updatingDocumentos(true));
  try {
    const docsDirectory = yield call(handleDataDirectoryAsync, data);
    const { formData, fileInfo, meta_dados } = yield call(parseDocumentDataAsync, data, docsDirectory);

    fInfo = { ...fileInfo };
    mDados = meta_dados;

    const [uploadPromise, chan] = yield call(createUploader, formData);
    yield fork(uploadProgressWatcher, chan);
    response = yield call(() => uploadPromise);

    //console.log(response);
    yield put(createDocumentoSuccess(response))
    yield put(createClienteDocumentoSuccess(response));
    yield delay(ALERT_DELAY);

    showAlert('Documento', 'Os dados do documento foram salvos e enviados com sucesso!', null);

  }
  catch (e) {
    console.log(e);

    if (e.code === 'handleDirectory' || e.code === 'parseDocument') {
      yield put(requestDocumentoError(null));
      yield delay(800);
      showAlert('Documento', e.message, null);
    }
    else {
      try {
        const cliente = yield select(state => state.clientes.cliente);
        const uid = yield select(state => state.auth.uid);
        response = yield call(saveDocumentLocalAsync, fInfo, data, mDados, cliente, uid);

        yield put({ type: FETCH_DOCUMENTOS_PENDENTES_REQUEST });
        yield put(createDocumentoSuccess({ ...response }))
        yield put(createClienteDocumentoSuccess({ ...response }));

        yield delay(ALERT_DELAY);
        showAlert('Documento', 'Os dados do documento foram salvos mas estão pendentes de envio.', null);

      } catch (e) {
        yield put(requestDocumentoError(null));
        yield delay(800);
        showAlert('Documento', e.message, null);

      }
    }
  }
}


export default function* documentos() {
  yield takeLatest(FETCH_DOCUMENTO_TIPOS_REQUEST, fetchDocumentoTiposSaga)
  yield takeLatest(FETCH_DOCUMENTOS_REQUEST, fetchDocumentosSaga)
  yield takeLatest(FETCH_DOCUMENTOS_PENDENTES_REQUEST, fetchDocumentosPendentesSaga)
  yield takeLatest(FETCH_DOCUMENTO_REQUEST, fetchDocumentoSaga)

  yield takeLatest(DELETE_DOCUMENTO_REQUEST, deleteDocumentoSaga)

  //yield takeLatest(CREATE_DOCUMENTO_REQUEST, updateDocumentoSaga)
  //yield takeLatest(UPDATE_DOCUMENTO_REQUEST, updateDocumentoSaga)
  yield takeLatest(UPLOAD_DOCUMENTO_REQUEST, uploadDocumentoProgressSaga)
  yield takeLatest(CREATE_DOCUMENTO_REQUEST, createDocumentoProgressSaga)
}