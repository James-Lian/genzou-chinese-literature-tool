import { View, Text, ScrollView, Dimensions } from 'react-native'
import React from 'react'

import * as globals from '../config/globals.js'

import { Colours } from '../constants'
import { Icons } from "../constants"

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SideMenu = ({ children }) => {
    const insets = useSafeAreaInsets();
    const windowWidth = Dimensions.get('window').width

    return (
        <View className={`h-full justify-start items-start shadow-lg border-l-1`} style={{backgroundColor: Colours[globals.theme]["background"], borderColor: "#D3D3D3", paddingTop:insets.top, minWidth: windowWidth * 3 / 5}}>
            <ScrollView className="pl-[20px] py-[8px]" style={{minWidth: windowWidth * 3 / 5 - 20}}>
                {children}
            </ScrollView>
        </View>
    )
}

export default SideMenu