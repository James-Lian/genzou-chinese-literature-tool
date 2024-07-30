import { View, Text, SafeAreaView, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'

import * as globals from '../../config/globals.js'
import { Colours } from '../../constants'
import { Icons } from '../../constants/index.js'

import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system';


const Lookup = () => {
  const [searchMode, setSearchMode] = useState("CH")
  const [searchResults, setSearchResults] = useState("")
  
  const searchDepthOptions = ["start with", "contain"]
  const [searchDepth, setSearchDepth] = useState(0)
  
  const [dictionary, setDictionary] = useState("")
  
  const readFile = async () => {
    const { localUri } = await Asset.fromModule(require("../../assets/files/cedict_ts.txt")).downloadAsync();
  
    let dict = await FileSystem.readAsStringAsync(localUri)
    dict = dict.split('\n').filter(line => line && !line.startsWith("#")).map(line => {
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
    setDictionary(dict)
  }

  useEffect(() => {
    const fetchDict = async () => {
      await readFile()
    }
    fetchDict()
  }, [])
  
  const search = (query) => {
    query = query.toLowerCase();
    if (searchMode == "CH") {
      setSearchResults(dictionary.filter(entry =>
        entry.traditional.toLowerCase().startsWith(query) ||
        entry.simplified.toLowerCase().startsWith(query) ||
        entry.pinyin.toLowerCase().startsWith(query)
      ))
      console.log(dictionary.filter(entry =>
        entry.traditional.toLowerCase().startsWith(query) ||
        entry.simplified.toLowerCase().startsWith(query) ||
        entry.pinyin.toLowerCase().startsWith(query)
      ))
    }
    else if (searchMode == "EN") {
      setSearchResults(dictionary.filter(entry =>
        entry.definitions.toLowerCase().includes(query)
      ))
    }
  }

  return (
    <SafeAreaView>
      <View className="w-full items-center justify-center flex-row h-[78px] py-3 px-[20px]" style={{backgroundColor: Colours[globals.theme]["background"]}}>
        <View
          className="my-[6px] rounded-lg mr-2 justify-center"
          style={{flex:1, backgroundColor:Colours[globals.theme]["darker"]}}
        >
          <TextInput
            className="px-[10px] rounded-lg font-qnormal"
            style={{flex: 1, fontSize: 20, color: Colours[globals.theme]["text"]}}
            placeholder='Search'
            placeholderTextColor={Colours[globals.theme]["gray"]}
            allowFontScaling={false}
            onChangeText={(txt) => {search(txt)}}
            clearButtonMode='always'
          />
        </View>
        <TouchableOpacity 
          className="rounded-lg ml-1"
          style={{borderWidth: 2, borderColor: Colours[globals.theme]["indigo"], backgroundColor: Colours[globals.theme]["indigo"]}}
          onPress={() => {(searchMode == "CH") ? setSearchMode("EN") : setSearchMode("CH")}}
        >
          <Text className="font-qbold px-[6px] py-[3px] text-lg" style={{color:"white"}}>{searchMode}</Text>
        </TouchableOpacity>
      </View>
      <View className="min-h-full min-w-full" style={{backgroundColor: Colours[globals.theme]["darker"]}}>
        <FlatList
          scrollEnabled={true}
          contentContainerStyle={{flexGrow: 1}}
          ListFooterComponent={<View style={{height: 30}} />}
          data={searchResults}
          keyExtractor={(item, index) => index}
          renderItem={(item, index) => (
            <View className="flexGrow-1">
              <Text className={'bg-transparent px-3 font-qbold'} style={{ fontSize: 22, color: Colours[globals.theme]["text"] }} allowFontScaling={false}>{item.item.simplified}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

export default Lookup