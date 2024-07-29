import { View, Text, SafeAreaView, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'

import * as globals from '../../config/globals.js'
import { Colours } from '../../constants'

import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system';

const readFile = async () => {
  const { localUri } = await Asset.fromModule(require("../../assets/files/cedict_ts.txt")).downloadAsync();

  const dict = await FileSystem.readAsStringAsync(localUri)
  return dict
}

const Lookup = () => {
  const [searchMode, setSearchMode] = useState("CH")

  let dictionary = ""
  
  useEffect(() => {
    const fetchDict = async () => {
      dictionary = await readFile()
      dictionary = dictionary.split('\n').filter(line => line && !line.startsWith("#")).map(line => {
        line = line.trim()

        let entries = []

        let buildingEntry = ""
        let withinTerm = false
        for (let i = 0; i < line.length; i++) {
          if (line[i] === "[" || (line[i] === "/" && i != line.length - 1)) {
            withinTerm = true
          } else if (line[i] === "]") {
            withinTerm = false
          }

          if (line[i] === " " && withinTerm === false) {
            entries.push(buildingEntry)
            buildingEntry = ""
          }
          else {
            buildingEntry += line[i]
          }
        }
        entries.push(buildingEntry)
        return {
          traditional: entries[0].trim(),
          simplified: entries[1].trim(),
          pinyin: entries[2].trim(),
          definitions: entries[3].split("/").join("\n").trim()
        }
      })
    }

    fetchDict()
  }, [])

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