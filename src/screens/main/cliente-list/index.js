import React, { Component } from 'react';
import { View, FlatList, Linking, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { Container, Content, Icon, Fab, Button, Text, Card, CardItem, Thumbnail, Input, Item } from 'native-base';
import BaseHeader from '../../../components/baseHeader';
import ClienteItem from '../../../components/clienteItem';

import { connect } from 'react-redux';
import {
  fetchClientesRequest,
  searchClienteText,
  fetchDocumentoTiposRequest
} from '../../../store/actions';
import { filterClientesByText } from '../../../store/selectors';

import { general } from '../../../styles';

const avatar = require('../../../../assets/imgs/avatar.jpg');

class ClienteList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.scrollRef;
  }

  componentDidMount() {
    this.props.navigation.setParams({
      scrollToTop: () => {
        if (this.scrollRef) this.scrollRef.scrollToOffset({ offset: 0, animated: true });
      }
    })
    this.fetchList(1);
    this.props.fetchDocumentoTiposRequest();
  }

  fetchList = page => {
    const { fetchClientesRequest } = this.props;
    fetchClientesRequest({ page });
  }

  loadMore = () => {
    const { page, loading, next } = this.props;
    if (loading || next === null) return;
    this.fetchList(page + 1);
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

  onChangeText = text => {
    const { searchClienteText } = this.props;
    searchClienteText(text);
  }

  renderItem = ({ item, index }) => {
    const { list, loading, navigation } = this.props;
    const last = index === list.length - 1 && !loading ? true : false;
    const first = index === 0 ? true : false;
    return (
      <ClienteItem
        navigateToDetail={pageParams => {
          navigation.navigate('ClienteDetail', pageParams);
        }}
        openLink={this.openLink}
        data={item}
        avatar={avatar}
        last={last}
        first={first} />
    )
  }

  renderListFooter = () => {
    const { loading } = this.props;
    if (!loading) return null;
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  render() {
    const { fetching, list } = this.props;
    return (
      <Container>

        <BaseHeader showLogout navigation={this.props.navigation} title="Pré-cadastros" />

        <Card style={{ margin: 0, padding: 5 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Item regular style={{ flex: 1 }}>
              <Icon name="search" />
              <Input placeholder='Filtrar por Nome, CPF ou Celular'
                keyboardType="default"
                textContentType="none"
                returnKeyType="done"
                clearButtonMode="while-editing"
                onChangeText={this.onChangeText} />
            </Item>
          </View>
        </Card>

        <FlatList
          ref={ref => this.scrollRef = ref}
          data={list}
          extraData={this.props}
          renderItem={this.renderItem}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={!fetching && <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>Não existem Pré Cadastros</Text>
          </View>}
          ListFooterComponent={this.renderListFooter}
          onEndReachedThreshold={0.3}
          onEndReached={this.loadMore}
          refreshControl={
            <RefreshControl
              refreshing={fetching}
              onRefresh={() => {
                this.fetchList(1)
              }} />
          }
        />

        <Fab
          direction="up"
          containerStyle={{}}
          style={styles.fabPrimary}
          position="bottomRight"
          onPress={() => this.props.navigation.navigate('ClienteAdd')}>
          <Icon name="add" />
        </Fab>


      </Container>
    );
  }
}

const styles = StyleSheet.create({
  ...general
});

const mapStatetoProps = state => {
  const { fetching, loading, error, page, count, limit, next } = state.clientes;
  const list = filterClientesByText(state);
  return { fetching, loading, error, page, count, limit, next, list };
}

export default connect(mapStatetoProps, {
  fetchClientesRequest,
  searchClienteText,
  fetchDocumentoTiposRequest
})(ClienteList);
