// AsyncStorage for storing information...
/*
@bookmarks: for saving phrases and terms (object: {uncategorized: []})
@files: for saving editor text (array)
@history: for saving search history (object: {dict (array), search (array)})
@system-info: for saving system info like themes and stuff (object: {welcomed, ?theme, restoreHistory, prevText (array), ?currVoice})
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

// true for success, false for failure
export const createBookmarkFolder = async (folder) => {
    let bookmarkData = await getData("bookmarks")
    if (bookmarkData) {
        if (bookmarkData.hasOwnProperty(folder)) {
            return false;
        }
        else {
            bookmarkData[folder] = []
        }
    }
    else {
        bookmarkData = {[folder]: []}
    }
    await storeData(bookmarkData, "bookmarks")
    return true;
}

export const deleteBookmarkFolders = async (folders) => {
    let bookmarkData = await getData("bookmarks")
    if (bookmarkData) {
        for (let folder of folders) {
            if (bookmarkData.hasOwnProperty(folder)) {
                delete bookmarkData[folder];
            }
        }
    }

    await storeData(bookmarkData, "bookmarks")
}

export const getBookmarkFolderContents = async (folder) => {
    let bookmarkData = await getData("bookmarks")
    if (bookmarkData) {
        if (bookmarkData.hasOwnProperty(folder)) {
            return bookmarkData[folder]
        }
    }
    return null
}

export const setBookmark = async (values, folder) => {
    let bookmarkData = await getData("bookmarks")
    if (bookmarkData) {
        if (bookmarkData.hasOwnProperty(folder)) {
            for (let value of values) {
                bookmarkData[folder].push(value)
            }
        }
        else {
            bookmarkData[folder] = [...values]
        }
    }
    else {
        bookmarkData = {[folder]: [...values]}
    }
    storeData(bookmarkData, "bookmarks")
}

export const delBookmark = async (values, folder) => {
    let bookmarkData = await getData("bookmarks")
    for (let value of values) {
        const index = bookmarkData[folder].indexOf(value)
        bookmarkData[folder].splice(index, 1)
    }
    storeData(bookmarkData, "bookmarks")
}

export const moveBookmark = async (values, oldFolder, newFolder) => {
    for (let value of values) {
        await delBookmark([value], oldFolder)
        await setBookmark([value], newFolder)
    }
}

export const reorderBookmarks = async (value, folder, direction) => {
    let bookmarkData = await getData("bookmarks")
    const fromIndex = bookmarkData[folder].indexOf(value)
    if (fromIndex + direction >= 0 && fromIndex + direction < bookmarkData[folder].length) {
        bookmarkData[folder].splice(fromIndex, 1);
        bookmarkData[folder].splice(fromIndex + direction, 0, value)
        storeData(bookmarkData, "bookmarks")
    }
}

export const combineBookmarkFolders = async (folders, newFolder) => {
    let bookmarkData = await getData("bookmarks")

    let values = []

    for (let folder of folders) {
        for (let value of bookmarkData[folder]) {
            if (!values.includes(value)) {
                values.push(value);
            }
        }
        await deleteBookmarkFolders([folder])
    }

    await setBookmark(values, newFolder)
}

export const getWelcomed = async () => {
    let systemData = await getData("system-info");

    if (systemData) {
        console.log(systemData)
        return systemData["welcomed"];
    } else {
        return false;
    }
}

export const setWelcomed = async (state) => {
    let systemData = await getData("system-info");

    if (systemData) {
        systemData["welcomed"] = state;
    } else {
        systemData = {"welcomed": state};
    }

    storeData(systemData, "system-info")
}

export const setPrevText = async (txt) => {

}

export const getTheme = async () => {
    let systemData = await getData("system-info");

    if (systemData) {
        if (systemData.hasOwnProperty("theme")) {
            return systemData["theme"]
        } else {
            systemData={"theme" : "light"};
            storeData(systemData, "system-info")
            return "light"
        }
    } else {
        systemData = {"theme": "light"};
        storeData(systemData, "system-info")
        return "light"
    }

}

// config and ux variables
export var theme = "light";

export const setTheme = async (them) => {
    theme = them;
    let systemData = await getData("system-info");

    if (systemData) {
        systemData["theme"] = them;
    } else {
        systemData = {"theme": them};
    }

    storeData(systemData, "system-info")
}

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

export const returnMatchingEntries = (simpTrad) => {
    const matchingEntries = dictionary.filter(entry => 
        entry.simplified == simpTrad ||
        entry.traditional == simpTrad
    )

    return matchingEntries;
}