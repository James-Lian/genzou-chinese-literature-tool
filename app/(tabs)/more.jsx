import { View, Text, Button, SafeAreaView } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

import * as globals from '../../config/globals.js'

const More = () => {
  return (
    <SafeAreaView>
      <Text>More</Text>
      <Button onPress={() => router.replace('/')} className="text-2xl font-qnormal mt-3 text-center" style={{color: 'blue'}} title='< Go Home >' />
      <Button onPress={() => {globals.clearAllData()}} className="text-2xl font-qnormal mt-3 text-center" style={{color: 'blue'}} title='< Clear All Data >' />
      <Button onPress={async () => {const results = await globals.getAllData(); console.log(results)}} className="text-2xl font-qnormal mt-3 text-center" style={{color: 'blue'}} title='< Log All Data >' />
    </SafeAreaView>
  )
}

export default More