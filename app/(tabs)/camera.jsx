import { View, Text, SafeAreaView, Button, Alert, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker';

import { Images } from '../../constants/index.js'
import { Icons } from '../../constants/index.js'
import { ImageViewer, WelcomeButton } from '../../components'

import * as globals from '../../config/globals.js'
import { Colours } from '../../constants'
import { StatusBar } from 'expo-status-bar';

const Camera = () => {
  const [ userSelectedImage, setUserSelectedImage ] = useState(null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      exif: false,
    });

    if (!result.canceled) {
      setUserSelectedImage(result.assets[0].uri);
    } else {
      Alert.alert('Notice', 'You did not select any image');
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      }
    })();
  }, []);

  const takePhotoAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      exif: false,
      cameraType: ImagePicker.CameraType.back,
    })

    if (!result.canceled) {
      setUserSelectedImage(result.assets[0].uri);
    } else {
      Alert.alert('Notice', 'You did not take an image')
    }
  }

  return (
    <SafeAreaView className="flex-1 justify-center items-center" style={{backgroundColor: Colours[globals.theme]["background"]}}>
      <View
        className="min-h-[28px] w-full" style={{backgroundColor: Colours[globals.theme]["background"]}}
      >
        <View className="flex-row justify-center items-center">
            <Text className="text-center font-qbold text-2xl mb-[12px]" style={{color: Colours[globals.theme]["text"]}}>Camera</Text>
            <TouchableOpacity
                  onPress={() => {setUserSelectedImage(null)}}>
                  <Image 
                    source={Icons.x}
                    tintColor={Colours[globals.theme]["darkerGray"]}
                    resizeMode='contain'
                    className="ml-[3px] mb-[6px] max-h-[28px] max-w-[38px]"
                  />
                </TouchableOpacity>
          </View>
      </View>
      <View
      className = "w-full flex-1"
        style={{backgroundColor: Colours[globals.theme]["darker"]}}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'}}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <View className="items-center flex pb-[2px] mb-[8px]">
              <ImageViewer
                placeholderImageSource={Images.placeholder}
                selectedImage={userSelectedImage}
              />
            </View>
            <View
              className="flex-row justify-center my-[8px]"
            >
              <TouchableOpacity
                onPress={pickImageAsync}
                className="rounded-lg justify-center items-center mx-[6px]"
                style={{backgroundColor: Colours[globals.theme]["indigo"]}}    
                >
                <Image 
                  source={Icons.image}
                  tintColor={"white"}
                  resizeMode='contain'
                  className="max-h-[28px] max-w-[68px]"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={takePhotoAsync}
                className="rounded-lg justify-center items-center mx-[6px]"
                style={{backgroundColor: Colours[globals.theme]["indigo"]}}    
                >
                <Image 
                  source={Icons.camera}
                  tintColor={"white"}
                  resizeMode='contain'
                  className="max-h-[28px] max-w-[68px]"
                />
              </TouchableOpacity>
            </View>
            <View>
              <WelcomeButton 
                title="Use this photo"
                containerStyles="my-[6px] mx-[88px]"
                textStyles="text-xl text-center"
                handlePress={pickImageAsync}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Camera