export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';

export const FETCHING_USERS = 'FETCHING_USERS';
export const REQUEST_USER_ERROR = 'REQUEST_USER_ERROR';

export const fetchUsersRequest = params => ({
  type: FETCH_USERS_REQUEST,
  params
})
export const fetchUsersSuccess = data => ({
  type: FETCH_USERS_SUCCESS,
  data
})

export const fetchUserRequest = id => ({
  type: FETCH_USER_REQUEST,
  id
})
export const fetchUserSuccess = data => ({
  type: FETCH_USER_SUCCESS,
  data
})

export const updateUserRequest = data => ({
  type: UPDATE_USER_REQUEST,
  data
})
export const updateUserSuccess = data => ({
  type: UPDATE_USER_SUCCESS,
  data
})

export const fetchingUsers = fetching => ({
  type: FETCHING_USERS,
  fetching
})

export const requestUserError = error => ({
  type: REQUEST_USER_ERROR,
  error
})