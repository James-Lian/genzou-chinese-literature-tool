import { View, Text, SafeAreaView, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

import Cedict from 'cedict-lookup';

import * as globals from '../../config/globals.js'
import { Colours } from '../../constants'

const Lookup = () => {
  const [searchMode, setSearchMode] = useState("CH")
  
  var dict = Cedict.loadSimplified().getMatch('你好')

  console.log(dict)

  return (
    <SafeAreaView>
      <View className="w-full items-center justify-center flex-row h-[78px] py-3 px-[20px]" style={{backgroundColor: Colours[globals.theme]["background"]}}>
        <TextInput
          className="p-[10px] rounded-lg mr-3 font-qnormal"
          style={{flex: 1, backgroundColor: Colours[globals.theme]["darker"], fontSize: 16, color: Colours[globals.theme]["text"]}}
          placeholder='Search'
          placeholderTextColor={Colours[globals.theme]["gray"]}
          allowFontScaling={false}
        />
        <TouchableOpacity
          onPress={() => {(searchMode == "CH") ? setSearchMode("EN") : setSearchMode("CH")}}
        >
          <Text className="font-qbold px-[6px] py-[3px] rounded-lg text-lg ml-1" style={{color: Colours[globals.theme]["indigo"], borderColor: Colours[globals.theme]["indigo"], borderWidth: 2, borderRadius: 3}}>{searchMode}</Text>
        </TouchableOpacity>
      </View>
      <View className="min-h-full min-w-full" style={{backgroundColor: Colours[globals.theme]["darker"]}}>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
        />
      </View>
    </SafeAreaView>
  )
}

export default Lookup