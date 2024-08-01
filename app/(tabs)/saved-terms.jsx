import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'

import * as globals from '../../config/globals.js'
import { Colours } from '../../constants'
import { Icons } from '../../constants/index.js'

import { router, useLocalSearchParams } from 'expo-router';

const SavedTerms = () => {
  const [folders, setFolders] = useState([])

  const [selectedFolders, setSelectedFolders] = useState([])

  const retrieveFolders = async () => {
    const bookmarkFolders = await globals.getData("bookmarks")
    if (bookmarkFolders) {
      console.log("Retrieved folder: ", Object.entries(bookmarkFolders).map(([k,v]) => ({[k]: v})))
      setFolders(
        Object.entries(bookmarkFolders).map(([k,v]) => ({[k]: v}))
      )
    }
  }

  useEffect(() => {
    retrieveFolders()
  }, [])

  const storeFolders = async () => {
    globals.storeData(folders, "bookmarks")
  }

  return (
    <SafeAreaView>
      <FlatList
        scrollEnabled={true}
        contentContainerStyle={{flexGrow: 1}}
        ListHeaderComponent={<View style={{height: 8}} />}
        ListFooterComponent={<View style={{height: 168}} />}
        data={folders}
        keyExtractor = {(item) => {item}}
        renderItem={(item) => {
          <View className="flexGrow-1">
            <TouchableOpacity 
              className="flexGrow-1 my-[2px]"
              onPress={() => {router.push("/bookmark-entries?entryList=" + JSON.stringify(folders[item]))}}
            >
              <View className="flexGrow-1 py-[3px]" style={{borderBottomWidth: 1, borderColor: Colours[globals.theme]["text"]}}>
                <Text numberOfLines={1} className={'bg-transparent px-3 font-bold'} style={{ fontSize: 23, color: Colours[globals.theme]["text"] }} allowFontScaling={false}>
                  {Object.keys(item)[0]}
                </Text>
                <Text numberOfLines={1} className={'bg-transparent px-3 font-normal mt-[1px] mb-[3px]'}>{entry.item.definitions.join(" / ")}</Text>
              </View>
            </TouchableOpacity>
          </View>
          // console.log(item);
        }}
      />
      <Text>SavedTerms</Text>
    </SafeAreaView>
  )
}

export default SavedTerms