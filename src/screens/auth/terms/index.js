import React, { Component } from 'react';
import { Container, Content, Text } from 'native-base';
import BaseHeader from '../../../components/baseHeader';
import styles from '../styles';

class Terms extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <BaseHeader back navigation={this.props.navigation} title="Termos" />
        <Content padder>
          <Text>Termos e Condições de Uso do ATEX</Text>
        </Content>
      </Container>
    );
  }
}

export default Terms;
