import React from 'react';
import * as Animatable from 'react-native-animatable';
import { View, Text, StyleSheet } from 'react-native';
import { applicationStyles, metrics, fonts, colors } from '../themes';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginVertical: metrics.section
  },
  contentContainer: {
    alignSelf: 'center',
    alignItems: 'center'
  },
  message: {
    marginTop: metrics.baseMargin,
    marginHorizontal: metrics.baseMargin,
    textAlign: 'center',
    fontFamily: fonts.base,
    fontSize: fonts.size.regular,
    fontWeight: 'bold',
    color: colors.steel
  },
  icon: {
    color: colors.steel
  }
});

const AlertMessageComponent = (props) => {
  const { title } = props;
  const messageComponent = (
    <Animatable.View
      style={[styles.container, props.style]}
      delay={800}
      animation='bounceIn'
    >
      <View style={styles.contentContainer}>
        <Icon
          name={props.icon || 'ios-alert'}
          size={metrics.icons.large}
          style={styles.icon}
        />
        <Text allowFontScaling={false} style={styles.message}>{title && title.toUpperCase()}</Text>
      </View>
    </Animatable.View>
  );

  return props.show ? messageComponent : null;
};

AlertMessageComponent.defaultProps = {
  show: true
};

AlertMessageComponent.PropTypes = {
  title: React.PropTypes.string.isRequired,
  style: React.PropTypes.object,
  icon: React.PropTypes.string,
  show: React.PropTypes.bool
};

export default AlertMessageComponent;
