import { View, Text, Button, SafeAreaView, Switch, ScrollView, StyleSheet, Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

import * as globals from '../../config/globals.js'
import { Colours } from '../../constants/index.js'
import { Images } from '../../constants/index.js'
import { Icons } from '../../constants/index.js'

import SelectDropdown from 'react-native-select-dropdown'

const More = () => {
  return (
    <SafeAreaView>
      <ScrollView className="h-full w-full">
        <Text className="text-lg mt-8 px-3 text-center">Permissions required: storage, camera, photo library</Text>
        <Button onPress={() => router.replace('/')} className="text-2xl font-qnormal mt-3 text-center" style={{color: 'blue'}} title='< Go Home >' />
        <Button onPress={() => {globals.clearAllData()}} className="text-2xl font-qnormal mt-3 text-center" style={{color: 'blue'}} title='< Clear All Data >' />
        <Button onPress={async () => {const results = await globals.getAllData(); console.log(results)}} className="text-2xl font-qnormal mt-3 text-center" style={{color: 'blue'}} title='< Log All Data >' />
        <Button onPress={async () => {console.log(await globals.getData("bookmarks"))}} className="text-2xl font-qnormal mt-3 text-center" style={{color: 'blue'}} title='< Log Bookmarks >' />
        <Button onPress={async () => {console.log(globals.theme)}} className="text-2xl font-qnormal mt-3 text-center" style={{color: 'blue'}} title='< Log Globals >' />
        <Switch
          onValueChange={(value) => {console.log(value)}}
          value={true}
        />
        <SelectDropdown
          data={["light", "dark"]}
          defaultValue={globals.theme}
          onSelect={(selectedItem, index) => {
            globals.theme = selectedItem; // and prompting rerender
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
      </ScrollView>
    </SafeAreaView>
  )
}

export default More

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