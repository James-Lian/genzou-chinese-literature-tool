import { View, Text, SafeAreaView, Image, TouchableOpacity, FlatList, StyleSheet, Modal, TouchableWithoutFeedback, Dimensions, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'

import * as globals from '../config/globals.js'
import { Colours } from '../constants'
import { Icons } from '../constants/index.js'

import { router, useLocalSearchParams, Stack, useNavigation } from 'expo-router';

import PinyinTones from 'pinyin-tone'
import emitter from '../components/EventEmitter.js'

import SelectDropdown from 'react-native-select-dropdown'
import WelcomeButton from '../components/WelcomeButton.jsx'

const BookmarkEntry = () => {
  let windowHeight = Dimensions.get('window').height;

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

  const [folderNames, setFolderNames] = useState([]) // this list excludes the current folder
  const [folderToMoveTo, setfolderToMoveTo] = useState(0)

  const retrieveFolderNames = async () => {
    const bookmarkData = await globals.getData('bookmarks')
    if (bookmarkData) {
      let folderNamesWithoutCurrent = Object.getOwnPropertyNames(bookmarkData)
      if (folderNamesWithoutCurrent.includes(title)) {
        folderNamesWithoutCurrent.splice(folderNamesWithoutCurrent.indexOf(title), 1)
      }
      setFolderNames(folderNamesWithoutCurrent)
    } else {
      setFolderNames([])
    }
  }

  useEffect(() => {
    retrieveBookmarks()
    retrieveFolderNames()

    emitter.on('bookmarksChanged', retrieveBookmarks);

    return () => {
      emitter.off('bookmarksChanged', retrieveBookmarks)
    }
  }, [])

  const navigation = useNavigation();

  const [ confirmMoveOpen, setConfirmMoveOpen ] = useState(false);

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
                    <Text className="font-normal"> {PinyinTones(returnAllPinyin(entry.item).join(" / ").toLowerCase())}</Text>
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
            <TouchableOpacity 
              className="flex-1"
              onPress={() => {
                if (selected.length != 0) {
                  setConfirmMoveOpen(true);
                } else {
                  setEditing(false)
                }
              }}
            >
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

      <Modal
        visible={confirmMoveOpen}
        transparent={true}
        onRequestClose={() => {setConfirmMoveOpen(false)}}
        animationType='slide'
      >
        <TouchableWithoutFeedback onPress={() => {setConfirmMoveOpen(false)}}>
          <View className="w-full h-full justify-end items-center" style={{backgroundColor: "#00000060"}}>
            <TouchableWithoutFeedback>
              <View className="w-full px-[20px] py-[32px]" style={{backgroundColor: Colours[globals.theme]["background"], height: windowHeight * 4/5}}>
                {folderNames.length == 0 ? (
                  <View className="w-full h-full items-center">
                    <Text className="font-qbold text-lg text-center mb-[20px]" style={{color: Colours[globals.theme]["text"]}}>You have no other folders. Create a new destination folder.</Text>
                    <TextInput />
                  </View>
                ) : (
                  <View className="w-full h-full justify-end items-center">
                      <Text className="font-qbold text-lg text-center mb-[20px]" style={{color: Colours[globals.theme]["text"]}}>Choose a folder...</Text>
                      <View className="items-center mb-3">
                        <SelectDropdown
                          data={folderNames}
                          defaultValueByIndex={folderToMoveTo}
                          onSelect={(selectedItem, index) => {
                            setfolderToMoveTo(index); // and prompting rerender
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
                          showsVerticalScrollIndicator={true}
                          dropdownStyle={styles.dropdownMenuStyle}
                        />
                      </View>
                      <WelcomeButton
                        title="Confirm"
                        containerStyles="my-[3px]"
                        textStyles="text-xl text-center"
                        handlePress={() => {toggleConfirmDialog(); globals.currText = scannedText; router.replace('/editor')}}
                      />
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  )
}

export default BookmarkEntry

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