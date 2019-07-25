import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon, Button } from 'native-base';
import { SwipeRow } from 'react-native-swipe-list-view';
import moment from 'moment';
import styles from './styles';

class AgendaItemSwipe extends PureComponent {

  render() {
    const { item, navigateTo, deleteAtendimento } = this.props;
    const { id, data, observacoes, titulo } = item;
    return (
      <View style={[swipeStyles.swipeContainer]}>

        <SwipeRow ref={c => this.row = c}
          rightOpenValue={-75}
          disableRightSwipe={true}>
          <View style={[swipeStyles.swipeRowBack]}>
            <View />
            <View>
              <Button danger transparent onPress={() => {
                this.row.closeRow()
                deleteAtendimento(id);
              }}>
                <Icon style={{ fontSize: 30 }} active name="md-trash" />
              </Button>
            </View>
          </View>
          <View style={[swipeStyles.swipeRowFront]}>
            <View style={{ width: '80%', paddingTop: 10, paddingLeft: 10, paddingBottom: 10 }}>
              <Text secondary style={[styles.itemText, styles.textLarger, styles.fontMedium]}>
                {moment(data).format('HH:mm')}
              </Text>
              <Text style={[styles.itemText]}>{titulo}</Text>
              {observacoes ? <Text dark style={[styles.itemText]}>{observacoes}</Text> : null}
            </View>
            <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
              <Button secondary transparent onPress={() => {
                navigateTo(item, 'edit')
              }}>
                <Icon style={{ fontSize: 30 }} name="create" />
              </Button>
            </View>
          </View>
        </SwipeRow>

      </View>
    );
  }
}

const swipeStyles = StyleSheet.create({
  swipeContainer: {
    overflow: 'hidden', marginTop: 17, borderRadius: 5
  },
  swipeRowBack: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  swipeRowFront: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff'
  }
});

export default AgendaItemSwipe;