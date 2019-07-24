import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

import _ from 'lodash';
import { createSelector } from 'reselect';

const dateFormat = 'YYYY-MM-DD';
const getAtendimentos = state => state.atendimentos.atendimentoList;

const getDaysInMonth = currMonth => {
  const currMonthRange = moment().range(moment(currMonth).startOf('month'), moment(currMonth).endOf('month'));
  const currMonthdays = currMonthRange.by('days');

  const nextMonth = moment(currMonth).add(1, 'month');
  const nextMonthRange = moment().range(moment(nextMonth).startOf('month'), moment(nextMonth).endOf('month'));
  const nextMonthdays = nextMonthRange.by('days');

  return [...currMonthdays, ...nextMonthdays].map(date => date.format(dateFormat));
}

export const parseAgendaAtendimentos = createSelector(
  [getAtendimentos],
  (atendimentoList) => {
    const atdList = _.orderBy(atendimentoList, ['data'], ['asc']);
    //console.log('ATDLIST: ', atdList);

    const agendaAtendimentosList = {};
    const currMonth = moment().format('YYYY-MM');
    const days = getDaysInMonth(currMonth);

    for (let day of days) {
      agendaAtendimentosList[day] = [];
    }

    if (atdList.length) {
      let currDate = moment(atdList[0].data).format(dateFormat);

      for (let atd of atdList) {
        const atdDate = moment(atd.data).format(dateFormat);

        if (atdDate == currDate) {
          if (!agendaAtendimentosList[currDate]) agendaAtendimentosList[currDate] = [];
          agendaAtendimentosList[currDate].push(atd);
        }
        else {
          if (!agendaAtendimentosList[atdDate]) agendaAtendimentosList[atdDate] = [];
          agendaAtendimentosList[atdDate].push(atd);
          currDate = atdDate;
        }

      }
    }
    //console.log(agendaAtendimentosList);
    return agendaAtendimentosList;
  }
);

export const getDashboardAtendimentos = createSelector(
  [getAtendimentos],
  (atendimentoList) => {
    if (!atendimentoList || !atendimentoList.length) return [];
    const atdList = _.orderBy(atendimentoList, ['data'], ['asc']);
    const list = atdList.filter(item => {
      return moment(item.data).isAfter(moment().format());
    });
    return list.slice(0, 3);
  }
)