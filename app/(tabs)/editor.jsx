import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Editor = () => {
  return (
    <View>
      <Text>Editor</Text>
      <Link href="/" className="text-2xl font-qnormal mt-3 text-center" style={{color: 'blue'}}>{'<'} Back {'>'}</Link>
    </View>
  )
}

export default Editor