import React, { Component } from 'react';
import { View, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Button, Text, Card, CardItem, Body, Right, Left, Icon, List, ListItem, Badge, H3 } from 'native-base';
import _ from 'lodash';
import { dateFormat, showConfirm } from '../../utils';
import { connect } from 'react-redux';
import { deleteDocumentoRequest, uploadDocumentoRequest } from '../../store/actions';

import { typografy, general, item } from '../../styles';

class FileUploadsCard extends Component {

  /**
   * {
    "arquivo": "file:///var/mobile/Containers/Data/Application/FBF3C4F0-6C83-43F4-882F-F1BD008CED5B/Documents/ExponentExperienceData/%2540tattivitorino%252Fatex-mob-ce/storage_31/1562757384706.pdf",
    "comentario": null,
    "diretorio": 31,
    "errorDoc": null,
    "id": 1562757385172,
    "meta_dados": "{\"mimeType\":\"application/pdf\",\"fileName\":\"1562757384706.pdf\",\"size\":13457,\"sizeReadable\":\"13.46 KB\",\"extension\":\"pdf\"}",
    "pid": 7,
    "pnome": "Sansa Stark",
    "progressDoc": 0,
    "status": "PU",
    "tipo_documento": 6,
    "uploadingDoc": false,
  }
   */

  _renderItem = ({ item, index }) => {
    const { documentoPendenteList, documentoTipoList, uploadingDocumentoPendente } = this.props;
    const last = index === documentoPendenteList.length - 1;
    const { id, meta_dados, pnome, errorDoc, progressDoc, uploadingDoc, referencia, tipo_documento } = item;
    const tipo = _.find(documentoTipoList, { id: tipo_documento }) || false;
    return (
      <View style={[styles.container, last ? styles.last : null]}>

        <View style={[styles.children, styles.middle, { width: '60%' }]}>
          <View style={{ paddingLeft: 10 }}>
            <H3>{pnome ? pnome : id}</H3>
            {tipo ? <Text medium>{tipo.nome}</Text> : null}
            {referencia ? <Text medium>{referencia}</Text> : null}
          </View>
        </View>
        <View style={[styles.children, styles.right, { width: '38%' }]}>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            {uploadingDoc ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator style={{ marginHorizontal: 10 }} />
              <View>
                <Text medium style={{ marginHorizontal: 10 }}>{progressDoc}%</Text>
              </View>
            </View> : null}


            {!uploadingDoc ? <Button disabled={uploadingDocumentoPendente} transparent primary onPress={() => {
              if (uploadingDocumentoPendente) return;
              this.props.uploadDocumentoRequest(item);
            }}>
              <Icon style={[styles.buttonIcon, uploadingDocumentoPendente ? styles.iconDisabled : null]} name="md-cloud-upload" />
            </Button> : null}

            {!uploadingDoc ? <Button disabled={uploadingDocumentoPendente} transparent danger onPress={() => {
              if (uploadingDocumentoPendente) return;
              showConfirm('Documento', 'Você deseja mesmo remover o documento?', null, () => {
                this.props.deleteDocumentoRequest(item);
              })
            }}>
              <Icon style={[styles.buttonIcon, uploadingDocumentoPendente ? styles.iconDisabled : null]} name="ios-trash" />
            </Button> : null}


          </View>


        </View>

      </View>

    );
  }

  render() {
    const { navigation, type, headerTitle, footerTitle, documentoPendenteList } = this.props;
    return (
      <Card style={{ marginBottom: 16 }}>
        <CardItem header style={[styles.greyBorderBottom, { justifyContent: 'space-between' }]}>
          <H3 secondary style={[styles.cardHeaderTitle]}>{headerTitle}</H3>
        </CardItem>

        <View style={{ paddingHorizontal: 10, paddingBottom: 20 }}>
          <FlatList
            data={documentoPendenteList}
            extraData={this.props}
            renderItem={this._renderItem}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={<View style={{ padding: 20, alignItems: 'center' }}>
              <Text>Você não tem documentos pendentes de envio!</Text>
            </View>}
          />
        </View>

      </Card>
    );
  }
}

const styles = StyleSheet.create({
  ...general,
  ...item,
  ...typografy
});

const mapStateToProps = state => {
  const { documentoPendenteList, documentoTipoList, uploadingDocumentoPendente } = state.documentos;
  return { documentoPendenteList, documentoTipoList, uploadingDocumentoPendente };
}

export default connect(mapStateToProps, {
  deleteDocumentoRequest,
  uploadDocumentoRequest
})(FileUploadsCard);
