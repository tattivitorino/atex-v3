import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['JAN', 'FEV.', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL.', 'AUG', 'SET.', 'OUT', 'NOV', 'DEC'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']
};

LocaleConfig.defaultLocale = 'pt-br';

export const agendaConfig = LocaleConfig;