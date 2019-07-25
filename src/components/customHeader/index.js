import React, { Component } from 'react';
import { StatusBar, Platform, StyleSheet } from 'react-native';
import { Header, Left, Body, Right, Icon, Title, Button } from 'native-base';

import NavigationService from '../../services/NavigationService';
import { connect } from 'react-redux';
import { logoutRequest } from '../../store/actions';

import material from '../../../native-base-theme/variables/material';

class CustomHeader extends Component {
  constructor(props) {
    super(props);
  }

  renderLeft() {
    const { navigation, back } = this.props;
    if (back) {
      return (
        <Left>
          <Button transparent onPress={() => navigation.goBack(null)}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
      );
    }

    return (
      <Left>
        <Button transparent onPress={() => NavigationService.openDrawer()}>
          <Icon name="menu" />
        </Button>
      </Left>
    );
  }

  render() {
    const { title, rightControl, hasSegment } = this.props;
    return (
      <Header hasSegment
        iosBarStyle={'light-content'}
        androidStatusBarColor={material.toolbarDefaultBg}
        style={[styles.headerStyles]}>
        {this.renderLeft()}

        {title ? <Body><Title>{title}</Title></Body> : <Body />}

        {rightControl ? rightControl : <Right />}

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
  }
})

export default connect(null, { logoutRequest })(CustomHeader);