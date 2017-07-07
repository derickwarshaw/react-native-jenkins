import React, { PropTypes } from 'react';
import { View, Text, ListView, TouchableHighlight, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { load as loadJobs } from '../../redux/modules/jobs';
import { load as loadBuilds } from '../../redux/modules/builds';
import { applicationStyles, metrics, colors } from '../../themes';
import AlertMessage from '../../components/AlertMessageComponent';

class JobList extends React.Component {
  static propTypes = {
    jobs: PropTypes.object,
    builds: PropTypes.object,
    buildList: PropTypes.func,
    dispatch: PropTypes.func,
    loadJobs: PropTypes.func,
    loadBuilds: PropTypes.func,
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
    const jobs = this.props.dataObjects || [];
    this.state = {
      dataSource: ds.cloneWithRows(jobs)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataObjects) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.dataObjects)
      });
    }
  }

  loadJob(name) {
    const { loadBuilds, navigation: { navigate } } = this.props;
    loadBuilds(name).then(() => navigate('BuildList'));
  }

  renderRow({ name, color }) {
    const { row, boldLabel, label } = JobList.styles;
    return (
      <TouchableHighlight onPress={() => this.loadJob(name)}>
        <View style={row}>
          <Text style={boldLabel}>{name}</Text>
          <Text style={label}>{color}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  noRowData() {
    return this.state.dataSource.getRowCount() === 0;
  }

  render() {
    const { props: { builds: { loading } }, state: { dataSource } } = this;
    const { indicatorContainer, indicator, container, listContent } = JobList.styles;
    const noRowData = this.noRowData();
    const spinner = (
      <View style={indicatorContainer}>
        <ActivityIndicator animating size={'large'} color={'white'} style={indicator} />
      </View>
    );

    return loading ? spinner : (
      <View style={container}>
        <AlertMessage title='No Job List To Display' show={noRowData} />
        <ListView
          contentContainerStyle={listContent}
          dataSource={dataSource}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ jobs: { data }, jobs, builds }) => ({
  jobs: jobs || [],
  dataObjects: data || [],
  builds: builds || []
});

const mapDispatchToProps = dispatch => ({
  loadJobs: () => dispatch(loadJobs()),
  loadBuilds: name => dispatch(loadBuilds(name))
});

export default connect(mapStateToProps, mapDispatchToProps)(JobList);
