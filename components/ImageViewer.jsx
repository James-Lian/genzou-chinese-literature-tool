import { Image, Dimensions } from 'react-native'
import { useState, useEffect } from 'react'

export default function ImageViewer({ placeholderImageSource, selectedImage }) {
    let windowWidth = Dimensions.get('window').width;

    const imageSource = selectedImage ? { uri: selectedImage } : placeholderImageSource;
    const [ imageDimensions, setImageDimensions ] = useState([1, 1])

    useEffect(() => {
        if (selectedImage) {
            Image.getSize(selectedImage, (w, h) => {setImageDimensions([w, h])});
        }
    })

    if (selectedImage) {
        return <Image source={imageSource} style={{ minWidth: windowWidth/1.6, maxWidth: windowWidth/1.6, maxHeight: (windowWidth/1.6) / imageDimensions[0] * imageDimensions[1], minHeight: (windowWidth/1.6) / imageDimensions[0] * imageDimensions[1]}} borderRadius={12} resizeMode='contain'/>
    }
    else {
        return <Image source={imageSource} style={{ minWidth: 300, maxWidth: 300, maxHeight: 300, minHeight: 300}} borderRadius={12} resizeMode='contain'/>
    }
}