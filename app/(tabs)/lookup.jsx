import { View, Text, SafeAreaView, TextInput, FlatList, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native'
import React, { useState, useEffect } from 'react'

import * as globals from '../../config/globals.js'
import { Colours } from '../../constants'
import { Icons } from '../../constants/index.js'

import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system';

import { SideMenu } from '../../components'
import SelectDropdown from 'react-native-select-dropdown'

function isAlphanumeric(str) {
  const alphanumericRegex = /^[a-z0-9]+$/i;

  return alphanumericRegex.test(str)
}

const Lookup = () => {
  const [searchQuery, setSearchQuery] = useState("")
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
        definitions: entries[3].trim().split("/")  //.join("\n").trim()
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
    setSearchQuery(query);
    query = query.toLowerCase().trim();
    if (query) {
      if (searchMode == "CH") {
        if (searchDepthOptions[searchDepth] == "start with") {
          setSearchResults(
            (dictionary.filter(entry =>
            entry.traditional.toLowerCase().startsWith(query) ||
            entry.simplified.toLowerCase().startsWith(query) ||
            entry.pinyin.toLowerCase().startsWith(query)).length != 0)
              ? dictionary.filter(entry =>
            entry.traditional.toLowerCase().startsWith(query) ||
            entry.simplified.toLowerCase().startsWith(query) ||
            entry.pinyin.toLowerCase().startsWith(query)).sort((a, b) => a.simplified.length - b.simplified.length)
              : ["No results found."])
        } else if (searchDepthOptions[searchDepth] == "contain") {
          setSearchResults(
            (dictionary.filter(entry =>
            entry.traditional.toLowerCase().includes(query) ||
            entry.simplified.toLowerCase().includes(query) ||
            entry.pinyin.toLowerCase().includes(query)).length != 0)
              ? dictionary.filter(entry =>
            entry.traditional.toLowerCase().includes(query) ||
            entry.simplified.toLowerCase().includes(query) ||
            entry.pinyin.toLowerCase().includes(query)).sort((a, b) => a.simplified.length - b.simplified.length)
              : ["No results found."])
        }
      }
      else if (searchMode == "EN") {
        if (isAlphanumeric(query.split(" ").join(""))) {
          setSearchResults(
            (dictionary.filter(entry =>
            entry.definitions.join("\n").toLowerCase().includes(query)).length != 0) 
              ? (dictionary.filter(entry =>
            entry.definitions.join("\n").toLowerCase().includes(query)
          ).sort((a, b) => a.simplified.length - b.simplified.length))
              : ["No results found."])
        }
        else {
          setSearchResults(["You're on the English mode right now; try searching for English words."])
        }
      }
    }
    }

  const [lookupOptionsOpen, setLookupOptionsOpen] = useState(false)
  const toggleLookupOptions = () => {
    setLookupOptionsOpen(!lookupOptionsOpen)
  }

  return (
    <SafeAreaView>
      <View className="w-full items-center justify-center flex-row h-[78px] py-3 pl-[20px] pr-[16px]" style={{backgroundColor: Colours[globals.theme]["background"]}}>
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
        <TouchableOpacity
          onPress={() => {setLookupOptionsOpen(true);}}
        >
          <Image 
            source={Icons.more}
            tintColor={Colours[globals.theme]["darkerGray"]}
            resizeMode='contain'
            className="max-h-[28px] max-w-[38px] ml-[8px]"
          />
        </TouchableOpacity>
      </View>
      <View className="min-h-full min-w-full" style={{backgroundColor: Colours[globals.theme]["darker"]}}>
        <FlatList
          scrollEnabled={true}
          contentContainerStyle={{flexGrow: 1}}
          ListHeaderComponent={<View style={{height: 10}} />}
          ListFooterComponent={<View style={{height: 168}} />}
          data={searchResults}
          keyExtractor={(item, index) => index}
          renderItem={(entry) => (
            <View className="flexGrow-1">
              {entry.item == "You're on the English mode right now; try searching for English words." || entry.item == "No results found." ? (
                <View className="flexGrow-1">
                  <Text className={'bg-transparent px-3 font-qbold'} style={{ fontSize: 22, color: Colours[globals.theme]["text"] }} allowFontScaling={false}>{entry.item}</Text>
                </View>
              ) : (
                <View className="flexGrow-1">
                  <Text className={'bg-transparent px-3 font-qbold'} style={{ fontSize: 22, color: Colours[globals.theme]["text"] }} allowFontScaling={false}>{entry.item.simplified}</Text>
                </View>
              ) }
            </View>
          )}
        />
      </View>
      <Modal
        visible={lookupOptionsOpen}
        animationType="none"
        transparent={true}
        onRequestClose={toggleLookupOptions}
      >
        <TouchableWithoutFeedback onPress={toggleLookupOptions}>
            <View className="w-full h-full justify-center items-end" style={{backgroundColor: "#00000060"}}>
              <TouchableWithoutFeedback>
                <View>
                  <SideMenu>
                    <Text className="font-qnormal text-2xl" style={{color: Colours[globals.theme]["text"]}}>Lookup Options</Text>
                    <View className="w-full h-0.5 my-3 rounded" style={{backgroundColor: Colours[globals.theme]["text"]}} />
                    <SelectDropdown
                      data={searchDepthOptions}
                      defaultValueByIndex={searchDepth}
                      onSelect={(selectedItem, index) => {
                        setSearchDepth(index);
                        setSearchQuery(searchQuery); // prompt re-render
                      }}
                      renderButton={(selectedItem, isOpened) => {
                        return (
                          <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>
                              {selectedItem}
                            </Text>
                            <Image
                              source={(isOpened ? Icons.upChevron : Icons.downChevron)}
                              tintColor={Colours[globals.theme]["gray"]}
                              resizeMode='contain'
                              className="max-h-[22px] max-w-[32px]"
                            />
                          </View>
                        )
                      }}
                      renderItem={(item, index, isSelected) => {
                        return (
                          <View style={{
                            ...styles.dropdownItemStyle,
                            ...(isSelected && { backgroundColor: '#D2D9DF' }),
                            }}>
                            <Text style={styles.dropdownButtonTxtStyle}>{item}</Text>
                          </View>
                        )
                      }}
                      showsVerticalScrollIndicator={false}
                      dropdownStyle={styles.dropdownMenuStyle}
                    />
                    <View className="my-1"></View>
                  </SideMenu>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  )
}

export default Lookup

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