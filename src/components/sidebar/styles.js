import { StyleSheet, Dimensions, Platform } from 'react-native';
import material from '../../../native-base-theme/variables/material';
import { general } from '../../styles';

const { width, height } = Dimensions.get('window');
const sidebarWidth = width * 0.8;

const borderColor = '#ededed';
const backgroundColor = '#f4f4f4'

export default StyleSheet.create({
    ...general,
    drawerHeader: {
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: Platform.OS === 'ios' ? material.toolbarDefaultBg : material.toolbarDefaultBg,
        height: height * 0.2,
        paddingBottom: 10,
        borderBottomColor: borderColor,
        borderBottomWidth: 1,
    },
    drawerContent: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingVertical: 15
    },
    drawerFooter: {
        flexDirection: 'column',
        backgroundColor: material.toolbarDefaultBg,
        borderTopColor: borderColor,
        borderTopWidth: 1,
        paddingHorizontal: 10,
        ...Platform.select({
            android: {
                //backgroundColor: Platform.Version <= 21 ? material.toolbarDefaultBg : 'transparent'
                backgroundColor: material.toolbarDefaultBg
            }
        })
    },
    textHeader: {
        color: '#fff',
    },
    textFooter: {
        color: '#fff',
    },
    textContent: {}
});