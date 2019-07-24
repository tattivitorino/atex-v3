import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Icon, Button, Text, Card, Thumbnail, H3 } from 'native-base';

import { formatString } from '../../utils';
import { item, typografy } from '../../styles';
import material from '../../../native-base-theme/variables/material';

class ClienteItem extends PureComponent {

  render() {
    const { data, avatar, navigateToDetail, openLink, last, first } = this.props;
    const { id, nome, cpf, celular, valido } = data;
    const img = data.avatar ? { uri: data.avatar } : avatar;
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => {
        navigateToDetail({ id })
      }}>
        <Card style={[styles.container, last ? styles.last : null, first ? styles.first : null]}>

          <View style={[styles.content, valido === true ? styles.itemValido : null]}>

            <View style={[styles.children, styles.left]}>
              <Thumbnail square source={img} size={40} />
            </View>

            <View style={[styles.children, styles.middle]}>

              <View style={{ paddingLeft: 10 }}>
                <H3>{nome}</H3>
                <Text dark>{formatString(cpf, 'cpf')}</Text>
                <H3 secondary style={[styles.marginVertical, styles.fontBold]}>{formatString(celular, 'ddd-mobile')}</H3>
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
              <Button transparent onPress={() => {
                navigateToDetail({ id })
              }}>
                <Icon secondary style={[styles.buttonIcon, valido === true ? styles.colorValido : null]} name="arrow-forward" />
              </Button>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  ...typografy,
  ...item,
  container: {
    marginBottom: 16,
    padding: 0,
    borderWidth: 0,
    marginLeft: 5
  },
  first: {
    marginTop: 16
  },
  last: {
    marginBottom: 60
  },
  content: {
    ...item.container,
    borderBottomWidth: 0,
    borderLeftWidth: 5,
    borderLeftColor: material.brandSecondary
  },
  itemValido: {
    borderLeftColor: material.brandSuccess
  },
  iconValido: {
    position: 'absolute',
    top: 10,
    right: 16
  },
  marginVertical: {
    marginVertical: 5
  },
  border: {
    borderWidth: 1,
    borderColor: '#000'
  },
  colorValido: {
    color: material.brandSuccess
  }
});

export default ClienteItem;