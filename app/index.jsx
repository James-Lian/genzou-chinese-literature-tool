// onboarding screen

import { StatusBar } from 'expo-status-bar';
import { Text, View, useColorScheme, ScrollView, Image } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as globals from '../config/globals.js'

import { Colours } from '../constants'
import { Icons } from "../constants"

import { WelcomeButton } from '../components'

export default function App() {
  // globals.theme = "dark"; // testing out dark theme

  return (
    <SafeAreaView className="flex-1 items-center h-full" style={{backgroundColor: Colours[globals.theme]["background"]}}>
      <Text className="text-3xl font-qbold mt-12 px-8 text-center" style={{color: Colours[globals.theme]["text"]}}>Welcome to Genzou!</Text>
      <Text className="text-3xl font-qbold mt-2 px-8 text-center" style={{color: Colours[globals.theme]["text"]}}>(跟走)</Text>
      <Text className="text-1xl font-qbolditalics mt-2 mb-8 px-8 text-center" style={{color: Colours[globals.theme]["gray"]}}>follow along and say goodbye to textbook B.S. {'<'}3 </Text>

      <ScrollView className="rounded-lg pt-3 shadow-inner" style={{backgroundColor: Colours[globals.theme]["darker"]}}>
        <Text className="text-[18px] font-qitalic my-2 px-6" style={{color: Colours[globals.theme]["text"]}}>Discover our features... </Text>

        <View className="flex-1 m-2 h-full p-4 rounded-lg shadow" style={{backgroundColor: Colours[globals.theme]["background"]}}>
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
              
      <View className="w-full items-center px-3">
        <WelcomeButton
          title="< Enter >"
          handlePress={() => router.replace('/editor')}
          containerStyles="w-full mt-8"
          textStyles="text-2xl text-center"
        />
      </View>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}