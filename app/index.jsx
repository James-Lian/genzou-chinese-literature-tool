import { StatusBar } from 'expo-status-bar';
import { Text, View, useColorScheme } from 'react-native';
import { Link } from 'expo-router';

import * as globals from '../config/globals.js'

import { Colours } from '../constants'

export default function App() {
  globals.theme = (useColorScheme() == "light" || useColorScheme() == "dark") ? useColorScheme() : "light";

  const classNamesView = ["flex-1", "items-center", "justify-center"];
  classNamesView.push("bg-[" + Colours[globals.theme]["background"] + "]")
  
  return (
    <View className={classNamesView.join(" ")}>
      <Text className="text-3xl font-qnormal text-red-300">Genzou!</Text>
      <StatusBar style="auto" />
      <Link href="/editor" style={{color: 'blue'}}>Go to Profile</Link>
    </View>
  );
}