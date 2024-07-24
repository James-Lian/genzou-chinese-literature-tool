import { View, Text, Button, Animated, ScrollView, Image, TouchableOpacity, TextInput, TouchableWithoutFeedback } from 'react-native'
import React, { useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import * as globals from '../../config/globals.js'
import DynamicHeader from '../../components/DynamicHeader.js'
import { Icons } from '../../constants/index.js'
import { StatusBar } from 'expo-status-bar'

const Editor = () => {
  let scrollOffsetY = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView className="flex-1 items-center h-full" style={{backgroundColor: Colours[globals.theme]["background"]}}>
      <View className="w-full flex-row justify-center items-center max-h-[48px] px-3">
        <View className="flex-1 justify-center">
          <View className="flex-row justify-start items-center gap-[3px]">
            <TouchableOpacity>
              <Image 
                source={Icons.minusSquare}
                tintColor={Colours[globals.theme]["darkerGray"]}
                resizeMode='contain'
                className="ml-[8px] max-h-[28px] max-w-[38px]"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image 
                source={Icons.plusSquare}
                tintColor={Colours[globals.theme]["darkerGray"]}
                resizeMode='contain'
                className="max-h-[28px] max-w-[38px]"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 justify-center">
          <View className="flex-row justify-end items-center gap-[12px]">
            <TouchableOpacity>
              <Image 
                source={Icons.download}
                tintColor={Colours[globals.theme]["darkerGray"]}
                resizeMode='contain'
                className="max-h-[28px] max-w-[38px]"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image 
                source={Icons.camera}
                tintColor={Colours[globals.theme]["darkerGray"]}
                resizeMode='contain'
                className="max-h-[28px] max-w-[38px]"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image 
                source={Icons.more}
                tintColor={Colours[globals.theme]["darkerGray"]}
                resizeMode='contain'
                className="max-h-[28px] max-w-[38px]"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-1 w-full px-2">
        <ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffsetY}}}],
            {useNativeDriver: false}
          )}
          className="rounded-lg w-full"
          style={{backgroundColor: Colours[globals.theme]["darker"]}}
        >
            <TextInput 
              className={`bg-transparent p-3 font-qnormal`}
              style={{ fontSize: globals.editorTextSize }}
              placeholder="Enter Chinese text here... "
              placeholderTextColor={Colours[globals.theme]["gray"]}
              multiline={true}
              textAlignVertical={true}
              allowFontScaling={false}
            />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Editor