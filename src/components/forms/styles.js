import { StyleSheet } from 'react-native';
import material from '../../../native-base-theme/variables/material';
import { general, typografy } from '../../styles';

export default StyleSheet.create({
  ...general,
  ...typografy,
  card: {
    padding: 15,
  },
  fieldsContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20
  },
  field: {
    marginBottom: 15
  },
  hint: {
    fontSize: 13,
    alignSelf: 'flex-start',
  },
  fieldErrorMessage: {
    color: material.brandDanger,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 13,
    marginTop: 10
  },
  buttonsBar: {
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  button: {
    marginVertical: 15,
    justifyContent: 'center'
  },
  errorMessageContainer: {
    marginVertical: 15,
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 10,
    backgroundColor: material.brandDanger,
    borderRadius: 10
  },
  errorMessage: {
    color: '#fff',
    textAlign: 'center'
  }
})