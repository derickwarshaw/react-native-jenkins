import React, { PropTypes } from 'react';
import { View, Text, ListView, TouchableHighlight, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { applicationStyles, metrics, colors } from '../../themes';
// import AlertMessage from '../../components/AlertMessageComponent';

class Build extends React.Component {

  static propTypes = {
    data: PropTypes.object,
    build: PropTypes.object,
    dispatch: PropTypes.func,
    navigation: PropTypes.object
  };

  static styles = StyleSheet.create({
    ...applicationStyles.screen,
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    row: {
      flex: 1,
      backgroundColor: colors.fire,
      marginVertical: metrics.smallMargin,
      justifyContent: 'center'
    },
    boldLabel: {
      fontWeight: 'bold',
      alignSelf: 'center',
      color: colors.snow,
      textAlign: 'center',
      marginBottom: metrics.smallMargin
    },
    label: {
      textAlign: 'center',
      color: colors.snow
    },
    listContent: {
      marginTop: metrics.baseMargin
    },
    indicatorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background
    },
    indicator: {
      padding: 20
    }
  });

  constructor() {
    super();
  }

  render() {
    const { loading, data } = this.props;
    console.log(Object.keys(data));
    console.log(data);
    const spinner = (
      <View style={Build.styles.indicatorContainer}>
        <ActivityIndicator animating size={'large'} color={'white'} style={Build.styles.indicator} />
      </View>
    );

    return loading ? spinner : (
      <View style={Build.styles.container}>
        <Text>Get fucked</Text>
      </View>
    );
  }
}

const mapStateToProps = ({ build: { data, loading } }) => ({
  data,
  loading
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Build);
