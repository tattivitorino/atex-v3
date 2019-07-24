import _ from 'lodash';
import { accentFold } from '../../utils';
import { createSelector } from 'reselect';

const getClientes = state => state.clientes.clienteList;
const searchText = state => state.clientes.searchText;

const getProfissaoList = state => state.clientes.profissaoList;
const searchProfissaoText = state => state.clientes.searchProfissaoText;

const getCliente = state => state.clientes.cliente;

export const filterClientesByText = createSelector(
  [searchText, getClientes],
  (searchText, clienteList) => {
    if (searchText == '' || searchText == undefined) return clienteList;
    const search = accentFold(searchText.toString());
    return clienteList.filter(item => {
      const nome = accentFold(item.nome);
      const cpf = item.cpf ? item.cpf.replace(/[^\d]+/g, '') : ''
      const celular = item.celular.replace(/[^\d]+/g, '')
      return nome.indexOf(search) !== -1
        || cpf.indexOf(search) !== -1
        || celular.indexOf(search) !== -1;
    })
  }
)

export const filterProfissoesByText = createSelector(
  [searchProfissaoText, getProfissaoList],
  (searchProfissaoText, profissaoList) => {
    if (searchProfissaoText === ''
      || searchProfissaoText === undefined
      || searchProfissaoText.length < 4) return [];
    const search = accentFold(searchProfissaoText.toString());
    return profissaoList.filter(item => {
      const nome = accentFold(item.nome);
      return nome.indexOf(search) !== -1;
    })

  }
)

export const getProfissaoById = createSelector(
  [getCliente, getProfissaoList],
  (cliente, profissaoList) => {
    if (!profissaoList || !profissaoList.length) return [];
    const pid = cliente.profissao;
    if (!pid) return [];
    return _.find(profissaoList, { id: pid }) || [];
  }
)