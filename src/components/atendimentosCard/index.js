import React, { Component } from 'react';
import { View, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Button, Text, Card, CardItem, Body, Right, Left, Icon, List, ListItem, Badge, H3 } from 'native-base';
import { dateFormat } from '../../utils';
import { connect } from 'react-redux';
import { getDashboardAtendimentos } from '../../store/selectors';
import { typografy, general, item } from '../../styles';

class AtendimentosCard extends Component {

  _renderItem = ({ item, index }) => {
    const { list } = this.props;
    const last = index === list.length - 1;
    const { data, titulo, observacoes } = item;
    return (
      <ListItem style={[last ? styles.last : null]}>
        <Body>
          <Text style={[styles.itemTitle]}>{dateFormat(data, 'DD/MM/YYYY HH:mm')}</Text>
          <Text dark>{titulo}</Text>
        </Body>
      </ListItem>
    );
  }

  render() {
    const { navigation, type, headerTitle, footerTitle, fetching, list } = this.props;
    return (
      <Card style={{ marginBottom: 16 }}>
        <CardItem header style={[styles.greyBorderBottom, { justifyContent: 'flex-start' }]}>
          <H3 secondary style={[styles.cardHeaderTitle]}>{headerTitle}</H3>
        </CardItem>

        <View style={{ paddingRight: 10 }}>
          {!fetching ? <FlatList
            data={list}
            extraData={this.props}
            renderItem={this._renderItem}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={!fetching && <View style={{ padding: 20, alignItems: 'center' }}>
              <Text>Você não tem atendimentos agendados!</Text>
            </View>}
          /> : <ActivityIndicator style={{ marginTop: 16 }} />}
        </View>

        <CardItem footer style={{ justifyContent: 'flex-end' }}>
          <Button transparent secondary onPress={() => {
            navigation.navigate('Agenda')
          }}>
            <Text style={styles.cardFooterTitle}>{footerTitle}</Text>
          </Button>
        </CardItem>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  ...general,
  ...item,
  ...typografy
});

const mapStateToProps = state => {
  const { fetching } = state.atendimentos;
  const list = getDashboardAtendimentos(state);
  return { list, fetching };
}

export default connect(mapStateToProps)(AtendimentosCard);