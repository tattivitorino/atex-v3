import { NavigationActions, DrawerActions, HeaderBackButton } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function back(key) {
  _navigator.dispatch(
    NavigationActions.back({
      key
    })
  );
}

function openDrawer(routeName, params) {
  _navigator.dispatch(DrawerActions.openDrawer());
}

function toggleDrawer(routeName, params) {
  _navigator.dispatch(DrawerActions.toggleDrawer());
}

function closeDrawer(routeName, params) {
  _navigator.dispatch(DrawerActions.closeDrawer());
}

export default {
  navigate,
  back,
  openDrawer,
  toggleDrawer,
  closeDrawer,
  setTopLevelNavigator
}