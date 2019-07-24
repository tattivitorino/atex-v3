import {
  FETCHING_NOTIFICATIONS,
  LOADING_NOTIFICATIONS,
  UPDATING_NOTIFICATIONS,
  REQUEST_NOTIFICATION_ERROR,
  CLEAR_NOTIFICATION_ERROR,
  UPDATE_BADGE_COUNT,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATION_SUCCESS,
  UPDATE_NOTIFICATION_SUCCESS
} from '../actions';

// mock data 
//import list from '../../data/notifications.json';

const INITIAL_STATE = {
  fetching: false,
  loading: false,
  updating: false,
  error: null,
  list: [],
  item: null,
  statusFilter: null,
  limit: 20,
  count: 0,
  page: 1,
  next: null,
  previous: null,
  dashCount: 3,
  badgeCount: 0
}

const notifications = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHING_NOTIFICATIONS:
      return { ...state, fetching: action.fetching, error: null }

    case LOADING_NOTIFICATIONS:
      return { ...state, loading: action.loading, error: null }

    case UPDATING_NOTIFICATIONS:
      return { ...state, updating: action.updating, error: null }

    case REQUEST_NOTIFICATION_ERROR:
      return {
        ...state,
        fetching: false,
        loading: false,
        updating: false,
        error: action.error
      }

    case UPDATE_BADGE_COUNT:
      const naoLidas = state.list.filter(n => !n.lida);
      return { ...state, badgeCount: naoLidas.length || 0 }

    case FETCH_NOTIFICATIONS_SUCCESS:
      const { results, count, page, next, previous } = action.data;
      const l = page === 1 ? results : [...state.list, ...results];
      return {
        ...state,
        fetching: false,
        loading: false,
        updating: false,
        list: l,
        count,
        page,
        next,
        previous
      }

    case UPDATE_NOTIFICATION_SUCCESS:
      const { id, ...rest } = action.data;
      return {
        ...state,
        updating: false,
        list: state.list.map(item => {
          if (item.id === id) return { ...item, ...rest };
          return item;
        })
      }

    default:
      return state;
  }
}

export default notifications;