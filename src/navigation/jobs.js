import React from 'react';
import { StyleSheet, StatusBar, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import JobList from '../containers/jobs/JobList';
import BuildList from '../containers/builds/BuildList';
import Build from '../containers/build/Build';

const JobsNavigator = StackNavigator(
  {
    JobList: {
      screen: JobList,
      navigationOptions: {
        title: 'Job List'
      }
    },
    BuildList: {
      screen: BuildList,
      navigationOptions: {
        title: 'Build List'
      }
    },
    Build: {
      screen: Build,
      navigationOptions: {
        title: 'Build'
      }
    }
  }
);

export default () => <JobsNavigator />;
