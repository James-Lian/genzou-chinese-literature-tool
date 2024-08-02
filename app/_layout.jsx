import { useEffect } from "react";
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from "expo-font";

import * as globals from '../config/globals.js'
import { Colours } from '../constants'
import { Icons } from '../constants/index.js'

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const [fontsLoaded, error] = useFonts({
        "quardratic": require("../assets/fonts/quardratic.ttf"),
        "quardraticb": require("../assets/fonts/quardraticb.ttf"),
        "quardratici": require("../assets/fonts/quardratici.ttf"),
        "quardraticz": require("../assets/fonts/quardraticz.ttf"),
    });

    useEffect(() => {
        if (error) throw error;
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error])

    if (!fontsLoaded && !error) return null;

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'back' }} />
            <Stack.Screen name="entry" options={{ title: 'Dictionary 字典' }} />
        </Stack>
    )
}

export default RootLayout