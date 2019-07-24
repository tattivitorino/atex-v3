import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, Button, Text, Card, Thumbnail, H3 } from 'native-base';

import { formatString } from '../../utils';
import { item, typografy } from '../../styles';

const ClienteItemAnt = ({ data, avatar, navigateToDetail, openLink, last }) => {
  const { id, nome, cpf, celular } = data;
  return (
    <Card style={[styles.container, last ? styles.last : null]}>

      <View style={[styles.children, styles.left]}>
        <Thumbnail square source={avatar} />
      </View>

      <View style={[styles.children, styles.middle]}>
        <View style={{}}>
          <H3 black>{nome}</H3>
          <Text dark>{formatString(cpf, 'cpf')}</Text>
          <H3 secondary style={[styles.marginVertical, styles.fontBold]}>{formatString(celular, 'ddd-phone')}</H3>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Button transparent secondary
            onPress={() => {
              openLink({ type: 'whatsapp', celular })
            }}>
            <Icon style={styles.buttonIcon} name="logo-whatsapp" />
          </Button>
          <Button transparent secondary
            onPress={() => {
              openLink({ type: 'phone', celular })
            }}>
            <Icon style={styles.buttonIcon} type="Entypo" name="phone" />
          </Button>
        </View>
      </View>

      <View style={[styles.children, styles.right]}>
        <Button secondary transparent onPress={() => {
          navigateToDetail({ id })
        }}>
          <Icon style={styles.buttonIcon} name="arrow-forward" />
        </Button>
      </View>

    </Card>
  );
};

const styles = StyleSheet.create({
  ...typografy,
  ...item,
  container: {
    ...item.container,
    borderBottomWidth: 0
  },
  last: {
    ...item.last,
    marginBottom: 60
  },
  marginVertical: {
    marginVertical: 5
  },
  border: {
    borderWidth: 1,
    borderColor: '#000'
  }
});

export default ClienteItemAnt;