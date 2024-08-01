// AsyncStorage for storing information...
/*
@bookmarks: for saving phrases and terms (object: {uncategorized: []})
@files: for saving editor text (object)
@history: for saving search history (object: {dict (list), search (list)})
@system-info: for saving system info like themes and stuff (object: {welcomed, theme, prevText, currVoice})
*/

import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearAllData = () => {
    AsyncStorage.clear()
}

export const getAllData = async () => {
    const keys = await AsyncStorage.getAllKeys();
    let results = []
    for (let key of keys) {
        let result = await getData(key)
        results.push(result)
    }

    return results
}

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

export const bookmarkExists = async (value, folder) => {
    const bookmarkData = await getData("bookmarks")
    
    if (bookmarkData) {
        if (bookmarkData[folder]) {
            if (bookmarkData[folder].includes(value)) {
                return true;
            }
        }
    }

    return false;
}

export const setBookmark = async (value, folder) => {
    let bookmarkData = await getData("bookmarks")
    if (bookmarkData) {
        if (bookmarkData.hasOwnProperty(folder)) {
            bookmarkData[folder].push(value)
        }
        else {
            bookmarkData[folder] = [value]
        }
    }
    else {
        console.log('happening')
        bookmarkData = {[folder]: [value]}
    }
    storeData(bookmarkData, "bookmarks")
}

export const delBookmark = async (value, folder) => {
    let bookmarkData = await getData("bookmarks")
    const index = bookmarkData[folder].indexOf(value)
    bookmarkData[folder].splice(index, 1)
    storeData(bookmarkData, "bookmarks")
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

export const dictEntryExists = (value) => {
    for (entry of dictionary) {
        if (entry.traditional == value || entry.simplified == value) {
            return true;
        }
    }
    return false;
}

export const returnDictEntry = (simpTrad, py) => {
    for (let entry of dictionary) {
        if (entry.simplified == simpTrad || entry.traditional == simpTrad) {
            if (entry.pinyin == py) {
                return entry;
            }
        }
    }
    return null;
}

export const returnMatchingEntries = (simpTrad) => {
    const matchingEntries = dictionary.filter(entry => 
        entry.simplified == simpTrad ||
        entry.traditional == simpTrad
    )

    return matchingEntries;
}