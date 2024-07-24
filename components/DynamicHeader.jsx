import { View, Text, StyleSheet, Animated } from 'react-native';
import React from 'react';

import * as globals from '../config/globals.js'

const DynamicHeader = ({styleClass, minHeaderHeight, maxHeaderHeight, animHeaderValue, children}) => {
    const animateHeaderHeight = animHeaderValue.interpolate({
        inputRange: [0, maxHeaderHeight-minHeaderHeight],
        outputRange: [maxHeaderHeight, minHeaderHeight],
        extrapolate: 'clamp'
    })

    return (
        <Animated.View
            className='items-center'
            style={[
                styles.header, 
                {
                    height: animateHeaderHeight,
                    width: '100%',
                    backgroundColor: Colours[globals.theme]["darker"]
                }
            ]}
        >
            {children}
        </Animated.View>
  )
}

const styles = StyleSheet.create({
    header:{
        justifyContent: 'center',
        width: 'full'
    }
})

export default DynamicHeader