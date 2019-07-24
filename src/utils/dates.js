import moment from 'moment';
//import 'moment/locale/pt-br'; 
import 'moment/min/locales'; //all locales need to be imported to fix app crash in prod mode
import 'moment-duration-format';

export const dateFormat = (value, format) => {
  moment.locale('pt-br');
  if (format == 'fromNow') return moment(value).fromNow();
  else if (format == 'milli') return moment(value).valueOf();
  else if (format == 'duration') return moment.duration(value).format('HH:mm:ss');
  else return moment(value).format(format);
}

export const reverseDate = dt => {
  if (!dt) return null;
  let yyyy, mm, dd, d;
  if (dt.indexOf('-') != -1) {
    yyyy = dt.substring(0, 4);
    mm = dt.substring(5, 7);
    dd = dt.substring(8, 10);
    d = dd + '/' + mm + '/' + yyyy;
  } else {
    dd = dt.substring(0, 2);
    mm = dt.substring(3, 5);
    yyyy = dt.substring(6, 10);
    d = yyyy + '-' + mm + '-' + dd;
  }
  return d;
}

export const parseDatetimeToDjango = datetime => {
  let fulldate = datetime;
  if (datetime.indexOf('/') != -1) {
    let date = datetime.split(' ')[0];
    let time = datetime.split(' ')[1];
    date = reverseDate(date);
    fulldate = `${date} ${time}`;
  }
  return moment(fulldate).format();
}