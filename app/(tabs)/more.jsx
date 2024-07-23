import { View, Text, Button } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const More = () => {
  return (
    <View>
      <Text>More</Text>
      <Button onPress={() => router.replace('/')} className="text-2xl font-qnormal mt-3 text-center" style={{color: 'blue'}} title='< Go Home >' />
    </View>
  )
}

export default More