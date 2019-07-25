import React, { Component } from 'react';
import { View, FlatList, Linking, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { Container, Content, Icon, Text, ListItem, Body, Right, Button, H3 } from 'native-base';
import BaseHeader from '../../../components/baseHeader';
import { connect } from 'react-redux';
import { fetchNotificationsRequest, updateNotificationRequest } from '../../../store/actions';

import { dateFormat } from '../../../utils';
import { typografy } from '../../../styles';

class NotificacoesScreen extends Component {

  _fetchList = page => {
    const { fetchNotificationsRequest } = this.props;
    fetchNotificationsRequest({ page })
  }

  _loadMore = () => {
    const { page, loading, next } = this.props;
    if (loading || next === null) return;
    this._fetchList(page + 1);
  }

  _renderListFooter = () => {
    const { loading } = this.props;
    if (!loading) return null;
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  _renderItem = ({ item, index }) => {
    const { list, updateNotificationRequest } = this.props;
    const last = index === list.length - 1;
    const { id, created, titulo, mensagem } = item;
    return (
      <ListItem>
        <Body>
          <Text medium>{dateFormat(created, 'fromNow')}</Text>
          <Text style={[styles.itemTitle]}>{titulo}</Text>
          <Text dark style={[styles.itemSubtitle]}>{mensagem}</Text>
        </Body>
        <Right>
          <Button disabled={item.lida === 1} transparent onPress={() => {
            updateNotificationRequest({ ...item, lida: true })
          }}>
            {item.lida ? <Icon medium name="notifications" /> : <Icon secondary name="notifications" />}
          </Button>
        </Right>
      </ListItem>
    );
  }


  render() {
    const { navigation, fetching, list } = this.props;
    return (
      <Container>
        <BaseHeader back navigation={navigation} title="Notificações" />
        <FlatList
          data={list}
          extraData={this.props}
          renderItem={this._renderItem}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={!fetching && <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>Você não tem novas notificações!</Text>
          </View>}
          ListFooterComponent={this._renderListFooter}
          onEndReachedThreshold={0.3}
          onEndReached={this._loadMore}
          refreshControl={
            <RefreshControl
              refreshing={fetching}
              onRefresh={() => {
                this._fetchList(1)
              }} />
          }
        />
      </Container >
    );
  }
}

const styles = StyleSheet.create({
  ...typografy
});

const mapStateToProps = state => {
  const { fetching, loading, page, count, limit, next, list } = state.notifications;
  return { fetching, loading, page, count, limit, next, list };
}

export default connect(mapStateToProps, {
  fetchNotificationsRequest,
  updateNotificationRequest
})(NotificacoesScreen);