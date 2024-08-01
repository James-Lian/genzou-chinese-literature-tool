import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'

import * as globals from '../../config/globals.js'
import { Colours } from '../../constants'
import { Icons } from '../../constants/index.js'

const SavedTerms = () => {
  const [folders, setFolders] = useState([])

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
          console.log(item);
        }}
      />
      <Text>SavedTerms</Text>
    </SafeAreaView>
  )
}

export default SavedTerms