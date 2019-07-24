import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon, Button, Text, Card, Thumbnail, H3 } from 'native-base';
import _ from 'lodash';
import { formatString, dateFormat } from '../../utils';

import statusData from '../../data/documentoStatus.json';

import { item, general } from '../../styles';
import material from '../../../native-base-theme/variables/material';
const avatar = require('../../../assets/imgs/document.jpg');

//AntDesign - pdffile1, wordfile1

const renderThumb = (arquivo, meta_dados) => {
  //console.log('META DADOS: ', typeof meta_dados, meta_dados);
  if (!meta_dados) return <Thumbnail square source={avatar} style={[]} />;

  meta_dados = JSON.parse(meta_dados);
  if (!meta_dados.type && !meta_dados.mimeType) return <Thumbnail square source={avatar} style={[]} />;
  const type = meta_dados.mimeType ? meta_dados.mimeType : meta_dados.type;

  if (type.indexOf('image') !== -1) {
    return <Thumbnail square source={{ uri: arquivo }} style={[]} />
  }
  else if (type.indexOf('pdf') !== -1) {
    return <Icon type="AntDesign" name="pdffile1" style={[styles.documentItemIcon]} />
  }
  else if (type.indexOf('word') !== -1 || type.indexOf('document') !== -1) {
    return <Icon type="AntDesign" name="wordfile1" style={[styles.documentItemIcon]} />
  }
  else if (type.indexOf('excel') !== -1 || type.indexOf('spreadsheet') !== -1) {
    return <Icon type="AntDesign" name="exclefile1" style={[styles.documentItemIcon]} />
  }
  else if (type.indexOf('text/plain') !== -1) {
    return <Icon type="AntDesign" name="filetext1" style={[styles.documentItemIcon]} />
  }
  else if (type.indexOf('video') !== -1) {
    return <Icon name="md-videocam" style={[styles.documentItemIcon]} />
  }
  else if (type.indexOf('audio') !== -1) {
    return <Icon name="ios-musical-notes" style={[styles.documentItemIcon]} />
  }
}

const DocumentoItem = ({ data, last, first, tipoList, deleteDocument, openDocument, uploadDocument, uploadingDocumentoPendente }) => {

  const { id, tipo_documento, arquivo, referencia, status, comentario, meta_dados, uploadingDoc, progressDoc, errorDoc } = data;
  const tipo = _.find(tipoList, { id: tipo_documento });

  return (
    <View style={[styles.container, first ? styles.first : null, last ? styles.last : null]}>

      <TouchableOpacity style={[styles.children, styles.left]} onPress={() => {
        openDocument(data)
      }}>
        <View>
          {renderThumb(arquivo, meta_dados)}
        </View>
      </TouchableOpacity>

      <View style={[styles.children, styles.middle, { width: '79%' }]}>
        <View style={{ paddingLeft: 10 }}>
          <H3>{tipo.nome}</H3>
          {referencia ? <Text dark>{referencia}</Text> : null}
          {status === 'P' ? <Text medium>Pendente de avaliação</Text> : null}
          {status === 'A' ? <Text success>Aprovado</Text> : null}
          {status === 'R' ? <Text danger>Reprovado</Text> : null}
          {status === 'PU' ? <Text danger>Pendente de envio</Text> : null}
          {comentario ? <Text dark>{comentario}</Text> : null}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

          <Button transparent disabled={uploadingDoc || uploadingDocumentoPendente} onPress={() => {
            if (status === 'PU' && !uploadingDocumentoPendente) uploadDocument(data);
          }}>
            <Icon style={[styles.buttonIcon, status === 'PU' ? styles.iconPrimary : styles.iconSuccess, uploadingDoc || uploadingDocumentoPendente ? styles.iconDisabled : null]} name="md-cloud-upload" />
          </Button>

          {uploadingDoc ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ActivityIndicator style={{ marginHorizontal: 10 }} />
            <View>
              <Text medium style={{ marginHorizontal: 10 }}>{progressDoc}%</Text>
            </View>
          </View> : null}

          {status === 'PU' && !uploadingDoc ? <Button disabled={uploadingDocumentoPendente} transparent danger onPress={() => {
            if (status === 'PU' && !uploadingDocumentoPendente) deleteDocument(data);
          }}>
            <Icon style={[styles.buttonIcon, uploadingDocumentoPendente ? styles.iconDisabled : null]} name="ios-trash" />
          </Button> : null}



        </View>
        {/* errorDoc && <View style={{ paddingLeft: 10 }}>
          <Text medium style={{ fontSize: 14 }}>Houve um erro no envio do documento</Text>
        </View> */}

      </View>

      <View style={[styles.children, styles.right]}>
        {status === 'A' ? <Icon success style={styles.buttonIcon} name="checkmark-circle" /> : <Icon danger style={styles.buttonIcon} name="information-circle" />}
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  ...general,
  ...item
});

export default DocumentoItem;