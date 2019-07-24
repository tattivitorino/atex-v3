import React, { Component } from 'react';
import { View, RefreshControl, AsyncStorage, NetInfo, Platform } from 'react-native';
import { Container, Content, Card, Text } from 'native-base';
import BaseHeader from '../../../components/baseHeader';
import NotificationsCard from '../../../components/notificationsCard';
import AtendimentosCard from '../../../components/atendimentosCard';
import FileUploadsCard from '../../../components/fileUploadsCard';

import { formatConn } from '../../../utils';

import { connect } from 'react-redux';
import {
  fetchNotificationsRequest,
  fetchAtendimentosRequest,
  fetchDcadRequest,
  fetchProfissoesRequest,
  fetchComboListRequest,
  fetchDocumentoTiposRequest,
  fetchDocumentosPendentesRequest
} from '../../../store/actions';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connInfo: null,
    }
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      NetInfo.getConnectionInfo().then(connInfo => {
        //console.log('GETCONNINFO FUNCTION: ', connInfo)
        this.setState({ connInfo })
      });
    }

    NetInfo.addEventListener('connectionChange', this._handleConnectionChange);

    this._fetchItems()
    this._fetchData()
  }

  _handleConnectionChange = connInfo => {
    //console.log('EVENT HANDLER: ', connInfo)
    this.setState({ connInfo })
    if (connInfo.type === 'wifi') {

    }
  }

  _fetchData() {
    //this.props.fetchDcadRequest('nacionalidade')
    //this.props.fetchDcadRequest('estado-civil')
    //this.props.fetchProfissoesRequest()
    this.props.fetchComboListRequest()
  }

  _fetchItems = () => {
    const { fetchNotificationsRequest, fetchAtendimentosRequest, fetchDocumentosPendentesRequest, fetchDocumentoTiposRequest } = this.props;
    fetchNotificationsRequest({ page: 1 });
    fetchAtendimentosRequest({ page: 1 });
    fetchDocumentoTiposRequest();
    fetchDocumentosPendentesRequest();
  }

  render() {
    const { navigation } = this.props;
    return (
      <Container>
        <BaseHeader showLogout navigation={navigation} title="Dashboard" />
        <Content contentContainerStyle={{ paddingVertical: 15 }} refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={this.fetchItems} />
        }>

          {this.state.connInfo && <Card style={{ padding: 16, marginBottom: 16 }}>
            <Text>Conexão: {formatConn(this.state.connInfo)}</Text>
          </Card>}

          <FileUploadsCard
            navigation={navigation}
            type="fileUploads"
            headerTitle="Documentos Pendentes de Envio" />

          <NotificationsCard
            navigation={navigation}
            type="notifications"
            headerTitle="Notificações"
            footerTitle="Ver Notificações" />

          <AtendimentosCard
            navigation={navigation}
            type="atendimentos"
            headerTitle="Próximos Atendimentos"
            footerTitle="Ver Atendimentos" />

        </Content>
      </Container >
    );
  }
}

const mapStateToProps = state => {
  const { fetching } = state.notifications;
  return { fetching };
}

export default connect(mapStateToProps, {
  fetchNotificationsRequest,
  fetchAtendimentosRequest,
  fetchDcadRequest,
  fetchProfissoesRequest,
  fetchComboListRequest,
  fetchDocumentoTiposRequest,
  fetchDocumentosPendentesRequest
})(Dashboard);


