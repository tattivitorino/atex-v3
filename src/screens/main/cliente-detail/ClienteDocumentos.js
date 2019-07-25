import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Icon, Button, Text, Card, CardItem, Thumbnail } from 'native-base';

import { formatString, reverseDate } from '../../../utils';
import DocumentoItem from '../../../components/documentoItem';

const ClienteDocumentos = ({ data, tipoList, deleteDocument, openDocument, uploadDocument, uploadingDocumentoPendente }) => {
  const { documentos } = data;
  return (
    <View>
      <View style={{ padding: 10, backgroundColor: '#fff', marginBottom: 30 }}>
        <FlatList
          data={documentos}
          renderItem={({ item, index }) => <DocumentoItem data={item} last={index === documentos.length - 1} first={index === 0} tipoList={tipoList} deleteDocument={deleteDocument} openDocument={openDocument} uploadDocument={uploadDocument} uploadingDocumentoPendente={uploadingDocumentoPendente} />}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <View style={{ padding: 15, alignItems: 'center' }}>
              <Text>Não existem Documentos Cadastrados</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

export default ClienteDocumentos;