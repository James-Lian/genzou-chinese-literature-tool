import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, Keyboard, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router';

import * as globals from '../config/globals.js'
import { Colours } from '../constants'
import { Icons } from '../constants/index.js'

import * as Speech from 'expo-speech';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import * as Clipboard from 'expo-clipboard';

import PinyinTones from 'pinyin-tone'
import { exists, use } from 'i18next';
import { copy } from 'superagent';

const Entry = () => {
  
  let { entryInfo } = useLocalSearchParams() // Change to array-compatible
  entryInfo = JSON.parse(decodeURIComponent(entryInfo))
  
  const [existsInStorage, setExistsInStorage] = useState(false)
  
  useEffect(() => {
    const retrieveStorageStates = async () => {
      setExistsInStorage(await globals.bookmarkExists(entryInfo[0].simplified, "Uncategorized"))
    }
    retrieveStorageStates()
  }, [])

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
  
  const copyToClipboard = async (txt) => {
    await Clipboard.setStringAsync(txt)
    let toast = Toast.show('Copied!', { hideOnPress: true, duration: 1200, position: Toast.positions.BOTTOM, backgroundColor: Colours[globals.theme]["opposite"] , shadowColor: Colours[globals.theme]["darkerGray"] })
  }

  return (
    <RootSiblingParent>
      <SafeAreaView>
        <FlatList
          className="w-full h-full p-3 my-1"
          scrollEnabled={true}
          contentContainerStyle={{flexGrow: 1}}
          ListHeaderComponent={<View style={{height: 8}} />}
          ListFooterComponent={<View style={{height: 168}} />}
          data={entryInfo}
          keyExtractor={(item) => {entryInfo.indexOf(item)}}
          renderItem={(entry) => (
            <View className="flexGrow-1 mb-[20px]">
              <View className="flex-row justify-center">
              <Text selectable={true} className="font-bold text-3xl flex-1" style={{height: 43, color: Colours[globals.theme]["text"]}}>{entry.item.simplified}
                <Text selectable={true} className="font-normal" style={{color: Colours[globals.theme]["lighterOpposite"]}}> {entry.item.simplified == entry.item.traditional ? "" : ('[' + entry.item.traditional + ']')}</Text>
              </Text>
              <TouchableOpacity
                onPress={() => {copyToClipboard(entry.item.simplified + " [" + entry.item.traditional + "]")}}
                className="pt-1"
                style={{height: 32}}
              >
                <Image 
                  source={Icons.copy}
                  tintColor={Colours[globals.theme]["darkerGray"]}
                  resizeMode='contain'
                  className="max-h-[28px] max-w-[38px] mt-[2px]"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  const bmExists = await globals.bookmarkExists(entry.item.simplified, "Uncategorized")
                  if (globals.dictEntryExists(entry.item.simplified) && !bmExists) {
                    globals.setBookmark(entry.item.simplified, "Uncategorized")
                    setExistsInStorage(true)
                  }
                }}
                disabled={existsInStorage}
                className="pt-1"
                style={{height: 32}}
              >
                <Image 
                  source={Icons.plus}
                  tintColor={existsInStorage ? Colours[globals.theme]["lighterGray"] : Colours[globals.theme]["darkerGray"]}
                  resizeMode='contain'
                  className="max-h-[32px] max-w-[38px]"
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row gap-[3px]" style={{height: 42}}>
              <Text selectable={true} className="py-[2px] px-[1px] font-bold text-lg" style={{color: Colours[globals.theme]["text"], fontSize: 20}}>{PinyinTones(entry.item.pinyin.replace("[", "").replace("]", ""))}</Text>
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
              {entry.item.definitions.map((elem, ind) => String(ind+1) + "\t" + String(elem)).join("\n")}</Text>
            </View>
          )}

        />
        <ScrollView className="w-full h-full p-3 my-1">
          
        </ScrollView>
      </SafeAreaView>
    </RootSiblingParent>
  )
}

export default Entry