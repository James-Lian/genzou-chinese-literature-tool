import { View, Text, Button, Animated, ScrollView, Image, TouchableOpacity } from 'react-native'
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
      <ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY}}}],
          {useNativeDriver: false}
        )}
        className="min-h-full rounded-lg"
        style={{backgroundColor: Colours[globals.theme]["darker"]}}
      >
      <View className="flex-1 m-2 h-full p-4 rounded-lg shadow" style={{backgroundColor: "white"}}>
          <View className="flex-row my-1 items-start">
            <View className="items-center w-fit h-fit self-start max-h-[48px] rounded-lg" style={{backgroundColor: Colours[globals.theme]["indigo"]}}>
              <Image
                source={Icons.camera}
                className="min-w-[23px] max-h-[23px] w-full m-3"
                style={{tintColor: "white"}}
                resizeMode="contain"
              />
            </View>
            <Text className="ml-2 text-[16px] font-qbold mt-2.5" style={{color: Colours[globals.theme]["text"]}}> {'>'}  Scan Chinese text with your camera </Text>
          </View>
        </View>

        <View className="flex-1 m-2 h-full p-4 rounded-lg shadow" style={{backgroundColor: "white"}}>
          <View className="flex-row my-1 items-start">
            <View className="items-center w-fit h-fit self-start max-h-[48px] rounded-lg" style={{backgroundColor: Colours[globals.theme]["indigo"]}}>
              <Image
                source={Icons.typing}
                className="min-w-[23px] max-h-[23px] w-full m-3"
                style={{tintColor: "white"}}
                resizeMode="contain"
              />
            </View>
            <Text className="ml-2 text-[16px] font-qbold mt-2.5" style={{color: Colours[globals.theme]["text"]}}> {'>'}  Convert your textbooks to Pinyin </Text>
          </View>
        </View>

        <View className="flex-1 m-2 h-full p-4 rounded-lg shadow" style={{backgroundColor: "white"}}>
          <View className="flex-row my-1 items-start">
            <View className="items-center w-fit h-fit self-start max-h-[48px] rounded-lg" style={{backgroundColor: Colours[globals.theme]["indigo"]}}>
              <Image
                source={Icons.search}
                className="min-w-[23px] max-h-[23px] w-full m-3"
                style={{tintColor: "white"}}
                resizeMode="contain"
              />
            </View>
            <Text className="ml-2 text-[16px] font-qbold mt-2.5" style={{color: Colours[globals.theme]["text"]}}> {'>'}  Look up phrases in a dictionary </Text>
          </View>
        </View>

        <View className="flex-1 m-2 h-full p-4 rounded-lg shadow" style={{backgroundColor: "white"}}>
          <View className="flex-row my-1 items-start">
            <View className="items-center w-fit h-fit self-start max-h-[48px] rounded-lg" style={{backgroundColor: Colours[globals.theme]["indigo"]}}>
              <Image
                source={Icons.star}
                className="min-w-[23px] max-h-[23px] w-full m-3"
                style={{tintColor: "white"}}
                resizeMode="contain"
              />
            </View>
            <Text className="ml-2 text-[16px] font-qbold mt-2.5" style={{color: Colours[globals.theme]["text"]}}> {'>'}  Bookmark your favourite words </Text>
          </View>
        </View>

        <View className="flex-1 m-2 h-full p-4 rounded-lg shadow" style={{backgroundColor: "white"}}>
          <View className="flex-row my-1 items-start">
            <View className="items-center w-fit h-fit self-start max-h-[48px] rounded-lg" style={{backgroundColor: Colours[globals.theme]["indigo"]}}>
              <Image
                source={Icons.file}
                className="min-w-[23px] max-h-[23px] w-full m-3"
                style={{tintColor: "white"}}
                resizeMode="contain"
              />
            </View>
            <Text className="ml-2 text-[16px] font-qbold mt-2.5" style={{color: Colours[globals.theme]["text"]}}> {'>'}  Translate entire sentences </Text>
          </View>
        </View>

        <View className="flex-1 m-2 h-full p-4 rounded-lg shadow" style={{backgroundColor: "white"}}>
          <View className="flex-row my-1 items-start">
            <View className="items-center w-fit h-fit self-start max-h-[48px] rounded-lg" style={{backgroundColor: Colours[globals.theme]["indigo"]}}>
              <Image
                source={Icons.messageSquare}
                className="min-w-[23px] max-h-[23px] w-full m-3"
                style={{tintColor: "white"}}
                resizeMode="contain"
              />
            </View>
            <Text className="ml-2 text-[16px] font-qbold mt-2.5" style={{color: Colours[globals.theme]["text"]}}> {'>'}  Learn pronunciation with TTS </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default Editor