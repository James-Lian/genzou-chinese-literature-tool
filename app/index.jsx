import { StatusBar } from 'expo-status-bar';
import { Text, View, useColorScheme } from 'react-native';
import { Link } from 'expo-router';

import * as globals from '../config/globals.js'
import { Colours } from '../constants/colours.js'

export default function App() {
  globals.theme = (useColorScheme() == "light") ? true: false;
  
  const classNamesView = ["flex-1", "items-center", "justify-center"];
  if (globals.theme) {
    classNamesView.push("bg-[" + Colours["light"]["background"] + "]")
  }
  else{
    classNamesView.push("bg-[" + Colours["dark"]["background"] + "]")
  }
  
  return (
    <View className={classNamesView.join(" ")}>
      <Text className="text-3xl font-qnormal text-red-300">Genzou!</Text>
      <StatusBar style="auto" />
      <Link href="/editor" style={{color: 'blue'}}>Go to Profile</Link>
    </View>
  );
}