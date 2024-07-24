import { View, Text } from 'react-native'
import React from 'react'

import * as globals from '../config/globals.js'

import { Colours } from '../constants'
import { Icons } from "../constants"

const SideMenu = ({ children }) => {
  return (
    <View className="flex-col h-full w-max-[600px] justify-start items-start shadow-lg border-l-1" style={{borderColor: "#D3D3D3"}}>
      {children}
    </View>
  )
}

export default SideMenu