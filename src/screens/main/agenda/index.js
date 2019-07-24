import React, { Component } from 'react';
import { View, FlatList, Linking, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { Container, Content, Icon, Fab, Button, Text, Card, CardItem, Thumbnail, Input, Item } from 'native-base';
import BaseHeader from '../../../components/baseHeader';
import AgendaComponent from '../../../components/agenda';
import Loader from '../../../components/common/loader';

import { connect } from 'react-redux';
import { fetchAtendimentosRequest, deleteAtendimentoRequest } from '../../../store/actions';
import { parseAgendaAtendimentos } from '../../../store/selectors';

import { showConfirm } from '../../../utils';

import { general } from '../../../styles';

class Agenda extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchList(1);
  }

  fetchList = page => {
    const { fetchAtendimentosRequest } = this.props;
    fetchAtendimentosRequest({ page });
  }

  deleteAtendimento = id => {
    showConfirm('Atendimento', 'Você deseja mesmo remover o atendimento?', null, () => {
      this.props.deleteAtendimentoRequest(id);
    })
  }

  render() {
    const { fetching, updating, list, navigation } = this.props;
    return (
      <Container>
        {updating && <Loader visible={updating} textContent={'Enviando Dados...'} />}
        <BaseHeader showLogout navigation={navigation} title="Agenda" />
        <Content contentContainerStyle={{ flex: 1 }}>
          {fetching ? <ActivityIndicator size="large" style={{ marginTop: 20 }} /> : <AgendaComponent
            navigation={navigation}
            items={list}
            deleteAtendimento={this.deleteAtendimento}
            fetchList={this.fetchList}
          />}
        </Content>
        <Fab
          direction="up"
          containerStyle={{}}
          style={styles.fabPrimary}
          position="bottomRight"
          onPress={() => this.props.navigation.navigate('AgendaAdd')}>
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  ...general
});

const mapStateToProps = state => {
  const { fetching, loading, updating, error } = state.atendimentos;
  const list = parseAgendaAtendimentos(state);
  return { fetching, loading, updating, error, list };
}

export default connect(mapStateToProps, {
  fetchAtendimentosRequest,
  deleteAtendimentoRequest,
  parseAgendaAtendimentos
})(Agenda);
