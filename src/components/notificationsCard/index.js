import React, { Component } from 'react';
import { View, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Button, Text, Card, CardItem, Body, Right, Left, Icon, List, ListItem, Badge, H3 } from 'native-base';
import { dateFormat } from '../../utils';
import { connect } from 'react-redux';
import { getDashboardNotifications } from '../../store/selectors';
import { typografy, general, item } from '../../styles';

class NotificationsCard extends Component {

  _renderItem = ({ item, index }) => {
    const { list } = this.props;
    const last = index === list.length - 1;
    const { created, titulo, mensagem } = item;
    return (
      <ListItem style={[last ? styles.last : null]}>
        <Body>
          <Text medium>{dateFormat(created, 'fromNow')}</Text>
          <Text style={[styles.itemTitle]}>{titulo}</Text>
          <Text dark style={[styles.itemSubtitle]}>{mensagem}</Text>
        </Body>
        <Right>
          <Button transparent onPress={() => { }}>
            <Icon secondary name="notifications" />
          </Button>
        </Right>
      </ListItem>
    );
  }

  renderBadge() {
    const { badgeCount } = this.props;
    if (badgeCount === null || badgeCount === 0) return null;
    return (
      <Badge danger>
        <Text>{badgeCount}</Text>
      </Badge>
    );
  }

  render() {
    const { navigation, type, headerTitle, footerTitle, fetching, list } = this.props;
    return (
      <Card style={{ marginBottom: 16 }}>
        <CardItem header style={[styles.greyBorderBottom, { justifyContent: 'space-between' }]}>
          <H3 secondary style={[styles.cardHeaderTitle]}>{headerTitle}</H3>
          {this.renderBadge()}
        </CardItem>

        <View style={{ paddingRight: 10 }}>
          {!fetching ? <FlatList
            data={list}
            extraData={this.props}
            renderItem={this._renderItem}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={!fetching && <View style={{ padding: 20, alignItems: 'center' }}>
              <Text>Você não tem novas notificações!</Text>
            </View>}
          /> : <ActivityIndicator style={{ marginTop: 16 }} />}
        </View>

        <CardItem footer style={{ justifyContent: 'flex-end' }}>
          <Button transparent secondary onPress={() => {
            navigation.navigate('Notificacoes')
          }}>
            <Text style={styles.cardFooterTitle}>{footerTitle}</Text>
          </Button>
        </CardItem>
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
  const { fetching, badgeCount } = state.notifications;
  const list = getDashboardNotifications(state);
  return { fetching, list, badgeCount };
}

export default connect(mapStateToProps)(NotificationsCard);
