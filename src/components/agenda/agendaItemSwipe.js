import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Text, Icon, Button, SwipeRow } from 'native-base';
import moment from 'moment';
import styles from './styles';

class AgendaItemSwipe extends PureComponent {

  render() {
    const { item, navigateTo, deleteAtendimento } = this.props;
    const { id, data, observacoes, titulo } = item;
    return (
      <View style={{ overflow: 'hidden', marginTop: 17, borderRadius: 5 }}>
        <SwipeRow ref={c => this.row = c}
          style={{ paddingTop: 0, paddingRight: 0, paddingBottom: 0 }}
          rightOpenValue={-70}
          body={
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
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
          }
          right={
            <Button danger onPress={() => {
              this.row._root.closeRow()
              deleteAtendimento(id);
            }}>
              <Icon active name="md-trash" />
            </Button>
          }
        />
      </View>
    );
  }

}

export default AgendaItemSwipe;