import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, Keyboard, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router';

import * as globals from '../config/globals.js'
import { Colours } from '../constants'
import { Icons } from '../constants/index.js'

import * as Speech from 'expo-speech';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';

import PinyinTones from 'pinyin-tone'

const Entry = () => {
  let { entryInfo } = useLocalSearchParams() // Change to array-compatible

  entryInfo = JSON.parse(entryInfo)

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const onKeyboardShow = (event) => {
    setKeyboardHeight(event.endCoordinates.height);
  }

  const onKeyboardHide = () => {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    const onShow = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    const onHide = Keyboard.addListener('keyboardDidHide', onKeyboardHide);

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  let [speaking, setSpeaking] = useState(false);
  const toggleSpeaking = () => {
    if (speaking) {
      setSpeaking(false)
      Speech.stop()
    }
    else {
      setSpeaking(true)
      let toast = Toast.show('Ensure silent mode is off on your device to use TTS.', { hideOnPress: true, duration: 1200, position: Dimensions.get('window').height - 180 - Math.max((keyboardHeight - 100), 0), backgroundColor: Colours[globals.theme]["opposite"] , shadowColor: Colours[globals.theme]["darkerGray"] })
      
      Speech.speak(entryInfo.simplified, {language:globals.voices[globals.currVoice], onDone:() => setSpeaking(false)})
    }
  }

  return (
    <RootSiblingParent>
      <SafeAreaView>
        <ScrollView className="w-full h-full p-3 my-1">
          <View className="flex-row justify-center">
            <Text selectable={true} className="font-bold text-3xl flex-1" style={{height: 43, color: Colours[globals.theme]["text"]}}>{entryInfo.simplified}
              <Text selectable={true} className="font-normal" style={{color: Colours[globals.theme]["lighterOpposite"]}}> {entryInfo.simplified == entryInfo.traditional ? "" : ('[' + entryInfo.traditional + ']')}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {}}
              className="pt-1"
              style={{height: 32}}
            >
              <Image 
                source={Icons.plus}
                tintColor={Colours[globals.theme]["darkerGray"]}
                resizeMode='contain'
                className="max-h-[32px] max-w-[38px]"
              />
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-[3px]" style={{height: 42}}>
            <Text selectable={true} className="py-[2px] px-[1px] font-bold text-lg" style={{color: Colours[globals.theme]["text"]}}>{PinyinTones(entryInfo.pinyin.replace("[", "").replace("]", ""))}</Text>
            <TouchableOpacity
              onPress={() => {toggleSpeaking()}}
              className="justify-center"
            >
              <Image 
                source={Icons.volume}
                tintColor={Colours[globals.theme]["darkerGray"]}
                resizeMode='contain'
                className="max-h-[20px] max-w-[38px]"
              />
            </TouchableOpacity>
          </View>
          <View className="w-full h-[2px] rounded-lg mb-2" style={{backgroundColor: Colours[globals.theme]["text"]}}></View>
          <Text selectable={true} className="text-lg">
            {entryInfo.definitions.map((elem, ind) => String(ind+1) + "\t" + String(elem)).join("\n")}</Text>
        </ScrollView>
      </SafeAreaView>
    </RootSiblingParent>
  )
}

export default Entry