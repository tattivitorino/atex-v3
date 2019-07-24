import { SHOW_LOADING } from '../actions';

const INITIAL_STATE = {
  spinner: false,
  message: null
}

const loading = (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case SHOW_LOADING:
      return {
        ...state,
        ...action.payload
      }

    default:
      return state;

  }
}

export default loading;