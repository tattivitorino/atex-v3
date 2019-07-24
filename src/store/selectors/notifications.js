import { createSelector } from 'reselect';

const getDashCount = state => state.notifications.dashCount;
const getStatusFilter = state => state.notifications.statusFilter;
const getNotifications = state => state.notifications.list;

export const getNotificationsByStatus = createSelector(
  [getStatusFilter, getNotifications],
  (statusFilter, list) => {
    switch (statusFilter) {
      case 'LIDA':
        return list.filter(n => n.lida);

      case 'NAO_LIDA':
        return list.filter(n => !n.lida);

      default:
        return list;
    }
  }
);

export const getDashboardNotifications = createSelector(
  [getDashCount, getNotifications],
  (dashCount, list) => {
    if (!list || !list.length) return [];
    const naoLidas = list.filter(n => !n.lida);
    //console.log(naoLidas);
    return naoLidas.slice(0, dashCount);
  }
)