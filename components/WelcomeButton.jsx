import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

import * as globals from '../config/globals.js'
import { Colours } from '../constants'

const WelcomeButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8} 
        className={`mx-3 px-3 rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`} style={{backgroundColor: Colours[globals.theme]["indigo"]}}
        disabled={isLoading}
    >
        <Text className={`font-qbold ${textStyles}`} style={{color: Colours[globals.theme]["background"]}}> 
            {title} 
        </Text>
    </TouchableOpacity>
  )
}

export default WelcomeButton