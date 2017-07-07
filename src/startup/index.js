import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';

import MainNavigator from '../navigation/home';
// fix this mess
export class Startup extends Component {
  static propTypes = {

  };

  constructor() {
    super();
  }

  componentWillMount() {

  }

  render() {
    return <MainNavigator />;
  }
}

const enhancer = connect(
  state => ({

  }),
  {

  }
);

export default enhancer(Startup);
