import { put, call, takeLatest, select, delay } from 'redux-saga/effects';

import moment from 'moment';

import { showAlert } from '../../utils';
import { ALERT_DELAY } from '../../config';
import NavigationService from '../../services/NavigationService';

import {
  fetchingAtendimentos,
  loadingAtendimentos,
  updatingAtendimentos,
  requestAtendimentoError,
  clearAtendimentoError,
  FETCH_ATENDIMENTOS_REQUEST,
  FETCH_ATENDIMENTO_REQUEST,
  CREATE_ATENDIMENTO_REQUEST,
  UPDATE_ATENDIMENTO_REQUEST,
  DELETE_ATENDIMENTO_REQUEST,
  fetchAtendimentosSuccess,
  fetchAtendimentoSuccess,
  createAtendimentoSuccess,
  updateAtendimentoSuccess,
  deleteAtendimentoSuccess
} from '../actions';

import AtendimentosApi from '../../api/atendimentos.api';
import { onlyNumbers, reverseDate, parseDatetimeToDjango } from '../../utils';


export function* fetchAtendimentosSaga({ params }) {
  const action = params.page === 1 ? fetchingAtendimentos(true) : loadingAtendimentos(true);
  yield put(action);
  try {
    //const uid = yield select(state => state.auth.user.id)
    const response = yield call(AtendimentosApi.fetchAtendimentos, params);
    yield put(fetchAtendimentosSuccess({ ...response, page: params.page }))
  } catch (e) {
    yield put(requestAtendimentoError(e.message))
  }
}

export function* fetchAtendimentoSaga({ id }) {
  yield put(loadingAtendimentos(true));
  try {
    const response = yield call(AtendimentosApi.fetchAtendimento, id)
    yield put(fetchAtendimentoSuccess(response))
  } catch (e) {
    //console.log(e);
    yield put(requestAtendimentoError(e.message))
  }
}

export function* updateAtendimentoSaga({ type, data }) {
  //console.log('SAGA ACTION.DATA: ', data);
  yield put(updatingAtendimentos(true));
  try {
    // YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]

    let { datetime, id, observacoes, titulo } = data;
    datetime = parseDatetimeToDjango(datetime);

    let obj = {
      data: datetime,
      observacoes: observacoes || "",
      titulo
    }
    if (id) obj.id = id;

    const response = yield call(AtendimentosApi.updateAtendimento, obj);

    const action = type === CREATE_ATENDIMENTO_REQUEST ? createAtendimentoSuccess(response) : updateAtendimentoSuccess(response);
    yield put(action);

    yield delay(ALERT_DELAY);
    showAlert('Atendimento', 'Dados foram gravados com sucesso!', () => {
      NavigationService.back(null)
    });

  } catch (e) {
    yield put(requestAtendimentoError(null))
    yield delay(ALERT_DELAY);
    showAlert('Atendimento', e.message, null);
  }
}

export function* deleteAtendimentoSaga({ id }) {
  yield put(updatingAtendimentos(true));
  try {
    const response = yield call(AtendimentosApi.deleteAtendimento, id);
    yield put(deleteAtendimentoSuccess(id))
  }
  catch (e) {
    yield put(requestAtendimentoError(null));
    yield delay(ALERT_DELAY);
    showAlert('Atendimento', e.message, null);
  }
}


export default function* atendimentos() {
  yield takeLatest(FETCH_ATENDIMENTOS_REQUEST, fetchAtendimentosSaga)
  yield takeLatest(FETCH_ATENDIMENTO_REQUEST, fetchAtendimentoSaga)
  yield takeLatest(CREATE_ATENDIMENTO_REQUEST, updateAtendimentoSaga)
  yield takeLatest(UPDATE_ATENDIMENTO_REQUEST, updateAtendimentoSaga)
  yield takeLatest(DELETE_ATENDIMENTO_REQUEST, deleteAtendimentoSaga)
}