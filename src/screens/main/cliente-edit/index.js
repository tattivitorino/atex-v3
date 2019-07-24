import React, { Component } from 'react';
import { Container } from 'native-base';

import { connect } from 'react-redux';

import BaseHeader from '../../../components/baseHeader';
import ClienteForm from '../../../components/forms/cliente/index';
import Loader from '../../../components/common/loader';

class ClienteEdit extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { updating } = this.props;
    return (
      <Container>
        {updating && <Loader visible={updating} textContent={'Enviando Dados...'} />}
        <BaseHeader back showLogout navigation={this.props.navigation} title="Editar Pré-cadastro" />
        <ClienteForm formType="edit" />
      </Container>
    )
  }
}

const mapStateToProps = state => {
  const { updating } = state.clientes;
  return { updating };
}

export default connect(mapStateToProps)(ClienteEdit);
