import React, { Component } from 'react';
import { Container, Content, Button, Text } from 'native-base';
import BaseHeader from '../../../components/baseHeader';

class CameraScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <BaseHeader back title="Camera" navigation={this.props.navigation} />
        <Content padder>

        </Content>
      </Container>
    );
  }
}

export default CameraScreen;
