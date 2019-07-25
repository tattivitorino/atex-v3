import React, { Component } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { Container, Content } from 'native-base';

import { connect } from 'react-redux';
import { fetchAtendimentoRequest } from '../../../store/actions';

import BaseHeader from '../../../components/baseHeader';
import Loader from '../../../components/common/loader';
import AgendaForm from '../../../components/forms/agenda';

class AgendaEdit extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { navigation, fetchAtendimentoRequest } = this.props;
    const id = navigation.getParam('id');
    fetchAtendimentoRequest(id)
  }

  render() {
    const { loading, updating } = this.props;
    return (
      <Container>
        {updating && <Loader visible={updating} textContent={'Enviando Dados...'} />}
        <BaseHeader back showLogout navigation={this.props.navigation}
          title="Editar Atendimento" />
        <Content padder>
          {loading ? <ActivityIndicator size="large" style={{ marginTop: 20 }} /> : <AgendaForm formType="edit" />}
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  const { updating, loading } = state.atendimentos;
  return { updating, loading };
}

export default connect(mapStateToProps, {
  fetchAtendimentoRequest
})(AgendaEdit);