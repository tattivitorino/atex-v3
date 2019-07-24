import axios from 'axios';
import { onlyNumbers } from '../utils';

/**
 * 
 * @param {string} cep 
 * @return {object} data
 * {"cep":"05019-000","logradouro":"Rua Diana","complemento":"","bairro":"Perdizes","localidade":"São Paulo","uf":"SP","unidade":"","ibge":"3550308","gia":"1004"}
 */
export const fetchAddressByCep = cep => {
  cep = onlyNumbers(cep);
  const url = `https://viacep.com.br/ws/${cep}/json/`;
  console.log(url);
  return axios.get(url)
    .then(res => {
      //console.log('DATA: ', JSON.stringify(res));
      if (res.data && res.data.erro) {
        return Promise.reject();
      }
      return Promise.resolve(res.data)
    })
    .catch(err => {
      //console.log('ERRO: ', JSON.stringify(err));
      return Promise.reject('Verifique seu CEP!');
    })
}