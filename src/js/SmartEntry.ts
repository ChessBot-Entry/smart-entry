import { IEntry } from "../../types/entry.js"

export default class SmartEntry {
    EntryObject: IEntry
    constructor(Entry: IEntry) {
        this.EntryObject = Entry
        console.log("test")
    }
}