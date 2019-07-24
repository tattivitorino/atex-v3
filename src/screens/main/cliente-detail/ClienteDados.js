import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, Button, Text, Card, CardItem, Thumbnail, H3 } from 'native-base';

import { formatString, formatAddress, capitalizeFirstLetter } from '../../../utils';

const ClienteDados = ({ data }) => {
  const { celular, telefone_fixo, email, logradouro, numero, complemento, bairro, cidade, estado, cep, profData, estCivilData, sexData, nacData } = data;

  return (
    <View>
      <Card style={[styles.cardList]}>
        {celular ? <CardItem bordered>
          <Icon style={[styles.cardListItemIcon]} secondary name="ios-phone-portrait" />
          <Text style={[styles.cardListItemText]}>{formatString(celular, 'ddd-mobile')}</Text>
        </CardItem> : null}
        {telefone_fixo ? <CardItem bordered>
          <Icon style={[styles.cardListItemIcon]} secondary name="ios-call" />
          <Text style={[styles.cardListItemText]}>{formatString(telefone_fixo, 'ddd-phone')}</Text>
        </CardItem> : null}
        {email ? <CardItem>
          <Icon style={[styles.cardListItemIcon]} secondary name="ios-mail" />
          <Text style={[styles.cardListItemText]}>{email}</Text>
        </CardItem> : null}
      </Card>

      {logradouro || numero || cep ? <Card style={[styles.cardList]}>
        <CardItem>
          <Icon style={[styles.cardListItemIcon]} secondary name="ios-home" />
          <View>
            <Text>{formatAddress({ logradouro, numero, complemento, bairro, cidade, estado })}</Text>
            <Text>{formatString(cep, 'cep')}</Text>
          </View>
        </CardItem>
      </Card> : null}

      {profData && estCivilData && nacData ? <Card style={[styles.cardList]}>
        <CardItem>
          <Icon style={[styles.cardListItemIcon]} secondary name="person" />
          <View>
            <Text>{profData.nome}</Text>
            <Text>{capitalizeFirstLetter(estCivilData.nome)}</Text>
            <Text>{nacData.nome}</Text>
          </View>
        </CardItem>
      </Card> : null}

    </View>
  );
}

const styles = StyleSheet.create({
  cardList: {
    padding: 10
  },
  cardListItem: {},
  cardListItemIcon: {
    fontSize: 30,
    marginRight: 10
  }
});

export default ClienteDados;