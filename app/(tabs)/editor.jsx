import { View, Text, Button, Animated, ScrollView, Image, TouchableOpacity, TextInput, Dimensions, PanResponder, Modal, TouchableWithoutFeedback, StyleSheet, FlatList } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SelectDropdown from 'react-native-select-dropdown'

import * as Speech from 'expo-speech';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';

import { translate } from '@vitalets/google-translate-api';
import { pinyin } from "pinyin-pro"

import * as globals from '../../config/globals.js'
import { SideMenu } from '../../components'
import { Icons } from '../../constants/index.js'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Editor = () => {
  
  const minScrollHeight = 30;
  const firstScroll = useRef()
  const secondScroll = useRef()

  const insets = useSafeAreaInsets();

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

  let [speaking, setSpeaking] = useState(false);
  const toggleSpeaking = () => {
    if (speaking) {
      setSpeaking(false)
      Speech.stop()
    }
    else {
      setSpeaking(true)
      let toast = Toast.show('Ensure silent mode is off on your device to use TTS.', { duration: Toast.durations.SHORT })
      Speech.speak(globals.currText, {language:globals.voices[globals.currVoice], onDone:() => setSpeaking(false)})
    }
  }
  
  const punctuation = ['。', '，', '、', '‘', '’', '“', '”', '：', '；', '？', '！', '（', '）', '《', '》' ,'·', '•', '…', '「', '」', '‘', '’', '“', '”', '【', '】']
  
  let [resultTxts, setResultTxts] = useState([]);
  const textChanged = async (newTxt) => {
    globals.currText = newTxt;
    if (globals.editorModes[globals.currEditorMode] == "Translation") {
      if (globals.currText.trim()) {
        const { text } = await translate(globals.currText, { to: 'en' })
        setResultTxts([text])
      }
      else {
        setResultTxts(["Translation will appear here... "])
      }
    }
    else if (globals.editorModes[globals.currEditorMode] == "Pinyin") {
      let splitChinese = [];
      if (globals.currText.trim()) {

        let buildingChar = "";
        let i = 0;
        while (i < globals.currText.length) {
          buildingChar += globals.currText[i];
          if (punctuation.includes(globals.currText[i]) || punctuation.includes(globals.currText[i+1])) {
            buildingChar += globals.currText[i+1]
            i += 2;
          }
          else {
            i++;
          }
          splitChinese.push(buildingChar)
        }
        setResultTxts(splitChinese);
      }
      else {
        setResultTxts(["Pinyin will appear here... "])
      }

      // setResultTxts(pinyin(globals.currText))
    }
  }

  return (
    <RootSiblingParent>
      <SafeAreaView className="flex-1 items-center h-full" style={{backgroundColor: Colours[globals.theme]["background"]}}>
        <View className="w-full flex-row justify-center items-center max-h-[48px] px-3">
          <View className="flex-1 justify-center">
            <View className="flex-row justify-start items-center gap-[12px]">
              <TouchableOpacity
                onPress={() => {setEditorTextSize((editorTextSize) => (editorTextSize - 2 > 10) ? editorTextSize - 2 : 12)}}>
                <Image 
                  source={Icons.minusSquare}
                  tintColor={Colours[globals.theme]["darkerGray"]}
                  resizeMode='contain'
                  className="ml-[8px] max-h-[28px] max-w-[38px]"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {setEditorTextSize((editorTextSize) => (editorTextSize + 2 < 88) ? editorTextSize + 2 : 86)}}>
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
                onPress={() => {}}
              >
                <Image 
                  source={Icons.download}
                  tintColor={Colours[globals.theme]["darkerGray"]}
                  resizeMode='contain'
                  className="max-h-[28px] max-w-[38px]"
                />
              </TouchableOpacity>
              <TouchableOpacity>
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

        <View className="my-1 flexGrow-1 w-full px-2">
          <ScrollView
            ref={firstScroll}
            className="rounded-lg w-full"
            style={{backgroundColor: Colours[globals.theme]["darker"], maxHeight:topHeight, minHeight:topHeight}}
          >
              <TextInput 
                className={`bg-transparent p-3 font-qbold`}
                key={editorTextSize} // force re-render by changeing key
                style={{ fontSize: editorTextSize, color:Colours[globals.theme]["text"] }}
                placeholder="Enter Chinese text here... "
                placeholderTextColor={Colours[globals.theme]["gray"]}
                multiline={true}
                textAlignVertical={true}
                allowFontScaling={false}
                onChangeText={(txt) => {textChanged(txt)}}
                value={globals.currText}
              />
          </ScrollView>
        </View>

        {/* draggable bar to resize the two scrollables, passing the properties of panResponder onto the View component */}
        <View className="w-full">
          <View {...panResponder.panHandlers} className="flex mx-3 py-1 rounded-lg" style={{backgroundColor: Colours[globals.theme]["darkerGray"]}} />
        </View>

        <View className="my-1 flexGrow-1 w-full px-2">
          <FlatList
            ref={secondScroll}
            className="rounded-lg"
            style={{backgroundColor: Colours[globals.theme]["indigo"], maxHeight:bottomHeight, minHeight:bottomHeight}}
            scrollEnabled={true}
            data={resultTxts}
            renderItem={({item, index}) => {
              <View>
                <Text className={'bg-transparent p-3 font-qbold'} style={{ fontSize: editorTextSize , color: "white"}} allowFontScaling={false}>{item}</Text>
              </View>
            }}
          />
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