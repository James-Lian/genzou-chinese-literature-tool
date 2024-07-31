// for storing settings variables, etc. 

// async storage?

// true for light theme, false for dark theme
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

export var previousScrollTop = null;
export var previousScrollBottom = null;

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