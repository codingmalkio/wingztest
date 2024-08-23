import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

const Button = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={[styles.buttonContainerStyle, { backgroundColor: props.backgroundColor ? props.backgroundColor : '#222' }]}>
        <Text style={{color: props.color || '#fff'}}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainerStyle: {
    padding: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default Button;