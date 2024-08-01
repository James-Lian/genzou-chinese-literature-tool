import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'

import * as globals from '../../config/globals.js'
import { Colours } from '../../constants'
import { Icons } from '../../constants/index.js'

const SavedTerms = () => {
  const [folders, setFolders] = useState([])

  const retrieveFolders = async () => {
    const bookmarkFolders = await globals.getData("bookmarks")
    setFolders(...bookmarkFolders)
    console.log(bookmarkFolders)
  }
  retrieveFolders()

  const storeFolders = async () => {
    globals.storeData(folders)
  }

  return (
    <SafeAreaView>
      <FlatList
        scrollEnabled={true}
        contentContainerStyle={{flexGrow: 1}}
        ListHeaderComponent={<View style={{height: 8}} />}
        ListFooterComponent={<View style={{height: 168}} />}
        data={folders}
        keyExtractor = {(item) => item.id}
        renderItem={(item) => {
          console.log(item);
        }}
      />
      <Text>SavedTerms</Text>
    </SafeAreaView>
  )
}

export default SavedTerms