// AsyncStorage for storing information...
/*
@bookmarks: for saving phrases and terms (object)
@files: for saving editor text (object)
@history: for saving search history (object: {dict (list), search (list)})
@system-info: for saving system info like themes and stuff (object: {welcomed, theme, prevText, currVoice})
*/

import AsyncStorage from '@react-native-async-storage/async-storage';
export const storeData = async (value, key) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        console.log(e)
    }
}

export const getData = async (key) => {
    try{
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        return null;
    }
}

// config and ux variables
export var theme = "light";

export var currText = ""; // "你还不赶紧练习？玲玲每天练40小时，他五岁已经当上了医生！";
export const voices = [
    "zh-CN", "zh-HK", "zh-TW"
]
export var currVoice = 0

export const editorModes = [
    "Pinyin", "Translation"
]
export var currEditorMode = 0;


// Reading cedict_ts.txt (CC-CEDICT) dictionary file:
import { Asset } from "expo-asset";
import * as FileSystem from 'expo-file-system';

const readFile = async () => {
    const { localUri } = await Asset.fromModule(require("../assets/files/cedict_ts.txt")).downloadAsync();

    let dict = await FileSystem.readAsStringAsync(localUri)
    dict = dict.split('\n').filter(line => line && !line.startsWith("#")).map(line => {
        line = line.trim()

        let entries = []

        let buildingEntry = ""
        let withinTerm = false
        for (let i = 0; i < line.length; i++) {
        if (line[i] === "[" || (line[i] === "/" && i != line.length - 1)) {
            withinTerm = true
        } else if (line[i] === "]") {
            withinTerm = false
        }
        
        if (line[i] === " " && withinTerm === false) {
            entries.push(buildingEntry)
            buildingEntry = ""
        }
        else {
            buildingEntry += line[i]
        }
        }
        entries.push(buildingEntry)
        return {
        traditional: entries[0].trim(),
        simplified: entries[1].trim(),
        pinyin: entries[2].trim(),
        definitions: entries[3].trim().split("/").filter(def => def != "")  //.join("\n").trim()
        }
    })
    return dict
}

export var dictionary = null;
readFile().then(val => { dictionary = val });