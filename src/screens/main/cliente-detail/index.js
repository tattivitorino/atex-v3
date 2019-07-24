import React, { Component } from 'react';
import { View, Linking, StyleSheet, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { Container, Content, Icon, Fab, Button, Text, Card, CardItem, Thumbnail, Input, Item, Right, Segment, H1, H2, H3 } from 'native-base';

import { connect } from 'react-redux';
import { fetchClienteRequest, deleteDocumentoRequest, uploadDocumentoRequest } from '../../../store/actions';

import CustomHeader from '../../../components/customHeader';
import ClienteDados from './ClienteDados';
import ClienteDocumentos from './ClienteDocumentos';
import { formatString, reverseDate, showConfirm } from '../../../utils';

import { general } from '../../../styles';

const avatar = require('../../../../assets/imgs/avatar.jpg');

class ClienteDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      segment: 1,
      hideUI: true
    };
  }

  openLink = params => {
    let { type, celular } = params;
    celular = celular.indexOf('+55') === -1 ? `+55 ${celular}` : celular;

    let url = `tel:${celular}`;
    if (type == 'whatsapp') {
      url = `whatsapp://send?phone=${celular}`;
    }
    Linking.openURL(url)
  }

  deleteDocument = data => {
    //console.log('DELETE DOCUMENT ID: ', id);
    showConfirm('Documento', 'Você deseja mesmo remover o documento?', null, () => {
      this.props.deleteDocumentoRequest(data);
    })
  }

  uploadDocument = data => {
    this.props.uploadDocumentoRequest(data)
  }

  openDocument = item => {
    //console.log(item);
    const { arquivo, meta_dados } = item;
    if (!meta_dados) return;
    const meta = JSON.parse(meta_dados);
    if (!meta.type && !meta.mimeType) return;
    const type = meta.mimeType ? meta.mimeType : meta.type;
    if (type.indexOf('pdf') !== -1
      || type.indexOf('word') !== -1
      || type.indexOf('excel') !== -1
      || type.indexOf('image') !== -1
      || type.indexOf('document') !== -1
      || type.indexOf('spreadsheet') !== -1) {
      Linking.openURL(arquivo)
    } else if (type.indexOf('video') !== -1 || type.indexOf('audio') !== -1) {
      this.props.navigation.navigate('MediaPlayer', { item })
    }
  }

  fetchItem = () => {
    const { navigation, fetchClienteRequest } = this.props;
    const id = navigation.getParam('id');
    fetchClienteRequest(id)
  }

  componentDidMount() {
    this.fetchItem()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fetching === false && this.state.hideUI === true) {
      this.setState({
        hideUI: false
      })
    }
  }

  onSegmentChange(segment) {
    this.setState({
      segment: segment
    })
  }

  renderContent() {
    const { fetching, cliente, documentoTipoList, uploadingDocumentoPendente } = this.props;
    const { nome, cpf, rg, data_nascimento, valido } = cliente;
    const img = cliente.avatar ? { uri: cliente.avatar } : avatar;

    if (fetching && this.state.hideUI) return null;

    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20 }}>
          <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => {
              //console.log(cliente.id);
              if (valido === false) this.props.navigation.navigate('ImagePicker', { type: 'avatar', itemId: cliente.id });
            }}>
              <Thumbnail large source={img} />
              <Icon name="camera" secondary style={{ alignSelf: 'flex-end', marginTop: -15, marginRight: 5, fontSize: 30 }} />
            </TouchableOpacity>
          </View>
          <View style={{ width: '69%' }}>
            <View>
              <H3>{nome}</H3>
              <H3>{formatString(cpf, 'cpf')}</H3>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text>{rg}</Text>
              <Text style={{ marginLeft: 10 }}>{reverseDate(data_nascimento)}</Text>
            </View>
          </View>
        </View>

        {this.state.segment === 1 && <ClienteDados data={cliente} />}
        {this.state.segment === 2 && <ClienteDocumentos
          data={cliente} tipoList={documentoTipoList}
          deleteDocument={this.deleteDocument}
          openDocument={this.openDocument}
          uploadDocument={this.uploadDocument}
          uploadingDocumentoPendente={uploadingDocumentoPendente} />}

      </View>
    )
  }

  render() {
    const { fetching, navigation, cliente } = this.props;
    const { celular } = cliente;
    return (
      <Container>
        <CustomHeader hasSegment back navigation={navigation}
          rightControl={
            <Right>
              <Button transparent white
                onPress={() => {
                  this.openLink({ type: 'whatsapp', celular })
                }}>
                <Icon name="logo-whatsapp" />
              </Button>
              <Button transparent white
                onPress={() => {
                  this.openLink({ type: 'phone', celular })
                }}>
                <Icon type="Entypo" name="phone" />
              </Button>
            </Right>
          } />
        <Segment style={[styles.segmentHolder]}>

          <Button transparent white style={[styles.segmentButton, this.state.segment === 1 ? styles.segmentButtonActive : null]} onPress={() => {
            this.onSegmentChange(1)
          }}>
            <Icon style={[styles.segmentButtonIcon]} name="ios-person" />
          </Button>

          <Button transparent white style={[styles.segmentButton, this.state.segment === 2 ? styles.segmentButtonActive : null]} onPress={() => {
            this.onSegmentChange(2)
          }}>
            <Icon style={[styles.segmentButtonIcon]} name="ios-list-box" />
          </Button>

        </Segment>

        <Content refreshControl={
          <RefreshControl
            refreshing={fetching}
            onRefresh={this.fetchItem} />
        }
          contentContainerStyle={{}}>

          {this.renderContent()}

        </Content>

        {this.state.segment === 1 && cliente.valido === false ? <Fab
          direction="up"
          containerStyle={{}}
          style={styles.fabPrimary}
          position="bottomRight"
          onPress={() => this.props.navigation.navigate('ClienteEdit')}>
          <Icon name="md-create" />
        </Fab> : null}

        {this.state.segment === 2 && cliente.valido === false ? <Fab
          direction="up"
          containerStyle={{}}
          style={styles.fabPrimary}
          position="bottomRight"
          onPress={() => this.props.navigation.navigate('ClienteAddDoc', { backTo: 'ClienteDetail' })}>
          <Icon name="add" />
        </Fab> : null}

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  ...general
});

const mapStateToProps = state => {
  const { fetching, error, cliente } = state.clientes;
  const { documentoTipoList, uploadingDocumentoPendente } = state.documentos;
  return { fetching, error, cliente, documentoTipoList, uploadingDocumentoPendente };
}

export default connect(mapStateToProps, {
  fetchClienteRequest,
  deleteDocumentoRequest,
  uploadDocumentoRequest
})(ClienteDetail);
