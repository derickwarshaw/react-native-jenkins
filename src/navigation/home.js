import React from 'react';
import { StyleSheet, StatusBar, Text } from 'react-native';
import { TabNavigator } from 'react-navigation';

import Home from '../containers/home/Home';
import JobNavigator from './jobs';
import Login from '../containers/login/Login';

const styles = StyleSheet.create({
  navBar: {
    height: 50,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#DADBDE',
    justifyContent: 'space-around',
    backgroundColor: 'black'
  },
  label: {
    fontSize: 10.5,
    marginTop: 2,
    marginBottom: 4
  },
  icon: {
    marginTop: 8,
    fontSize: 20
  }
});

const HomeNavigator = TabNavigator(
  {
    Home: { screen: Home },
    Login: { screen: Login },
    JobList: { screen: JobNavigator }
  },
  {
    swipeEnabled: false,
    animationEnabled: true,
    tabBarPosition: 'bottom',
    initialRouteName: 'Home',
    lazyLoad: false,
    tabBarOptions: {
      activeTintColor: 'red',
      inactiveTintColor: 'white',
      labelStyle: styles.label,
      style: styles.navBar
    }
  }
);

export default () => <HomeNavigator />;
