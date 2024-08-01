import { View, Text } from 'react-native'
import React from 'react'

const BookmarkEntry = () => {
  return (
    <View>
      <Text>BookmarkEntry</Text>
      <View className="flexGrow-1 py-[3px]" style={{borderBottomWidth: 1, borderColor: Colours[globals.theme]["text"]}}>
                <Text numberOfLines={1} className={'bg-transparent px-3 font-bold'} style={{ fontSize: 23, color: Colours[globals.theme]["text"] }} allowFontScaling={false}>
                  {Object.keys(item)[0]}
                </Text>
                <Text numberOfLines={1} className={'bg-transparent px-3 font-normal mt-[1px] mb-[3px]'}>{entry.item.definitions.join(" / ")}</Text>
              </View>
    </View>
  )
}

export default BookmarkEntry