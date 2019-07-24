import { StyleSheet } from 'react-native';
import material from '../../../native-base-theme/variables/material';
import { typografy } from '../../styles';

const styles = StyleSheet.create({
  ...typografy,
  container: {
    flex: 1
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    padding: 10,
    marginTop: 17
  },
  emptyDate: {
    backgroundColor: 'white',
    borderRadius: 5,
    height: 15,
    flex: 1,
    padding: 5,
    marginTop: 17,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyData: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 20,
    marginTop: 17,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start'
  },
  textLarge: {
    fontSize: 18
  },
  textLarger: {
    fontSize: 20
  }
});

export default styles;