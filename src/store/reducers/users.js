import {
  FETCHING_USERS,
  REQUEST_USER_ERROR,
  FETCH_USERS_SUCCESS,
  FETCH_USER_SUCCESS,
  UPDATE_USER_SUCCESS
} from '../actions';

const INITIAL_STATE = {
  fetching: null,
  error: null,
  userList: null,
  user: null,
}

const users = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHING_USERS:
      return { ...state, fetching: action.fetching, error: null };

    case REQUEST_USER_ERROR:
      return { ...state, fetching: false, error: action.error }

    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        fetching: false,
        userList: action.data.results
      }

    case FETCH_USER_SUCCESS:
    case UPDATE_USER_SUCCESS:
      //manipular a lista para atualizar o usuário caso a action type seja update
      return {
        ...state,
        fetching: false,
        user: action.data
      }

    default:
      return state;
  }
}

export default users;