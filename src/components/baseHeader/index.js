import React, { Component } from 'react';
import { StatusBar, Platform, StyleSheet } from 'react-native';
import { Header, Left, Body, Right, Icon, Title, Button } from 'native-base';

import NavigationService from '../../services/NavigationService';
import { connect } from 'react-redux';
import { logoutRequest } from '../../store/actions';

import material from '../../../native-base-theme/variables/material';

class BaseHeader extends Component {
  constructor(props) {
    super(props);
    //console.log(Platform);
  }

  renderLeft() {
    const { navigation, back, backTo } = this.props;
    const route = backTo ? backTo : null;
    //console.log(route);
    if (back) {
      return (
        <Left>
          <Button transparent onPress={() => route === null ? navigation.goBack(null) : navigation.navigate(route)}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
      );
    }

    return (
      <Left style={[]}>
        <Button transparent onPress={() => NavigationService.openDrawer()}>
          <Icon name="menu" />
        </Button>
      </Left>
    );
  }

  renderRight() {
    const { showLogout } = this.props;
    if (showLogout) {
      return (
        <Right style={[]}>
          <Button transparent onPress={() => {
            this.props.logoutRequest()
          }}>
            <Icon name="md-exit" />
          </Button>
        </Right>
      );
    }
    return <Right />;
  }

  render() {
    const { title } = this.props;
    return (
      <Header
        iosBarStyle={'light-content'}
        androidStatusBarColor={material.toolbarDefaultBg}
        style={[styles.headerStyles]}>
        {this.renderLeft()}

        {title ? <Body><Title>{title}</Title></Body> : <Body />}

        {this.renderRight()}

      </Header>
    );
  }
}

const styles = StyleSheet.create({
  headerStyles: {
    backgroundColor: material.toolbarDefaultBg,
    ...Platform.select({
      android: {
        //height: material.toolbarHeight + StatusBar.currentHeight,
        //paddingTop: StatusBar.currentHeight,
        //backgroundColor: Platform.Version <= 21 ? material.toolbarDefaultBg : 'transparent'
        backgroundColor: material.toolbarDefaultBg
      }
    })
  },
  border: {
    borderWidth: 1,
    borderColor: '#fff'
  }
})

export default connect(null, { logoutRequest })(BaseHeader);
