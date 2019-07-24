import { takeLatest } from 'redux-saga';
import { fork } from 'redux-saga/effects';

import auth from './auth';
import notifications from './notifications';
import users from './users';
import clientes from './clientes';
import atendimentos from './atendimentos';
import documentos from './documentos';

export default function* rootSaga() {
  yield fork(auth)
  yield fork(notifications)
  yield fork(users)
  yield fork(clientes)
  yield fork(atendimentos)
  yield fork(documentos)
}