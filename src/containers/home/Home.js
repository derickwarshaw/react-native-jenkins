import React, { PropTypes } from 'react';
import  images  from '../../assets/images';
import { StyleSheet, ScrollView, Text, Image, View } from 'react-native';
import { connect } from 'react-redux';
import { load as loadJobs } from '../../redux/modules/jobs';
import { applicationStyles, metrics } from '../../themes';

class Home extends React.Component {

  static propTypes = {
    login: PropTypes.func,
    username: PropTypes.string,
    instanceName: PropTypes.string,
    host: PropTypes.string,
    jobList: PropTypes.func,
    loadJobs: PropTypes.func,
    port: PropTypes.string,
    path: PropTypes.string,
    navigation: PropTypes.object

  };

  static styles = StyleSheet.create({
    ...applicationStyles.screen,
    logo: {
      height: metrics.images.logo,
      width: metrics.images.logo,
      resizeMode: 'contain'
    },
    centered: {
      alignItems: 'center'
    }
  });

  constructor() {
    super();
    this.viewInstanceJobs = this.viewInstanceJobs.bind(this);
  }

  viewInstanceJobs() {
    const { loadJobs, navigation: { navigate } } = this.props;
    loadJobs().then(() => navigate('BuildList'));
  }

  render() {
    const { instanceName } = this.props;
    const { mainContainer, backgroundImage, container, centered, logo, section, sectionText } = Home.styles;

    return (
      <View style={mainContainer}>
        <Image source={images.background} style={backgroundImage} resizeMode='stretch' />
        <ScrollView style={container}>
          <View style={centered}>
            <Image source={images.clearLogo} style={logo} />
          </View>

          <View style={section}>
            <Text style={sectionText}>
              Your Jenkins Instances
            </Text>
            <View>
              <Text style={sectionText} onPress={this.viewInstanceJobs}>
                {instanceName}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ user: { username, instanceName, host, port, path } }) => ({
  username,
  instanceName,
  host,
  port,
  path
});

const mapDispatchToProps = dispatch => ({
  loadJobs: () => dispatch(loadJobs())
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
