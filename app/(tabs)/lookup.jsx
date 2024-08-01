import { View, Text, SafeAreaView, TextInput, FlatList, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, Image, Touchable, Keyboard } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'

import * as globals from '../../config/globals.js'
import { Colours } from '../../constants'
import { Icons } from '../../constants/index.js'

import { router, useLocalSearchParams } from 'expo-router';

import { SideMenu } from '../../components'
import SelectDropdown from 'react-native-select-dropdown'

import PinyinTones from 'pinyin-tone'
import { debounce } from 'lodash';

function isAlphanumeric(str) {
  const alphanumericRegex = /^[a-z0-9]+$/i;

  return alphanumericRegex.test(str)
}

const Lookup = () => {

  const { editorQuery } = useLocalSearchParams();

  const [searchQuery, setSearchQuery] = useState("")
  const [searchMode, setSearchMode] = useState("CH")
  const [searchResults, setSearchResults] = useState("")
  
  const searchDepthOptions = ["start with", "contain"]
  const [searchDepth, setSearchDepth] = useState(0)

  useEffect(() => {
    search(searchQuery);
  }, [searchDepth, searchMode])

  const matchInQuery = (arrDefinitions, exactQuery) => {
    for (let item of arrDefinitions) {
      if (item.split(" ").includes(exactQuery)) {
        return true
      }
    }
    return false
  }

  const sortChiResults = (retrievedResults, exactQuery) => {
    const arrayWithExactMatches = []
    const arrayWithoutExactMatches = []
    
    const arraySortedByLength = JSON.parse(JSON.stringify(retrievedResults));
    arraySortedByLength.sort((a, b) => b.simplified.length - a.simplified.length)
    
    const longestEntry = arraySortedByLength[0].simplified.length
    
    for (let i=0; i < longestEntry; i++) {
      const filteredResultsLength = retrievedResults.filter(res => res.simplified.length == i+1)
      arrayWithExactMatches.push(...filteredResultsLength.filter(res => 
        res.traditional.toLowerCase().startsWith(exactQuery) ||
        res.simplified.toLowerCase().startsWith(exactQuery) ||
        res.pinyin.replace("[", "").replace("]", "").replace(/[0-9]/g, '').split(" ").includes(exactQuery) // includes the EXACT pinyin word (e.g. 'lan' will return pinyin results with the 'lan' pinyin word)
      ))
      arrayWithoutExactMatches.push(...filteredResultsLength.filter(res => 
        res.traditional.toLowerCase().includes(exactQuery) ||
        res.simplified.toLowerCase().includes(exactQuery) ||
        (res.pinyin.replace("[", "").replace("]", "").replace(/[0-9]/g, '').split(" ").join("").includes(exactQuery) && !res.pinyin.replace("[", "").replace("]", "").replace(/[0-9]/g, '').split(" ").includes(exactQuery)) // includes CLOSE MATCHES of the pinyin word (e.g. 'lan' could return pinyin results with 'lan', but also 'lang')
      ))
    }
    
    return arrayWithExactMatches.concat(arrayWithoutExactMatches)
  }

  const sortEngResults = (retrievedResults, exactQuery) => {
    const arrayWithExactMatches = []
    const arrayWithCloseMatches = []
    const arrayWithoutExactMatches = []

    const arraySortedByLength = JSON.parse(JSON.stringify(retrievedResults));
    arraySortedByLength.sort((a, b) => b.simplified.length - a.simplified.length)

    const longestEntry = arraySortedByLength[0].simplified.length

    for (let i=0; i < longestEntry; i++) {
      const filteredResultsLength = retrievedResults.filter(res => res.simplified.length == i+1)
      arrayWithExactMatches.push(...filteredResultsLength.filter(res => res.definitions.map(w => w.toLowerCase()).includes(exactQuery)))
      arrayWithCloseMatches.push(...filteredResultsLength.filter(res => matchInQuery(res.definitions.map(w => w.toLowerCase()), exactQuery)))
      arrayWithoutExactMatches.push(...filteredResultsLength.filter(res => !res.definitions.map(w => w.toLowerCase()).includes(exactQuery) && !matchInQuery(res.definitions.map(w => w.toLowerCase()), exactQuery)))
    }

    return arrayWithExactMatches.concat(arrayWithCloseMatches.concat(arrayWithoutExactMatches))
  }
  
  const search = (query) => {
    query = query.split(" ").join("").toLowerCase() // removing spaces from user's query

    setSearchQuery(query); // prompting re-render

    query = query.toLowerCase().trim();
    if (query) {
      if (searchMode == "CH") {
        if (searchDepthOptions[searchDepth] == "start with") {
          const filterResults = globals.dictionary.filter(entry => 
            entry.traditional.toLowerCase().startsWith(query) || 
            entry.simplified.toLowerCase().startsWith(query) || 
            entry.pinyin.toLowerCase().replace("[", "").replace("]", "").replace(/[0-9]/g, '').split(" ").join("").startsWith(query) // replace square brackets [], any numbers, and any spaces in between the pinyin entries
          )
          
          if (filterResults.length != 0) {
            setSearchResults(sortChiResults(filterResults, query))

          } else {
            setSearchResults(["No results found."])
          }
        } else if (searchDepthOptions[searchDepth] == "contain") {
          const filterResults = globals.dictionary.filter(entry => 
            entry.traditional.toLowerCase().includes(query) || 
            entry.simplified.toLowerCase().includes(query) || 
            entry.pinyin.toLowerCase().replace("[", "").replace("]", "").replace(/[0-9]/g, '').split(" ").join("").includes(query)
          )

          if (filterResults.length != 0) {
            setSearchResults(sortChiResults(filterResults, query))
          } else {
            setSearchResults(["No results found."])
          }
        }
      }
      else if (searchMode == "EN") {
        if (isAlphanumeric(query.split(" ").join(""))) {
          const filterResults = globals.dictionary.filter(entry =>
            entry.definitions.join("\n").toLowerCase().includes(query)
          )
          
          if (filterResults.length != 0) {
            setSearchResults(sortEngResults(filterResults, query))
          } else {
            setSearchResults(["No results found."])
          }
        }
        else {
          setSearchResults(["You're on the English mode right now; try searching for English words."])
        }
      }
    }
  }

  const debouncedSearch = useCallback(
    debounce(search, 180), [],
  );

  useEffect(() => {
    if (editorQuery && globals.dictionary) {
      search(editorQuery)
    }
  }, [editorQuery])

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
            autoCapitalize='none'
            autoCorrect={false}
            className="px-[10px] rounded-lg font-qnormal"
            style={{flex: 1, fontSize: 20, color: Colours[globals.theme]["text"]}}
            placeholder='Search'
            placeholderTextColor={Colours[globals.theme]["gray"]}
            allowFontScaling={false}
            onChangeText={(txt) => {debouncedSearch(txt)}}
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
          onScrollBeginDrag={() => {Keyboard.dismiss()}}
          contentContainerStyle={{flexGrow: 1}}
          ListHeaderComponent={<View style={{height: 8}} />}
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
                <TouchableOpacity 
                  className="flexGrow-1 my-[2px]"
                  onPress={() => {router.push('/entry?entryInfo=' + JSON.stringify(entry.item))}}
                >
                  <View className="flexGrow-1 py-[3px]" style={{borderBottomWidth: 1, borderColor:"black"}}>
                    <Text numberOfLines={1} className={'bg-transparent px-3 font-bold'} style={{ fontSize: 23, color: Colours[globals.theme]["text"] }} allowFontScaling={false}>
                      {entry.item.simplified}<Text className="font-normal">{(entry.item.simplified == entry.item.traditional ? "" : " [" + entry.item.traditional + "]")} {PinyinTones(entry.item.pinyin.replace("[", "").replace("]", ""))}</Text>
                    </Text>
                    <Text numberOfLines={1} className={'bg-transparent px-3 font-normal mt-[1px] mb-[3px]'}>{entry.item.definitions.join(" / ")}</Text>
                  </View>
                </TouchableOpacity>
              )}
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
                        setSearchDepth(index); // and prompting rerender
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