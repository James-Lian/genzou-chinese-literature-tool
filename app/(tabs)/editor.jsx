import { router } from 'expo-router'
import { View, Text, Button, Animated, ScrollView, Image, TouchableOpacity, TextInput, Dimensions, PanResponder, Modal, TouchableWithoutFeedback, StyleSheet, FlatList, Keyboard, KeyboardEvent } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SelectDropdown from 'react-native-select-dropdown'

import * as Speech from 'expo-speech';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';

import { pinyin } from "pinyin-pro"
import { translate } from '@vitalets/google-translate-api';
import * as Clipboard from 'expo-clipboard';

import * as globals from '../../config/globals.js'
import { Colours } from '../../constants'
import { SideMenu } from '../../components'
import { Icons } from '../../constants/index.js'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import emitter from '../../components/EventEmitter.js'

const Editor = () => {
  const [existsInStorage, setExistsInStorage] = useState(false);
  const [existsInDictionary, setExistsInDictionary] = useState(false);

  const [textSelection, setTextSelection] = useState({ start: 0, end: 0})

  const selectionBookmarkandStorage = async (selection) => {
    if (selection.start != selection.end) {
      const bmExists = await globals.bookmarkExists(globals.currText.slice(selection.start, selection.end), "Uncategorized")
      setExistsInStorage(bmExists);
      setExistsInDictionary(globals.dictEntryExists(globals.currText.slice(selection.start, selection.end)));
    }
  }
  const handleSelectionChange = ({ nativeEvent: { selection } }) => {
    setTextSelection(selection);

    selectionBookmarkandStorage(selection)
  };
  
  const minScrollHeight = 30;
  const firstScroll = useRef()
  const secondScroll = useRef()

  const insets = useSafeAreaInsets();

  let windowWidth = Dimensions.get('window').width;
  windowWidth -= 2 + 12; // accounting for margins and padding

  let windowHeight = Dimensions.get('window').height;
  windowHeight -= insets.bottom + insets.top + 48 + 88 + 22

  let [topHeight, setTopHeight] = useState(Math.floor(windowHeight/3));
  let topHeightRef = useRef({});
  topHeightRef.current = topHeight

  let [bottomHeight, setBottomHeight] = useState(Math.floor(windowHeight/3*2));
  let bottomHeightRef = useRef({});
  bottomHeightRef.current = bottomHeight
  
  let heightChangeRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const newTopHeight = topHeightRef.current - heightChangeRef.current + gestureState.dy;
        const newBottomHeight = bottomHeightRef.current + heightChangeRef.current - gestureState.dy;
        
        if (newTopHeight >= minScrollHeight && newBottomHeight >= minScrollHeight) {
          setTopHeight(newTopHeight);
          setBottomHeight(newBottomHeight);
        }
        
        heightChangeRef.current = gestureState.dy;
      },
      onPanResponderRelease: (event, gestureState) => {
        heightChangeRef.current = 0;
      }
    })
  ).current;
  
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);  
  const toggleMoreOptions = () => {
    setMoreOptionsOpen(!moreOptionsOpen);
  }

  let [editorTextSize, setEditorTextSize] = useState(22)

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const onKeyboardShow = (event) => {
    setKeyboardHeight(event.endCoordinates.height);
  }

  const onKeyboardHide = () => {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    const onShow = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    const onHide = Keyboard.addListener('keyboardDidHide', onKeyboardHide);

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  let [speaking, setSpeaking] = useState(false);
  const toggleSpeaking = () => {
    if (speaking) {
      setSpeaking(false)
      Speech.stop()
    }
    else {
      setSpeaking(true)
      let toast = Toast.show('Ensure silent mode is off on your device to use TTS.', { hideOnPress: true, duration: 1200, position: Dimensions.get('window').height - 180 - Math.max((keyboardHeight - 100), 0), backgroundColor: Colours[globals.theme]["opposite"] , shadowColor: Colours[globals.theme]["darkerGray"] })
      
      if (textSelection.start == textSelection.end) {
        Speech.speak(globals.currText, {language:globals.voices[globals.currVoice], onDone:() => setSpeaking(false)})
      }
      else {
        Speech.speak(globals.currText.slice(textSelection.start, textSelection.end), {language:globals.voices[globals.currVoice], onDone:() => setSpeaking(false)})
      }
    }
  }
  
  const [textWidth, setTextWidth] = useState(1);
  const hiddenTextRef = useRef(null);
  const measureHiddenTextWidth = () => {
    if (hiddenTextRef.current) {
      hiddenTextRef.current.measure((fx, fy, width, height, px, py) => {
        setTextWidth(width+2);
      })
    }
  }

  var numCharsPerRow = Math.floor(windowWidth / (textWidth*2));

  useEffect(() => {
    measureHiddenTextWidth();
  }, [globals.currText, editorTextSize])
  
  let [resultTxts, setResultTxts] = useState([]);
  const textChanged = async (newTxt) => {
    globals.currText = newTxt;
    if (globals.editorModes[globals.currEditorMode] == "Translation") {
      if (globals.currText.trim()) {
        try {
          const { text } = await translate(globals.currText, { to: 'en' })
          setResultTxts([text])
        }
        catch {
          setResultTxts(["Error: TooManyRequests (API error)"])
        }
      }
      else {
        setResultTxts(["Translation will appear here... "])
      }
    }
    else if (globals.editorModes[globals.currEditorMode] == "Pinyin") {
      let noSpaces = globals.currText.split(" ").join("")
      let purePinyin = pinyin(noSpaces).split(" ")

      let splitChinese = [];
      let splitPinyin = [];

      if (noSpaces.trim()) {
        let buildingChar = "";
        let buildingCharPinyin = "";
        let i = 0;
        while (i < noSpaces.length) {
          buildingChar = "";
          buildingCharPinyin = "";
          buildingChar += noSpaces[i];
          buildingCharPinyin += purePinyin[i];
          splitChinese.push(buildingChar)
          splitPinyin.push(buildingCharPinyin)
          i++;
        }

        let chineseWithPinyin = [];
        
        let buildingPhrase = []
        let buildingPinyin = []
        i = 0;
        for (char of splitChinese) {
          buildingPhrase += char + " ";
          buildingPinyin += splitPinyin[i] + " "
          if ((i != 0) && (i % numCharsPerRow == numCharsPerRow - 1)) {
            chineseWithPinyin.push(buildingPhrase);
            chineseWithPinyin.push(buildingPinyin);
            buildingPhrase = "";
            buildingPinyin = "";
          }
          i++;
        }
        chineseWithPinyin.push(buildingPhrase)
        chineseWithPinyin.push(buildingPinyin)

        setResultTxts(chineseWithPinyin);
      }
      else {
        setResultTxts(["Pinyin will appear here... "])
      }
    }
  }

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(globals.currText.slice(textSelection.start, textSelection.end))
    let toast = Toast.show('Copied!', { hideOnPress: true, duration: 1200, position: Dimensions.get('window').height - 180 - Math.max((keyboardHeight - 120), 0), backgroundColor: Colours[globals.theme]["opposite"] , shadowColor: Colours[globals.theme]["darkerGray"] })
  }

  return (
    <RootSiblingParent>
      <SafeAreaView className="flex-1 items-center h-full" style={{backgroundColor: Colours[globals.theme]["background"]}}>
        <View>
          {textSelection.start == textSelection.end ? (
            <View className="w-full flex-row justify-center items-center max-h-[48px] px-3">
              <View className="flex-1 justify-center">
                <View className="flex-row justify-start items-center gap-[8px]">
                  <TouchableOpacity
                    onPress={() => {setEditorTextSize((editorTextSize) => (editorTextSize - 2 > 10) ? editorTextSize - 2 : 12); textChanged(globals.currText)}}>
                    <Image 
                      source={Icons.minusSquare}
                      tintColor={Colours[globals.theme]["darkerGray"]}
                      resizeMode='contain'
                      className="ml-[8px] max-h-[28px] max-w-[38px]"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {setEditorTextSize((editorTextSize) => (editorTextSize + 2 < 58) ? editorTextSize + 2 : 56); textChanged(globals.currText)}}>
                    <Image 
                      source={Icons.plusSquare}
                      tintColor={Colours[globals.theme]["darkerGray"]}
                      resizeMode='contain'
                      className="max-h-[28px] max-w-[38px]"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {toggleSpeaking()}}
                  >
                    <Image 
                      source={Icons.volume}
                      tintColor={Colours[globals.theme]["darkerGray"]}
                      resizeMode='contain'
                      className="max-h-[28px] max-w-[38px]"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex-1 justify-center">
                <View className="flex-row justify-end items-center gap-[12px]">
                  <TouchableOpacity
                    onPress={() => router.replace('/camera')}
                  >
                    <Image 
                      source={Icons.camera}
                      tintColor={Colours[globals.theme]["darkerGray"]}
                      resizeMode='contain'
                      className="max-h-[28px] max-w-[38px]"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {setMoreOptionsOpen(true);}}
                  >
                    <Image 
                      source={Icons.more}
                      tintColor={Colours[globals.theme]["darkerGray"]}
                      resizeMode='contain'
                      className="max-h-[28px] max-w-[38px]"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View className="min-w-full flex-row justify-center items-center max-h-[48px] px-3" style={{gap: windowWidth / 10}}>
              <TouchableOpacity
                onPress={() => {
                  if (
                    globals.returnMatchingEntries(
                      globals.currText.slice(textSelection.start, textSelection.end))
                  ) {
                    router.push(
                      '/entry?entryInfo=' + 
                      encodeURIComponent( // the string must be encoded because if there is a ? in the information, like in the definitions for 为什么, then it'll think the string has ended
                        JSON.stringify(
                          globals.returnMatchingEntries(
                            globals.currText.slice(textSelection.start, textSelection.end)
                          )
                        )
                      )
                    )
                  }
                }}
                disabled={!existsInDictionary}
              >
                <Image 
                  source={Icons.cornerUpRight}
                  tintColor={(existsInDictionary) ? Colours[globals.theme]["darkerGray"] : Colours[globals.theme]["lighterGray"]}
                  resizeMode='contain'
                  className="max-h-[28px] max-w-[38px]"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {router.replace('/lookup?editorQuery=' + globals.currText.slice(textSelection.start, textSelection.end));}}
              >
                <Image 
                  source={Icons.search}
                  tintColor={Colours[globals.theme]["darkerGray"]}
                  resizeMode='contain'
                  className="max-h-[28px] max-w-[38px]"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  if (existsInDictionary && !existsInStorage) {
                    await globals.setBookmark([globals.currText.slice(textSelection.start, textSelection.end)], "Uncategorized")
                    emitter.emit('bookmarksChanged')
                  }
                  setExistsInStorage(true)
                }}
                disabled={!existsInDictionary || existsInStorage}
              >
                <Image 
                  source={Icons.plus}
                  tintColor={(existsInDictionary && !existsInStorage) ? Colours[globals.theme]["darkerGray"] : Colours[globals.theme]["lighterGray"]}
                  resizeMode='contain'
                  className="max-h-[28px] max-w-[38px]"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {toggleSpeaking()}}
              >
                <Image 
                  source={Icons.volume}
                  tintColor={Colours[globals.theme]["darkerGray"]}
                  resizeMode='contain'
                  className="max-h-[28px] max-w-[38px]"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={copyToClipboard}
              >
                <Image 
                  source={Icons.copy}
                  tintColor={Colours[globals.theme]["darkerGray"]}
                  resizeMode='contain'
                  className="max-h-[28px] max-w-[38px]"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="my-1 w-full px-2">
          <ScrollView
            ref={firstScroll}
            className="rounded-lg w-full py-1"
            contentContainerStyle={{flexGrow: 1}}
            style={{backgroundColor: Colours[globals.theme]["darker"], maxHeight:topHeight, minHeight:topHeight}}
          >
              <TextInput 
                className={`bg-transparent p-3 font-qbold`}
                key={editorTextSize*2} // force re-render by changing key
                style={{ fontSize: editorTextSize, color: Colours[globals.theme]["text"] }}
                placeholder="Enter Chinese text here... "
                placeholderTextColor={Colours[globals.theme]["gray"]}
                multiline={true}
                allowFontScaling={false}
                onChangeText={(txt) => {textChanged(txt)}}
                onSelectionChange={handleSelectionChange}
                onBlur={() => setTextSelection({ start: 0, end: 0 })}
                defaultValue={globals.currText}
              />
          </ScrollView>
        </View>

        {/* draggable bar to resize the two scrollables, passing the properties of panResponder onto the View component */}
        <View className="w-full">
          <View {...panResponder.panHandlers} className="flex mx-3 py-1 rounded-lg" style={{backgroundColor: Colours[globals.theme]["darkerGray"]}} />
        </View>

        <View className="my-1 w-full px-2 flex-1">
          <FlatList
            ref={secondScroll}
            className="rounded-lg py-3"
            contentContainerStyle={{flexGrow: 1}} // enables full scrolling to the bottom, instead of flex-1
            style={{backgroundColor: Colours[globals.theme]["indigo"], maxHeight:bottomHeight, minHeight:bottomHeight}}
            scrollEnabled={true}
            data={resultTxts}
            ListFooterComponent={<View style={{height: 30}} />}
            keyExtractor={(item) => {item}}
            renderItem={({item, index}) => (
              <View className='flexGrow-1'>
                {item == "Translation will appear here... " || item == "Pinyin will appear here... " || item == "Error: TooManyRequests (API error)" ? (
                  <Text className={'bg-transparent px-3 font-qbold'} style={{ fontSize: editorTextSize, color: "white" }} allowFontScaling={false}>{item}</Text>
                ): (
                  <View className="flex-1">
                    {globals.editorModes[globals.currEditorMode] == "Translation" ? (
                      <View className="flex-1">
                        <Text style={{fontSize: editorTextSize, color: "white"}} className={'px-3 font-qbold text-left'} allowFontScaling={false}>{item}</Text>
                      </View>
                    ) : (
                      <View className='flex-row' style={{width: windowWidth, maxWidth: windowWidth}} key={index*8000}>
                        {item.split(" ").map((input, subIndex) => (
                          <View>
                            {index % 2 == 0 ? (
                              <Text style={{width: Math.floor(windowWidth / numCharsPerRow), fontSize: editorTextSize, color: "white"}} className={'px-3 font-qbold text-center'} key={subIndex*91} allowFontScaling={false}>{input.trim()}</Text>
                            ) : (
                              <Text style={{width: Math.floor(windowWidth / numCharsPerRow), fontSize: Math.floor(editorTextSize / 1.8), color: "white", fontFamily:"Arial", fontWeight:"bold"}} className='text-center' key={subIndex*3} allowFontScaling={false}>{input.trim()}</Text>
                            )}
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                  )
                }
              </View>
            )}
          />
        </View>

        <View
          style={{position: 'absolute', top:-1000000, left:-1000000}}
        >
          <Text
            ref={hiddenTextRef}
            className="font-qbold"
            key={editorTextSize} // force rerender whenever text size is changed
            style={{fontSize: editorTextSize, color: 'transparent'}}
            onLayout={measureHiddenTextWidth} // measure width on layout change
          >
            爱
          </Text>
        </View>

        <Modal
          visible={moreOptionsOpen}
          animationType="none"
          transparent={true}
          onRequestClose={toggleMoreOptions}
        >
          <TouchableWithoutFeedback onPress={toggleMoreOptions}>
            <View className="w-full h-full justify-center items-end" style={{backgroundColor: "#00000060"}}>
              <TouchableWithoutFeedback>
                <View>
                  <SideMenu>
                    <Text className="font-qnormal text-2xl" style={{color: Colours[globals.theme]["text"]}}>Editor Options</Text>
                    <View className="w-full h-0.5 my-3 rounded" style={{backgroundColor: Colours[globals.theme]["text"]}} />
                    <SelectDropdown
                      data={globals.editorModes}
                      defaultValueByIndex={globals.currEditorMode}
                      onSelect={(selectedItem, index) => {
                        globals.currEditorMode = index
                        textChanged(globals.currText)
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
                    <SelectDropdown
                      data={globals.voices}
                      defaultValueByIndex={globals.currVoice}
                      onSelect={(selectedItem, index) => {
                        globals.currVoice = index
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
                  </SideMenu>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </RootSiblingParent>
  )
}

export default Editor

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