import { DropdownSearchManager } from "./fix/dropdownSearch";
import { HandleGraphicManager } from "./fix/HandleGraphic";
import { HandleToggleManager } from "./fix/HandleToggle";
import { makeWrap } from "src/common/utils/wrap";

export default class SmartEntry {
    constructor() {
        console.log("SmartEntry 로드 성공")

        const _initStage = Entry.Stage.prototype.initStage
        Entry.Stage.prototype.initStage = makeWrap(_initStage, function (callNext, canvas: any) {
            callNext(canvas)
            HandleToggleManager.init()
            HandleGraphicManager.init()
            DropdownSearchManager.init()
            Entry.Stage.prototype.initStage = _initStage
        })

        const _entryInit = Entry.init
        Entry.init = makeWrap(_entryInit, function(callNext, ...args: any[]) {
            callNext(...args)
            Entry.init = _entryInit
        })
    }
}

