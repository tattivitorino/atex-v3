import React, { Component } from 'react';
import { View, RefreshControl } from 'react-native';
import { Text, Icon, Button } from 'native-base';
import { Agenda } from 'react-native-calendars';

import moment from 'moment';
import agendaConfig from './config';

import material from '../../../native-base-theme/variables/material';
import styles from './styles';

import AgendaItem from './agendaItem';
import AgendaItemSwipe from './agendaItemSwipe';
import AgendaItemEmpty from './agendaItemEmpty';

class AgendaComponent extends Component {

  agenda;
  dateFormat = 'YYYY-MM-DD';
  daySelected = moment().format(this.dateFormat);

  constructor(props) {
    super(props);
    this.state = {
      daySelected: this.daySelected,
      monthSelected: {
        monthName: moment().format('MMMM'),
        month: moment().format('M'),
        year: moment().format('YYYY')
      }
    }
  }

  _onItemPress = (item, action) => {
    const { navigation } = this.props;
    if (action === 'edit') navigation.navigate('AgendaEdit', { id: item.id });
    else navigation.navigate('AgendaAdd', { datetime: item });
  }

  _loadItemsForMonth = month => {
    //console.log('LOAD ITEMS FOR MONTH: ', month);
  }

  _renderItem = item => {
    return (
      <AgendaItemSwipe item={item} navigateTo={this._onItemPress} deleteAtendimento={this.props.deleteAtendimento} />
    );
  }

  _renderEmptyData = () => {
    return (
      <View style={styles.emptyData}>
        <Text medium>Não existem Agendamentos.</Text>
      </View>
    );
  }

  _renderEmptyDate = date => {
    return (
      <AgendaItemEmpty date={date} navigateTo={this._onItemPress} />
    );
  }

  _onDayChange = day => {
    //console.log('CHANGE DAY HANDLER', day);
    const { month, year } = this.state.monthSelected;
    if (day.month == month && day.year == year) return;
    const monthName = moment(day.dateString).format('MMMM')
    this.setState({
      monthSelected: {
        month: day.month,
        year: day.year,
        monthName
      }
    })
  }

  _rowHasChanged = (r1, r2) => {
    return r1.data !== r2.data
      || r1.titulo !== r2.titulo
      || r1.observacoes !== r2.observacoes;
  }

  render() {
    const { items } = this.props;
    const { monthName, year } = this.state.monthSelected;
    return (
      <View style={[styles.container, { paddingTop: 20, paddingHorizontal: 10 }]}>

        <View style={{ paddingBottom: 20, alignItems: 'center' }}>
          <Text secondary style={[styles.textLarge]}>{`${monthName} - ${year}`}</Text>
        </View>

        <Agenda
          items={items}
          loadItemsForMonth={this._loadItemsForMonth}
          selected={this.daySelected}
          renderItem={this._renderItem}
          renderEmptyDate={this._renderEmptyDate}
          renderEmptyData={this._renderEmptyData}
          rowHasChanged={this._rowHasChanged}
          onDayPress={this._onDayChange}
          onDayChange={this._onDayChange}
          firstDay={1}
          theme={{
            calendarBackground: '#fff',
            todayTextColor: material.brandSecondary,
            selectedDayBackgroundColor: material.brandSecondary,
            dotColor: material.brandSecondary,
            selectedDotColor: '#FFF',
            agendaTodayColor: material.brandSecondary,
            agendaKnobColor: material.brandSecondary
          }}
          style={{}}
        />
      </View>
    );
  }
}

export default AgendaComponent;