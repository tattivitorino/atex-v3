import material from '../../native-base-theme/variables/material';
import { Platform } from 'react-native';

/**
 * .bg-gradient-primary{
 *  background:linear-gradient(87deg,#c33764,#c34437)!important
 * }
 * .bg-gradient-atexmob{
 *  background:linear-gradient(87deg,#1dacd6,#1d5fd6)!important
 * }
 * 
 */

const general = {
  container: {
    flex: 1
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shadow: {
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: .1,
    shadowRadius: 1.2,
    //elevation: 3
  },
  border: {
    borderColor: '#000',
    borderWidth: 1,
  },
  greyBorderBottom: {
    borderBottomColor: '#ededed',
    borderBottomWidth: 1
  },
  greyBorderTop: {
    borderTopColor: '#ededed',
    borderTopWidth: 1
  },
  segmentTransparent: {
    backgroundColor: 'transparent'
  },
  segmentHolder: {
    height: 50,
    paddingHorizontal: 5,
    ...Platform.select({
      android: {
        //backgroundColor: Platform.Version <= 21 ? material.toolbarDefaultBg : '#326edb',
        backgroundColor: material.toolbarDefaultBg
      },
      ios: {
        backgroundColor: material.toolbarDefaultBg
      }
    })
  },
  segmentButton: {
    flex: 1,
    height: 45,
    borderWidth: 0,
    borderRadius: 0,
    justifyContent: 'center',
    borderBottomColor: 'transparent',
    borderBottomWidth: 3,
  },
  segmentButtonIcon: {
    fontSize: 28,
    color: '#fff'
  },
  segmentButtonActive: {
    borderBottomColor: '#fff',
    borderBottomWidth: 3,
  },
  cardList: {
    padding: 10
  },
  cardListItem: {},
  cardListItemIcon: {
    fontSize: 30, marginHorizontal: 10
  },
  fabPrimary: {
    backgroundColor: material.brandPrimary,
    shadowColor: material.brandLight
  },
  fabSecondary: {
    backgroundColor: material.brandSecondary,
    shadowColor: material.brandLight
  },
  documentItemIcon: {
    color: material.brandSecondary,
    fontSize: 50
  }
}

export default general;