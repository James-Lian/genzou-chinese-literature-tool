import { View, Text, Button, SafeAreaView, Switch, ScrollView, StyleSheet, Image, Alert, Linking } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

import * as globals from '../../config/globals.js'
import { Colours } from '../../constants/index.js'
import { Images } from '../../constants/index.js'
import { Icons } from '../../constants/index.js'

import emitter from '../../components/EventEmitter.js'

const More = () => {
  return (
    <SafeAreaView>
      <ScrollView className="h-full w-full">
        <View className="mb-3">
          <Text className="font-qbold text-2xl mt-8 mb-3 px-3">Notes</Text>
          <View className="py-2" style={{borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colours[globals.theme]["text"]}}>
            <Text className="text-xl px-3 font-qbold mb-[2px]">Permissions required:</Text>
            <Text className="text-xl px-3 font-qnormal">Storage, camera, photo library</Text>
          </View>
          <View className="py-2" style={{borderTopWidth: 0, borderBottomWidth: 1, borderColor: Colours[globals.theme]["text"]}}>
            <Text className="text-xl px-3 font-qbold mb-[2px]">Error: TooManyRequests (API error)</Text>
            <Text className="text-xl px-3 font-qnormal">Unfortunately, the translation API has limits that are hard to bypass. It's fine though - Genzou was never meant to really be a translation app. I suggest using a better translator app instead, like Google Translate.</Text>
          </View>
        </View>
        <View className="mb-3">
          <Text className="font-qbold text-2xl mt-8 mb-3 px-3">Credits</Text>
          <View className="py-2" style={{borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colours[globals.theme]["text"]}}>
            <Text className="text-xl px-3 font-qbold mb-[2px]">Development</Text>
            <Text className="text-xl px-3 font-qnormal">Created by James Lian using React Native and Expo.</Text>
          </View>
          <View className="py-2" style={{borderTopWidth: 0, borderBottomWidth: 1, borderColor: Colours[globals.theme]["text"]}}>
            <Text className="text-xl px-3 font-qbold mb-[2px]">Lexicon</Text>
            <Text className="text-xl px-3 font-qnormal">Dictionary data comes from CC-CEDICT, provided on <Text className="text-blue-600" onPress={() => {Linking.openURL("https://www.mdbg.net/chinese/dictionary?page=cedict")}}>mdbg.net</Text>.</Text>
          </View>
          <View className="py-2" style={{borderTopWidth: 0, borderBottomWidth: 1, borderColor: Colours[globals.theme]["text"]}}>
            <Text className="text-xl px-3 font-qbold mb-[2px]">Images & Icons</Text>
            <Text className="text-xl px-3 font-qnormal">Icons used are from <Text className="text-blue-600" onPress={() => {Linking.openURL("https://feathericons.com/")}}>Feather Icons</Text>.</Text>
            <Text className="text-xl px-3 font-qnormal">Logos and splash screen were adapted from fonts on <Text className="text-blue-600" onPress={() => {Linking.openURL("https://chinese.gratis/tools/chinesecalligraphy/")}}>Chinese.gratis</Text>.</Text>
          </View>
          <View className="py-2" style={{borderTopWidth: 0, borderBottomWidth: 1, borderColor: Colours[globals.theme]["text"]}}>
            <Text className="text-xl px-3 font-qbold mb-[2px]">Other</Text>
            <Text className="text-xl px-3 font-qnormal">Special thanks to Hack Club's Cider program, which was what inspired the development of this application.</Text>
            <Text className="text-xl px-3 font-qnormal">Find this project on <Text className="text-blue-600" onPress={() => {Linking.openURL("https://github.com/James-Lian/genzou-chinese-literature-tool")}}>Github</Text>.</Text>
          </View>
        </View>
        <Button onPress={() => router.replace('/')} className="text-2xl font-qnormal mt-3 text-center" style={{color: 'blue'}} title='< Go Home >' />
        <Button onPress={() => 
          {
            Alert.alert('Deleting Data', 'Are you sure you want to clear all data? This includes your bookmarks.', [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {text: 'OK', onPress: async () => {
                globals.clearAllData()
                emitter.emit('bookmarksChanged')
              }},
            ]);
          }}
          className="text-2xl font-qnormal mt-3 text-center" style={{color: 'blue'}} title='< Clear All Data >'
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default More

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: Colours[globals.theme]["darker"],
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: Colours[globals.theme]["text"],
  },
  dropdownMenuStyle: {
    backgroundColor: Colours[globals.theme]["background"],
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: Colours[globals.theme]["text"],
  },
});