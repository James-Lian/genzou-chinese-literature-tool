import { View, Text, Button, Animated, ScrollView, Image } from 'react-native'
import React, { useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import * as globals from '../../config/globals.js'
import DynamicHeader from '../../components/DynamicHeader.js'
import { Icons } from '../../constants/index.js'

const Editor = () => {
  let scrollOffsetY = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView className="flex-1 items-center h-full" style={{backgroundColor: Colours[globals.theme]["background"]}}>
      <DynamicHeader
        styleClass={""}
        minHeaderHeight={0}
        maxHeaderHeight={80}
        animHeaderValue={scrollOffsetY}
      >
        <View className="w-full">
          <Text className="w-full text-center" style={{color: Colours[globals.theme]["text"]}}>This is a header.</Text>
        </View>
      </DynamicHeader>
      <ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY}}}],
          {useNativeDriver: false}
        )}
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