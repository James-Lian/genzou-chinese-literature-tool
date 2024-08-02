import { View, Text, SafeAreaView, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'

import * as globals from '../config/globals.js'
import { Colours } from '../constants'
import { Icons } from '../constants/index.js'

import { router, useLocalSearchParams, Stack, useNavigation } from 'expo-router';

import PinyinTones from 'pinyin-tone'

const BookmarkEntry = () => {

  let { entryList, title } = useLocalSearchParams()
  entryList = JSON.parse(decodeURIComponent(entryList))
  title = JSON.parse(decodeURIComponent(title))

  console.log(entryList)

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: title,
      headerRight: () => { return(
        <View className="items-center">
          <TouchableOpacity>
              <Image 
                  source={Icons.edit}
                  tintColor={Colours[globals.theme]["darkerGray"]}
                  resizeMode='contain'
                  className="max-h-[23px] max-w-[23px]"
              />
          </TouchableOpacity>
        </View>
      )}
    });
  }, [navigation])

  return (
    <SafeAreaView className="min-w-full min-h-full">
      <View className="flex-1" style={{backgroundColor: Colours[globals.theme]["darker"]}}>
        <FlatList
          scrollEnabled={true}
          contentContainerStyle={{flexGrow: 1}}
          ListHeaderComponent={<View style={{height: 8}} />}
          ListFooterComponent={<View style={{height: 168}} />}
          data={entryList}
          keyExtractor={(item) => {item.item}}
          renderItem={(entry) => (
            <View className="flexGrow-1">
              <TouchableOpacity 
                className="flexGrow-1 my-[2px]"
                onPress={() => {router.push('/entry?entryInfo=' + encodeURIComponent(JSON.stringify(globals.returnMatchingEntries(entry.item))))}}
              >
                <View className="flexGrow-1 py-[3px]" style={{borderBottomWidth: 1, borderColor: Colours[globals.theme]["text"]}}>
                  <Text numberOfLines={1} className={'bg-transparent px-3 font-bold'} style={{ fontSize: 23, color: Colours[globals.theme]["text"] }} allowFontScaling={false}>
                    {/* {entry.item.simplified}<Text className="font-normal">{(entry.item.simplified == entry.item.traditional ? "" : " [" + entry.item.traditional + "]")} {PinyinTones(entry.item.pinyin.replace("[", "").replace("]", ""))}</Text> */}
                    {entry.item}
                  </Text>
                  {/* <Text numberOfLines={1} className={'bg-transparent px-3 font-normal mt-[1px] mb-[3px]'}>{entry.item.definitions.join(" / ")}</Text> */}
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

export default BookmarkEntry