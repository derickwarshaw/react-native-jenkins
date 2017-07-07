import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { metrics, colors, fonts } from '../themes';

const buttonStyles = {
  RoundedButtonStyles: StyleSheet.create({
    button: {
      height: 45,
      borderRadius: 5,
      marginHorizontal: metrics.section,
      marginVertical: metrics.baseMargin,
      backgroundColor: colors.fire,
      justifyContent: 'center'
    },
    buttonText: {
      color: colors.snow,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: fonts.size.medium,
      marginVertical: metrics.baseMargin
    }
  }),
  DrawerButtonStyles: StyleSheet.create({
    button:{},
    buttonText: {
      ...fonts.style.h5,
      color: colors.snow,
      marginVertical: metrics.baseMargin
    }
  }),
  FullButtonStyles: StyleSheet.create({
    button: {
      marginVertical: 5,
      borderTopColor: colors.fire,
      borderBottomColor: colors.bloodOrange,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      backgroundColor: colors.ember
    },
    buttonText: {
      margin: 18,
      textAlign: 'center',
      color: colors.snow,
      fontSize: fonts.size.medium,
      fontFamily: fonts.bold
    }
  })
};

const Button = (props) => {
  const getComponentProperties = () => {
    switch (props.buttonType) {
      case 'RoundedButton':
        return {
          styles: buttonStyles.RoundedButtonStyles,
          text: (props.text || props.children.toString()).toUpperCase()
        };
      case 'DrawerButton':
        return {
          styles: buttonStyles.DrawerButtonStyles,
          text: (props.text || props.children.toString())
        };
      case 'FullButton':
        return {
          styles: buttonStyles.FullButtonStyles,
          text: (props.text || props.children.toString()).toUpperCase()
        };
      default:
        return {
          styles: {},
          text: {}
        };
    }
  };

  const { styles, text } = getComponentProperties();

  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

Button.PropTypes = {
  text: React.PropTypes.string,
  onPress: React.PropTypes.func.isRequired,
  children: React.PropTypes.string,
  buttonType: React.PropTypes.string.isRequired
};

export default Button;
