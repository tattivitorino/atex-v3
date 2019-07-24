import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import loading from './loading';
import auth from './auth';
import notifications from './notifications';
import users from './users';
import clientes from './clientes';
import atendimentos from './atendimentos';
import documentos from './documentos';

const rootReducer = combineReducers({
  form: formReducer,
  loading,
  auth,
  notifications,
  users,
  clientes,
  atendimentos,
  documentos
});

export default rootReducer;