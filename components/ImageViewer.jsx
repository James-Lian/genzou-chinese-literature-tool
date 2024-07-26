import { Image, Dimensions } from 'react-native'

export default function ImageViewer({ placeholderImageSource, selectedImage }) {
    let windowWidth = Dimensions.get('window').width;

    const imageSource = selectedImage  ? { uri: selectedImage } : placeholderImageSource;

    console.log("my bro", placeholderImageSource);

    return <Image source={imageSource} style={{minWidth: windowWidth/1.6, minHeight:720 }} className="rounded-lg" resizeMode='contain'/>
}