import { View, Text, SafeAreaView, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';

import { Images } from '../../constants/index.js'
import { ImageViewer } from '../../components'

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
      console.log("big bruh moment", userSelectedImage)
    } else {
      Alert.alert('Notice', 'You did not select any image');
    }
  };

  console.log("please bro", Images.placeholder)

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <View>
        <Text className="text-center">Camera</Text>
        <Button title="Choose a photo" onPress={pickImageAsync}></Button>
        <View className="items-center flex-1">
          <ImageViewer
            placeholderImageSource={Images.placeholder}
            selectedImage={userSelectedImage}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Camera