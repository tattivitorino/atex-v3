/**
 payload:{
    spinner:true,
    message:''
 }
 */
export const SHOW_LOADING = 'SHOW_LOADING';
export const showLoading = payload => ({
    type: SHOW_LOADING,
    payload
});

