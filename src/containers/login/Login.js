import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { initiateLogin, init as initUser, logout } from '../../redux/modules/user';
import { load, init as initJobs } from '../../redux/modules/jobs';
import { init as initBuilds } from '../../redux/modules/builds';
import { init as initBuild } from '../../redux/modules/build';
import { init as initViews } from '../../redux/modules/views';
import { init as initHealth } from '../../redux/modules/health';
import { metrics, colors, images, applicationStyles } from '../../themes';
import ReactNative, {
  ActivityIndicator,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  LayoutAnimation,
  Switch,
  StyleSheet
} from 'react-native';

class Login extends React.Component {
  static initialState() {
    return {
      username: '',
      password: '',
      instanceName: '',
      host: '',
      port: '',
      visibleHeight: metrics.screenHeight,
      topLogo: { width: metrics.screenWidth },
      https: false
    };
  }
  static styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background
    },
    form: {
      marginLeft: metrics.baseMargin,
      marginRight: metrics.baseMargin,
      backgroundColor: colors.snow,
      borderRadius: 4
    },
    row: {
      paddingVertical: metrics.doubleBaseMargin,
      paddingHorizontal: metrics.doubleBaseMargin
    },
    rowLabel: {
      color: colors.charcoal
    },
    textInput: {
      height: 40,
      color: colors.coal
    },
    textInputReadonly: {
      height: 40,
      color: colors.steel
    },
    loginRow: {
      paddingBottom: metrics.doubleBaseMargin,
      paddingHorizontal: metrics.doubleBaseMargin,
      flexDirection: 'row'
    },
    loginButtonWrapper: {
      flex: 1
    },
    loginButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.charcoal,
      backgroundColor: colors.panther,
      padding: 6
    },
    loginText: {
      textAlign: 'center',
      color: colors.silver
    },
    topLogo: {
      alignSelf: 'center',
      resizeMode: 'contain'
    },
    toggle: {
      height: 40,
      marginTop: 10
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
    this.state = {
      username: '',
      password: '',
      instanceName: '',
      host: '',
      port: '',
      visibleHeight: metrics.screenHeight,
      topLogo: { width: metrics.screenWidth },
      https: false
    };
    this.handleChangeHttps = this.handleChangeHttps.bind(this);
    this.handleChangeInstanceName = this.handleChangeInstanceName.bind(this);
    this.handleChangeHost = this.handleChangeHost.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handlePressLogin = this.handlePressLogin.bind(this);
    this.handlePressLogout = this.handlePressLogout.bind(this);
    this.handleChangePort = this.handleChangePort.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.forceUpdate();
    if (this.props.loggingIn && !nextProps.loggingIn && nextProps.loginSuccess) {
      const initialState = Login.initialState();
      this.props.load()
        .then(() => this.setState(initialState, () => this.props.navigation.goBack(null)));
    }
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow(event) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newSize = metrics.screenHeight - event.endCoordinates.height;
    this.setState({
      visibleHeight: newSize,
      topLogo: { width: 100, height: 70 }
    });
  }

  keyboardDidHide() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      visibleHeight: metrics.screenHeight,
      topLogo: { width: metrics.screenWidth }
    });
  }

  handlePressLogin() {
    const { state: { username, password, instanceName, host, port, https }, props: { initiateLogin } } = this;
    Keyboard.dismiss();
    this.props.initiateLogin(username, password, instanceName, host, port, https);
  }

  handlePressLogout() {
    Keyboard.dismiss();
    this.props.logout();
  }

  handleChangeUsername(text) {
    this.setState({ username: text });
  }

  handleChangePassword(text) {
    this.setState({ password: text });
  }

  handleChangeInstanceName(text) {
    this.setState({ instanceName: text });
  }

  handleChangeHost(text) {
    this.setState({ host: text });
  }

  handleChangePort(text) {
    this.setState({ port: text });
  }

  handleChangeHttps(value) {
    this.setState({ https: value });
  }

  focusNextField(nextField) {
    this.refs[nextField].focus();
  }

  handleOnFocus(input) {
    // http://stackoverflow.com/a/37202868
    const scrollResponder = this.refs.scrollView.getScrollResponder();
    const nodeHandle = ReactNative.findNodeHandle(this.refs[input]);

    scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
      nodeHandle, // The TextInput node handle
      0, // The scroll view's bottom "contentInset" (default 0)
      true // Prevent negative scrolling
    );
  }

  initialize() {
    this.props.initBuild();
    this.props.initBuilds();
    this.props.initJobs();
    this.props.initViews();
    this.props.initUser();
    this.props.initHealth();
  }

  render() {
    const { props: { loggingIn, loginSuccess }, state: { username, password, instanceName, host, port, https } } = this;
    const editable = !loggingIn;
    const textInputStyle = editable ? Login.styles.textInput : Login.styles.textInputReadonly;
    const spinner = (
      <View style={Login.styles.indicatorContainer}>
        <ActivityIndicator animating size={'large'} color={'white'} style={Login.styles.indicator} />
      </View>
    );

    const button = loginSuccess ? (
      <View style={Login.styles.loginRow}>
        <TouchableOpacity
          ref="signOut"
          style={Login.styles.loginButtonWrapper}
          onPress={this.handlePressLogout}
        >
          <View style={Login.styles.loginButton}>
            <Text style={Login.styles.loginText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={Login.styles.loginRow}>
        <TouchableOpacity
          ref="signIn"
          style={Login.styles.loginButtonWrapper}
          onPress={this.handlePressLogin}
        >
          <View style={Login.styles.loginButton}>
            <Text style={Login.styles.loginText}>Log In</Text>
          </View>
        </TouchableOpacity>
      </View>
    );

    return loggingIn ? spinner : (
      <ScrollView
        ref='scrollView'
        contentContainerStyle={{ justifyContent: 'center' }}
        style={[Login.styles.container, { height: this.state.visibleHeight }]}
      >
        <Image
          source={images.logo}
          style={[Login.styles.topLogo, this.state.topLogo]}
        />
        <View style={Login.styles.form}>
          <View style={Login.styles.row}>

            <Text style={Login.styles.rowLabel}>Instance Name</Text>
            <TextInput
              ref='instanceName'
              onFocus={() => this.handleOnFocus('instanceName')}
              autoCapitalize='none'
              autoCorrect={false}
              blurOnSubmit={false}
              clearButtonMode='while-editing'
              style={textInputStyle}
              value={instanceName}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              onChangeText={this.handleChangeInstanceName}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.focusNextField('host')}
              placeholder='Instance Name'
            />
          </View>

          <View style={Login.styles.row}>
            <Text style={Login.styles.rowLabel}>Host</Text>
            <TextInput
              ref='host'
              onFocus={() => this.handleOnFocus('host')}
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
              clearButtonMode='while-editing'
              style={textInputStyle}
              value={host}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              onChangeText={this.handleChangeHost}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.focusNextField('port')}
              placeholder='Host'
            />
          </View>

          <View style={Login.styles.row}>
            <Text style={Login.styles.rowLabel}>Port</Text>
            <TextInput
              ref='port'
              onFocus={() => this.handleOnFocus('host')}
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
              clearButtonMode='while-editing'
              style={textInputStyle}
              value={port}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              onChangeText={this.handleChangePort}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.focusNextField('username')}
              placeholder='Port'
            />
          </View>

          <View style={Login.styles.row}>
            <Text style={Login.styles.rowLabel}>Username</Text>
            <TextInput
              ref='username'
              onFocus={() => this.handleOnFocus('username')}
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
              clearButtonMode='while-editing'
              style={textInputStyle}
              value={username}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              onChangeText={this.handleChangeUsername}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.focusNextField('password')}
              placeholder='Username'
            />
          </View>

          <View style={Login.styles.row}>
            <Text style={Login.styles.rowLabel}>Password</Text>
            <TextInput
              ref='password'
              onFocus={() => this.handleOnFocus('signIn')}
              autoCapitalize='none'
              clearButtonMode='while-editing'
              autoCorrect={false}
              style={textInputStyle}
              value={password}
              editable={editable}
              keyboardType='default'
              returnKeyType='done'
              secureTextEntry
              onChangeText={this.handleChangePassword}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.handlePressLogin}
              placeholder='Password'
            />
          </View>

          <View style={Login.styles.row}>
            <Text style={Login.styles.rowLabel}>HTTPS</Text>
            <Switch
              style={Login.styles.toggle}
              onValueChange={this.handleChangeHttps}
              value={https}
            />
          </View>

          {button}

        </View>
      </ScrollView>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func,
  loggingIn: PropTypes.bool,
  initiateLogin: PropTypes.func,
  initUser: PropTypes.func,
  initBuild: PropTypes.func,
  initBuilds: PropTypes.func,
  initJobs: PropTypes.func,
  initHealth: PropTypes.func,
  initViews: PropTypes.func,
  load: PropTypes.func,
  loginFail: PropTypes.bool,
  loginSuccess: PropTypes.bool,
  logout: PropTypes.func
};

const mapStateToProps = ({ user: { loggingIn, username, data, loginSuccess, fail } }) => ({
  loggingIn,
  username,
  jobs: data,
  loginSuccess,
  loginFail: fail
});

const mapDispatchToProps = dispatch => ({
  initiateLogin: (username, password, instanceName, host, port, https) => dispatch(initiateLogin(username, password, instanceName, host, port, https)),
  load: () => dispatch(load()),
  logout: () => dispatch(logout()),
  initBuilds: () => dispatch(initBuilds()),
  initBuild: () => dispatch(initBuild()),
  initHealth: () => dispatch(initHealth()),
  initJobs: () => dispatch(initJobs()),
  initViews: () => dispatch(initViews()),
  initUser: () => dispatch(initUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
