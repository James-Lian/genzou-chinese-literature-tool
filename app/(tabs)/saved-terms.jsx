import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'

import * as globals from '../../config/globals.js'
import { Colours } from '../../constants'
import { Icons } from '../../constants/index.js'

import { router, useLocalSearchParams } from 'expo-router';
import emitter from '../../components/EventEmitter.js'

const SavedTerms = () => {
  const [folders, setFolders] = useState([])

  const [editing, setEditing] = useState(false)
  const [selectedFolders, setSelectedFolders] = useState([])

  const folderSelected = (folder) => {
    if (selectedFolders.includes(folder)) {
      const index = selectedFolders.indexOf(folder);
      let copyOfSelected = [...selectedFolders];
      copyOfSelected.splice(index, 1);
      setSelectedFolders(copyOfSelected);
    } else {
      let copyOfSelected = [...selectedFolders];
      copyOfSelected.push(folder);
      setSelectedFolders(copyOfSelected);
    }
  }

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

    emitter.on('bookmarksChanged', retrieveFolders);

    return () => {
      emitter.off('bookmarksChanged', retrieveFolders)
    }
  }, [])

  const createNewFolder = () => {
    Alert.prompt(
      "Create a new folder", 
      "Give your folder a unique name", 
      [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onPress: async (folderName) => {
            if (await globals.createBookmarkFolder(folderName) === false) {
              Alert.alert("Error", "That folder name already exists")
            } else {
              emitter.emit('bookmarksChanged')
            }
          }
        }
      ],
      "plain-text"
    )
  }

  useEffect(() => {}, [])

  const combineFolders = async () => {
    Alert.prompt(
      "Create a new folder", 
      "Give your folder a unique name", 
      [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onPress: async (folderName) => {
            if (await globals.createBookmarkFolder(folderName) === false) {
              Alert.alert("Error", "That folder name already exists")
            } else {
              emitter.emit('bookmarksChanged')
            }
          }
        }
      ],
      "plain-text"
    )
  }

  return (
    <SafeAreaView className="min-h-full min-w-full">
      {!editing ? (
        <View className="w-full justify-center items-center flex-row h-[58px] py-3 pl-[20px] pr-[16px]" style={{backgroundColor: Colours[globals.theme]["background"]}}>
          <TouchableOpacity
            onPress={createNewFolder}
          >
            <Image 
              source={Icons.folderNew}
              tintColor={Colours[globals.theme]["darkerGray"]}
              resizeMode='contain'
              className="max-h-[28px] max-w-[28px]"
            />
          </TouchableOpacity>
          <Text className="text-lg text-center font-qbold flex-1">Bookmarks</Text>
          <TouchableOpacity
            onPress={() => {
              setEditing(true);
            }}
          >
            <Image 
              source={Icons.edit}
              tintColor={Colours[globals.theme]["darkerGray"]}
              resizeMode='contain'
              className="max-h-[28px] max-w-[28px]"
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="w-full justify-center items-center flex-row h-[58px] py-3 pl-[20px] pr-[16px]" style={{backgroundColor: Colours[globals.theme]["background"]}}>
          <TouchableOpacity
            onPress={async () => {
              await globals.deleteBookmarkFolders(selectedFolders)
              setEditing(false);
              setSelectedFolders([])
              emitter.emit('bookmarksChanged')
            }}
          >
            <Text className="text-lg font-qbold" style={{color: Colours[globals.theme]["darkGray"]}}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="items-center flex-1"
            onPress={() => {
              Alert.prompt(
                "Create a new folder", 
                "Give your folder a unique name", 
                [
                  {
                    text: "Cancel",
                  },
                  {
                    text: "OK",
                    onPress: async (folderName) => {
                      await globals.combineBookmarkFolders(selectedFolders, folderName)
                      setEditing(false);
                      setSelectedFolders([])        
                      emitter.emit('bookmarksChanged')
                    }
                  }
                ],
                "plain-text"
              )
            }}
          >
            <Text className="text-lg font-qbold" style={{color: Colours[globals.theme]["darkGray"]}}>Combine</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {setEditing(false)}}
          >
            <Text className="text-lg font-qbold" style={{color: Colours[globals.theme]["darkGray"]}}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      <View className="flex-1" style={{ backgroundColor: Colours[globals.theme]["darker"] }}>
        <FlatList
          scrollEnabled={true}
          contentContainerStyle={{flexGrow: 1}}
          ListHeaderComponent={<View style={{height: 8}} />}
          ListFooterComponent={<View style={{height: 168}} />}
          data={folders}
          keyExtractor = {(item) => {item.item}}
          renderItem={(item) => (
            <View className="flexGrow-1">
              {item.item == null ? (
                <View className="p-[12px]">
                  <Text className="text-lg">No bookmarks saved.</Text>
                </View>
              ) : (
                <TouchableOpacity 
                  className="flexGrow-1 my-[2px]"
                  onPress={() => {
                    router.push(
                      "/bookmark-entries?title=" + 
                      encodeURIComponent(Object.keys(item.item)[0])
                    )
                  }}
                  disabled={editing}
                >
                  <View className="flex-row py-[12px] px-[20px]" style={{borderBottomWidth: 1, borderColor: Colours[globals.theme]["text"]}}>
                    {editing &&
                      <TouchableOpacity 
                        className="min-h-[28px] max-h-[28px] min-w-[48px] max-w-[48px] mr-3"
                        onPress={() => {folderSelected(Object.keys(item.item)[0])} }
                      >
                        <Image
                          source={(selectedFolders.includes(Object.keys(item.item)[0])) ? Icons.checkCircle : Icons.circle}
                          tintColor={Colours[globals.theme]["darkerGray"]}
                          resizeMode='contain'
                          className="max-h-[28px] max-w-[28px]"
                        />
                      </TouchableOpacity>
                    }
                    <Image
                      source={Icons.folder}
                      tintColor={(Object.keys(item.item)[0] == "Uncategorized") ? Colours[globals.theme]["indigo"] : Colours[globals.theme]["darkerGray"]}
                      resizeMode='contain'
                      className="max-h-[28px] max-w-[28px]"
                    />
                    <Text numberOfLines={1} className={'bg-transparent px-3 font-qnormal flex-1'} style={{ fontSize: 20, color: Colours[globals.theme]["text"] }} allowFontScaling={false}>
                      {Object.keys(item.item)[0]}
                    </Text>
                    <Text numberOfLines={1} allowFontScaling={false} className={'bg-transparent px-3 font-qnormal'} style={{ fontSize: 20, color: Colours[globals.theme]["text"] }}>{Object.values(item.item)[0].length}</Text>
                    
                    <Image
                      source={Icons.rightChevron}
                      tintColor={Colours[globals.theme]["darkerGray"]}
                      resizeMode='contain'
                      className="max-h-[28px] max-w-[28px]"
                    />
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