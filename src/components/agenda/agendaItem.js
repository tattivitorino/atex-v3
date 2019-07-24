import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Text, Icon, Button } from 'native-base';
import moment from 'moment';
import styles from './styles';

class AgendaItem extends PureComponent {

  render() {
    const { item, navigateTo } = this.props;
    const { data, observacoes, titulo } = item;
    return (
      <View style={[styles.item]}>
        <View style={{ width: '80%' }}>
          <Text secondary style={[styles.itemText, styles.textLarger, styles.fontMedium]}>
            {moment(data).format('HH:mm')}
          </Text>
          <Text style={[styles.itemText]}>
            {`${titulo}`}
          </Text>
          <Text dark style={[styles.itemText]}>
            {`${observacoes}`}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Button secondary transparent onPress={() => {
            navigateTo(item, 'edit')
          }}>
            <Icon name="create" />
          </Button>
        </View>
      </View>
    );
  }

}

export default AgendaItem;