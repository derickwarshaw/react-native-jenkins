import React, { PropTypes } from 'react';
import { View, Text, ListView, TouchableHighlight, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { applicationStyles, metrics, colors } from '../../themes';
import { load as loadBuild } from '../../redux/modules/build';
import AlertMessage from '../../components/AlertMessageComponent';

class BuildList extends React.Component {

  static propTypes = {
    loadBuild: PropTypes.func,
    dataObjects: PropTypes.array,
    build: PropTypes.object,
    selectedJob: PropTypes.number,
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
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillMount() {
    const rowHasChanged = (r1, r2) => r1 !== r2;
    const ds = new ListView.DataSource({ rowHasChanged });
    const builds = this.props.dataObjects || [];
    this.state = {
      dataSource: ds.cloneWithRows(builds)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataObjects) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.dataObjects)
      });
    }
  }

  viewBuild(number) {
    const { loadBuild, selectedJob, navigation: { navigate } } = this.props;
    loadBuild(selectedJob, number).then(() => navigate('Build'));
  }

  renderRow({ number, timestamp, result }) {
    const { row, boldLabel, label } = BuildList.styles;
    return (
      <TouchableHighlight onPress={() => this.viewBuild(number)}>
        <View style={row}>
          <Text style={boldLabel}>{number}</Text>
          <Text style={boldLabel}>{timestamp}</Text>
          <Text style={label}>{result}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  noRowData() {
    return this.state.dataSource.getRowCount() === 0;
  }

  render() {
    const { props: { build: { loading } }, state: { dataSource } } = this;
    const { indicatorContainer, indicator, container, listContent } = BuildList.styles;
    const spinner = (
      <View style={indicatorContainer}>
        <ActivityIndicator animating size={'large'} color={'white'} style={indicator} />
      </View>
    );

    return loading ? spinner : (
      <View style={container}>
        <AlertMessage title='Nothing to See Here, Move Along' show={this.noRowData()} />
        <ListView
          contentContainerStyle={listContent}
          dataSource={dataSource}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ builds: { data, selectedJob }, build }) => ({
  dataObjects: data,
  selectedJob,
  build
});

const mapDispatchToProps = dispatch => ({
  loadBuild: (selectedJob, buildNumber) => dispatch(loadBuild(selectedJob, buildNumber))
});

export default connect(mapStateToProps, mapDispatchToProps)(BuildList);
