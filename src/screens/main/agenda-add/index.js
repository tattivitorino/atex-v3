import React, { Component } from 'react';
import { Container, Content } from 'native-base';

import { connect } from 'react-redux';

import BaseHeader from '../../../components/baseHeader';
import Loader from '../../../components/common/loader';
import AgendaForm from '../../../components/forms/agenda';

class AgendaAdd extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { updating } = this.props;
    return (
      <Container>
        {updating && <Loader visible={updating} textContent={'Enviando Dados...'} />}
        <BaseHeader back showLogout navigation={this.props.navigation}
          title="Adicionar Atendimento" />
        <Content padder>
          <AgendaForm formType="add" />
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  const { updating } = state.atendimentos;
  return { updating };
}

export default connect(mapStateToProps)(AgendaAdd);