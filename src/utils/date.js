import 'moment/locale/pt-br';
import moment from 'moment';

moment.locale('pt-br');

export const getBrlFormatDate = (date) => {
  return moment(date).format('DD/MM/Y HH:mm');
};

export const getDatabaseDate = (date) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
};

export const getData = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

export const getBrlDate = (date) => {
  return moment(date).format('DD/MM/Y');
};