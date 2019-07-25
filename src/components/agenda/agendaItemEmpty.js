import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';
import styles from './styles';

class AgendaItemEmpty extends PureComponent {

  render() {
    return (
      <View style={[styles.item, { alignItems: 'center' }]}>
        <View style={{ width: '100%' }}>
          <Text medium>Não existem Agendamentos.</Text>
        </View>
      </View>
    );
  }

}

export default AgendaItemEmpty;