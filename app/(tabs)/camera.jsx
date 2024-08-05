import { View, Text, SafeAreaView, Button, Alert, TouchableOpacity, Image, ScrollView, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router'

import { Images } from '../../constants/index.js'
import { Icons } from '../../constants/index.js'
import { ImageViewer, WelcomeButton } from '../../components'

import * as globals from '../../config/globals.js'
import { Colours } from '../../constants'

import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';

import { DataInputType, getText, OcrEngineMode, useOCREventListener } from 'rn-ocr-lib';

const Camera = () => {
  let windowHeight = Dimensions.get('window').height;

  const [ userSelectedImage, setUserSelectedImage ] = useState(null);
  const [ scannedText, setScannedText ] = useState("")

  const [ confirmDialogOpen, setConfirmDialogOpen ] = useState(false);
  const toggleConfirmDialog = () => {
    setConfirmDialogOpen(!confirmDialogOpen);
  }

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

  const recognizeText = async (uri) => {
    if (uri) {
      try {
        getText(uri.replace("file://", ''), DataInputType.file, {
          ocrEngineMode: OcrEngineMode.ACCURATE,
          lang: ['chi_sim', 'chi_tra', 'eng']
        })
      } catch (e) {
        console.log(e.message)
      }
      // const resultFromUri = await TextRecognition.recognize(uri, TextRecognitionScript.CHINESE);
      // console.log(resultFromUri.text)
      // setScannedText(resultFromUri);
      // setConfirmDialogOpen(true);
    } else {
      let toast = Toast.show('Error: invalid image.', { hideOnPress: true, duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM, backgroundColor: Colours[globals.theme]["opposite"] , shadowColor: Colours[globals.theme]["darkerGray"] })
    }
  }

  useOCREventListener((event, data) => {
    switch (event) {
      case OCREvent.FINISHED:
        console.log(data.text)
        setScannedText(data.text);
        setConfirmDialogOpen(true);
        return;
      case OCREvent.PROGRESS:
        // setProgress(data.percent);
        return;
      case OCREvent.ERROR:
        console.log(data.error);
        return;
      default:
        return;
    }
  })

  return (
    <RootSiblingParent>
      <SafeAreaView className="flex-1 justify-center items-center" style={{backgroundColor: Colours[globals.theme]["background"]}}>
        <View
          className="min-h-[28px] w-full" style={{backgroundColor: Colours[globals.theme]["background"]}}
        >
          <View className="flex-row justify-center items-center">
              <Text className="text-center font-qbold text-2xl mb-[12px]" style={{color: Colours[globals.theme]["text"]}} allowFontScaling={false}>Camera</Text>
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
                  handlePress={() => {recognizeText(userSelectedImage)}}
                />
              </View>
              <View className="justify-center items-center">
                <Button title='Test out Modal' onPress={() => {setConfirmDialogOpen(true);}}/>
              </View>
            </View>
          </ScrollView>
        </View>

        <Modal
          visible={confirmDialogOpen}
          transparent={true}
          onRequestClose={toggleConfirmDialog}
          animationType='slide'
        >
          <TouchableWithoutFeedback onPress={toggleConfirmDialog}>
            <View className="w-full h-full justify-end items-center" style={{backgroundColor: "#00000060"}}>
              <TouchableWithoutFeedback>
                <View className="w-full px-[20px] py-[32px]" style={{backgroundColor: Colours[globals.theme]["background"], height: windowHeight * 4/5}}>
                  <Text className="font-qbold text-lg text-center mb-[20px]" style={{color: Colours[globals.theme]["text"]}}>Replace text in Editor with scanned text?</Text>
                  <ScrollView className="rounded-md mb-[12px] p-[12px]" centerContent={true} style={{backgroundColor: Colours[globals.theme]["darker"]}}>
                    <Text className="font-qnormal text-center" style={{fontSize: 20, color: Colours[globals.theme]["text"]}}>{globals.currText.trim() != "" ? globals.currText : "< No editor text to replace >" }</Text>
                    <Text className="font-qnormal text-center mt-3" style={{fontSize: 20, color: Colours[globals.theme]["indigo"]}}>{scannedText != "" ? scannedText : "< No text scanned >"}</Text>
                  </ScrollView>
                  <WelcomeButton
                    title="Confirm"
                    containerStyles="my-[3px]"
                    textStyles="text-xl text-center"
                    handlePress={() => {toggleConfirmDialog(); globals.currText = scannedText; router.replace('/editor')}}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </RootSiblingParent>
  )
}

export default Camera