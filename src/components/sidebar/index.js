import React, { Component } from 'react';
import { Dimensions, View, FlatList, StatusBar } from 'react-native';
import { Container, Content, Header, Footer, Text, ListItem, Icon, Left, Body, Right } from 'native-base';

import { APP_DEV_VERSION } from '../../config';

import Image from 'react-native-scalable-image';

import { connect } from 'react-redux';

import material from '../../../native-base-theme/variables/material';
import styles from './styles';

const { width, height } = Dimensions.get('window');
const sidebarWidth = width * 0.8;
const logo = require('../../../assets/imgs/logo.png');

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderUser() {
    const { user } = this.props;
    if (user) {
      return (
        <View style={{ paddingVertical: 5, marginTop: 5 }}>
          <Text style={styles.textHeader}>{user.full_name}</Text>
          <Text style={styles.textHeader}>{user.email}</Text>
        </View>
      )
    }
    return null;
  }

  render() {
    return (
      <Container>
        <Header
          iosBarStyle={'light-content'}
          androidStatusBarColor={material.toolbarDefaultBg}
          style={[styles.drawerHeader, styles.shadow]}>
          {this.renderUser()}
        </Header>
        <Content contentContainerStyle={[styles.drawerContent]}></Content>
        <Footer style={[styles.drawerFooter]}>
          <Text style={styles.textFooter}>2019@Martucci Melillo (v{APP_DEV_VERSION})</Text>
        </Footer>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state.auth;
  return {
    user
  }
}

export default connect(mapStateToProps)(Sidebar);