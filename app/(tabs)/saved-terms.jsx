import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native'
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
      setFolders(
        Object.entries(bookmarkFolders).map(([k,v]) => ({[k]: v}))
      )
    } else {
      setFolders([null])
    }
  }

  useEffect(() => {
    retrieveFolders()
  }, [])

  const storeFolders = async () => {
    globals.storeData(folders, "bookmarks")
  }

  return (
    <SafeAreaView className="min-h-full min-w-full">
      <View className="w-full justify-center items-center flex-row h-[58px] py-3 pl-[20px] pr-[16px]" style={{backgroundColor: Colours[globals.theme]["background"]}}>
        <TouchableOpacity>
          <Image 
            source={Icons.folderNew}
            tintColor={Colours[globals.theme]["darkerGray"]}
            resizeMode='contain'
            className="max-h-[28px] max-w-[28px]"
          />
        </TouchableOpacity>
        <Text className="text-lg text-center font-qbold flex-1">Bookmarks</Text>
        <TouchableOpacity>
          <Image 
            source={Icons.edit}
            tintColor={Colours[globals.theme]["darkerGray"]}
            resizeMode='contain'
            className="max-h-[28px] max-w-[28px]"
          />
        </TouchableOpacity>
      </View>
      <View className="flex-1" style={{ backgroundColor: Colours[globals.theme]["darker"] }}>
        <FlatList
          scrollEnabled={true}
          contentContainerStyle={{flexGrow: 1}}
          ListHeaderComponent={<View style={{height: 8}} />}
          ListFooterComponent={<View style={{height: 168}} />}
          data={folders}
          keyExtractor = {(item) => {item ? Object.keys(item)[0] : 'No booksmarks saved.'}}
          renderItem={(item) => (
            <View className="flexGrow-1">
              {item.item == null ? (
                <View className="p-[12px]">
                  <Text className="text-lg">No bookmarks saved.</Text>
                </View>
              ) : (
                <TouchableOpacity 
                  className="flexGrow-1 my-[2px]"
                  onPress={() => {router.push("/bookmark-entries?entryList=" + JSON.stringify(folders[item]))}}
                >
                  <View className="flex-row py-[10px] px-[20px]" style={{borderBottomWidth: 1, borderColor: Colours[globals.theme]["text"]}}>
                    {}
                    <Image
                      source={Icons.folder}
                      tintColor={(Object.keys(item.item)[0] == "Uncategorized") ? Colours[globals.theme]["indigo"] : Colours[globals.theme]["darkerGray"]}
                      resizeMode='contain'
                      className="max-h-[28px] max-w-[28px]"
                    />
                    <Text numberOfLines={1} className={'bg-transparent px-3 font-qnormal'} style={{ fontSize: 20, color: Colours[globals.theme]["text"] }} allowFontScaling={false}>
                      {Object.keys(item.item)[0]}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

export default SavedTerms