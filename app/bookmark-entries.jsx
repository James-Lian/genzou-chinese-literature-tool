import { View, Text, SafeAreaView, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'

import * as globals from '../config/globals.js'
import { Colours } from '../constants'
import { Icons } from '../constants/index.js'

import { router, useLocalSearchParams, Stack, useNavigation } from 'expo-router';

import PinyinTones from 'pinyin-tone'
import emitter from '../components/EventEmitter.js'

const BookmarkEntry = () => {

  const [editing, setEditing] = useState(false);
  const toggleEditing = () => {
    setEditing(!editing);
  }

  const [selected, setSelected] = useState([]);

  const entrySelected = (entry) => {
    if (selected.includes(entry)) {
      const index = selected.indexOf(entry);
      let copyOfSelected = [...selected];
      copyOfSelected.splice(index, 1);
      setSelected(copyOfSelected);
    } else {
      let copyOfSelected = [...selected];
      copyOfSelected.push(entry);
      setSelected(copyOfSelected);
    }
  }

  let { title } = useLocalSearchParams()
  title = decodeURIComponent(title)
  const [entryList, setEntryList] = useState([]);

  const retrieveBookmarks = async () => {
    const bookmarkFolders = await globals.getData("bookmarks")
    const bookmarks = bookmarkFolders[title]
    if (bookmarks) {
      setEntryList(bookmarks.reverse())
    } else {
      setEntryList([])
    }
  }

  useEffect(() => {
    retrieveBookmarks()

    emitter.on('bookmarksChanged', retrieveBookmarks);

    return () => {
      emitter.off('bookmarksChanged', retrieveBookmarks)
    }
  }, [])

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: title,
      headerRight: () => { return(
        <View className="items-center">
          <TouchableOpacity
            className='jusitfy-items-center'
            onPress={toggleEditing}
          >
            {editing ? (
              <Text className="font-qbold text-[16px]">Done</Text>
            ) : (
              <Image 
                  source={Icons.edit}
                  tintColor={Colours[globals.theme]["darkerGray"]}
                  resizeMode='contain'
                  className="max-h-[23px] max-w-[23px]"
              />
            )}
          </TouchableOpacity>
        </View>
      )}
    });
  }, [navigation, editing])

  const returnAllPinyin = (term) => {
    const matchingEntries = globals.returnMatchingEntries(term);

    let possiblePY = []
    for (let entry of matchingEntries) {
      if (entry.simplified == term || entry.traditional == term) {
        possiblePY.push(entry.pinyin.replace("[", "").replace("]", ""))
      }
    }

    return possiblePY;
  }

  const returnAllDefs = (term) => {
    const matchingEntries = globals.returnMatchingEntries(term);

    let possibleDefs = []
    for (let entry of matchingEntries) {
      if (entry.simplified == term || entry.traditional == term) {
        possibleDefs.push(entry.definitions.join(" ; "))
      }
    }

    return possibleDefs;
  }

  return (
    <SafeAreaView className="min-w-full min-h-full">
      <View className="flex-1" style={{backgroundColor: Colours[globals.theme]["darker"]}}>
        <FlatList
          scrollEnabled={true}
          contentContainerStyle={{flexGrow: 1}}
          ListHeaderComponent={<View style={{height: 8}} />}
          ListFooterComponent={<View style={{height: 168}} />}
          data={entryList}
          keyExtractor={(item) => {entryList.indexOf(item)}}
          renderItem={(entry) => (
            <View className="flex-row items-center">
              {editing &&
                <TouchableOpacity 
                  className="min-h-[28px] max-h-[28px] min-w-[48px] max-w-[48px] mr-2 ml-8"
                  onPress={() => {entrySelected(entry.item)} }
                >
                  <Image
                    source={(selected.includes(entry.item)) ? Icons.checkCircle : Icons.circle}
                    tintColor={Colours[globals.theme]["darkerGray"]}
                    resizeMode='contain'
                    className="max-h-[28px] max-w-[28px]"
                  />
                </TouchableOpacity>
              }
              <TouchableOpacity 
                className="flex-1 my-[2px]"
                onPress={() => {router.push('/entry?entryInfo=' + encodeURIComponent(JSON.stringify(globals.returnMatchingEntries(entry.item))))}}
                disabled={editing}
              >
                <View className="flexGrow-1 py-[6px]" style={{borderBottomWidth: 1, borderColor: Colours[globals.theme]["text"]}}>
                  <Text numberOfLines={1} className={'bg-transparent px-3 font-bold'} style={{ fontSize: 23, color: Colours[globals.theme]["text"] }} allowFontScaling={false}>
                    {entry.item}
                    <Text className="font-normal"> {PinyinTones(returnAllPinyin(entry.item).join(" / "))}</Text>
                    {/* {entry.item.simplified}<Text className="font-normal">{(entry.item.simplified == entry.item.traditional ? "" : " [" + entry.item.traditional + "]")} {PinyinTones(entry.item.pinyin.replace("[", "").replace("]", ""))}</Text> */}
                  </Text>
                  <Text numberOfLines={1} className={'bg-transparent px-3 font-normal mt-[2px] mb-[3px]'}>{returnAllDefs(entry.item).join(" / ")}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <View className="h-[60px] flex-row items-center justify-center px-6" style={{backgroundColor: Colours[globals.theme]["background"]}}>
        {editing &&
          <View className="flex-row">
            <TouchableOpacity
              onPress={async () => {
                await globals.delBookmark(selected, title);
                setEditing(false);
                setSelected([]);
                emitter.emit("bookmarksChanged")
              }}
            >
              <Text className="font-qbold text-lg" style={{color: Colours[globals.theme]["text"]}}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1">
              <Text className="font-qbold text-lg text-center" style={{color: Colours[globals.theme]["text"]}}>Move</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (JSON.stringify(entryList)==JSON.stringify(selected)) {
                  setSelected([])
                } else {
                  setSelected(entryList);
                }
              }}
            >
              <Text className="font-qbold text-lg" style={{color: Colours[globals.theme]["text"]}}>{(JSON.stringify(entryList)==JSON.stringify(selected)) ? "None" : "<All>"}</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    </SafeAreaView>
  )
}

export default BookmarkEntry