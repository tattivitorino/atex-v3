import React, { Component } from 'react';
import { Container } from 'native-base';

import { connect } from 'react-redux';

import BaseHeader from '../../../components/baseHeader';
import DocsAddForm from '../../../components/forms/docs-add/index';
import Loader from '../../../components/common/loader';

class ClienteAddDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { updating, navigation, progress } = this.props;
    const backTo = navigation.getParam('backTo');
    return (
      <Container>
        {updating && <Loader visible={updating} textContent={`Enviando Dados.. (${progress}%)`} />}
        <BaseHeader back backTo={backTo} navigation={this.props.navigation}
          title="Adicionar Documento" />
        <DocsAddForm formType="add" />
      </Container>
    )
  }
}

const mapStateToProps = state => {
  const { updating, progress } = state.documentos;
  return { updating, progress };
}

export default connect(mapStateToProps)(ClienteAddDoc);