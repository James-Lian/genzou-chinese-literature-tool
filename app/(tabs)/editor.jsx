import { View, Text, Button, Animated, ScrollView, Image, TouchableOpacity, TextInput, Dimensions, PanResponder } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import * as globals from '../../config/globals.js'
import DynamicHeader from '../../components/DynamicHeader.js'
import { Icons } from '../../constants/index.js'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Editor = () => {
  const minScrollHeight = 30;
  const firstScroll = useRef()
  const secondScroll = useRef()

  const insets = useSafeAreaInsets();

  let windowHeight = Dimensions.get('window').height;
  windowHeight -= insets.bottom + insets.top + 48 + 88 + 22
  let [topHeight, setTopHeight] = useState(Math.floor(windowHeight/2));
  let [bottomHeight, setBottomHeight] = useState(Math.floor(windowHeight/2));

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const newTopHeight = topHeight + gestureState.dy;
        const newBottomHeight = bottomHeight - gestureState.dy;

        if (newTopHeight >= minScrollHeight && newBottomHeight >= minScrollHeight) {
          setTopHeight(newTopHeight);
          setBottomHeight(newBottomHeight);
        }
      },
    })
  ).current;

  return (
    <SafeAreaView className="flex-1 items-center h-full" style={{backgroundColor: Colours[globals.theme]["background"]}}>
      <View className="w-full flex-row justify-center items-center max-h-[48px] px-3">
        <View className="flex-1 justify-center">
          <View className="flex-row justify-start items-center gap-[12px]">
            <TouchableOpacity>
              <Image 
                source={Icons.minusSquare}
                tintColor={Colours[globals.theme]["darkerGray"]}
                resizeMode='contain'
                className="ml-[8px] max-h-[28px] max-w-[38px]"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image 
                source={Icons.plusSquare}
                tintColor={Colours[globals.theme]["darkerGray"]}
                resizeMode='contain'
                className="max-h-[28px] max-w-[38px]"
              />
            </TouchableOpacity>
            <TouchableOpacity>
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
            <TouchableOpacity>
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
            <TouchableOpacity>
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
          // onContentSizeChange={() => firstScroll.current.scrollToEnd({animated:true})} // maybe later
          className="rounded-lg w-full"
          style={{backgroundColor: Colours[globals.theme]["darker"], maxHeight:topHeight, minHeight:topHeight}}
        >
            <TextInput 
              className={`bg-transparent p-3 font-qbold`}
              style={{ fontSize: globals.editorTextSize, color:Colours[globals.theme]["text"] }}
              placeholder="Enter Chinese text here... "
              placeholderTextColor={Colours[globals.theme]["gray"]}
              multiline={true}
              textAlignVertical={true}
              allowFontScaling={false}
            />
        </ScrollView>
      </View>

      {/* draggable bar to resize the two scrollables, passing the properties of panResponder onto the View component */}
      <View className="w-full">
        <View {...panResponder.panHandlers} className="flex mx-3 py-1 rounded-lg" style={{backgroundColor: Colours[globals.theme]["darkerGray"]}} />
      </View>

      <View className="my-1 flexGrow-1 w-full px-2">
        <ScrollView
          ref={secondScroll}
          className="rounded-lg"
          style={{backgroundColor: Colours[globals.theme]["indigo"], maxHeight:bottomHeight, minHeight:bottomHeight}}
        >
            <TextInput 
              editable={false}
              className={`bg-transparent p-3 font-qbold`}
              style={{ fontSize: globals.editorTextSize }}
              placeholder= {(globals.pinyinMode) ? "Pinyin will appear here... " : "The translation will appear here... "}
              placeholderTextColor={"white"}
              multiline={true}
              textAlignVertical={true}
              allowFontScaling={false}
            />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Editor