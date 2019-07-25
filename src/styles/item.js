import material from '../../native-base-theme/variables/material';

const item = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: material.listBorderColor,
    paddingVertical: 10
  },
  first: {
    paddingTop: 0
  },
  last: {
    borderBottomWidth: 0,
    paddingBottom: 0
  },
  children: {
    padding: 5,
    flex: 0,
    justifyContent: 'center'
  },
  left: {
    alignItems: 'center',
    width: '20%'
  },
  right: {
    alignItems: 'flex-end',
  },
  middle: {
    alignItems: 'flex-start',
    width: '65%',
  },
  buttonIcon: {
    fontSize: 30,
    marginHorizontal: 10
  },
  iconSuccess: {
    color: material.brandSuccess
  },
  iconPrimary: {
    color: material.brandPrimary
  },
  iconDanger: {
    color: material.brandDanger
  },
  iconDisabled: {
    color: material.btnDisabledBg
  }
}

export default item;