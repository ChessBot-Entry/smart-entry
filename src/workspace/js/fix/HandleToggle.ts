import { DefaultConfig } from "../../../common/config"
import { ConfigManager, ConfigSetter } from "../configManager"
import { makeWrap, WrappedFunc, Wrapper } from "../../../common/utils/Wrap"


// todo: d.ts로 이동
interface IEntryObject {
    getLock: Function
}

interface IEntryStage {
    selectedObject?: IEntryObject
    handle: any
}

export class HandleToggleManager {
    private static _instance?: HandleToggleManager

    static get instance() {
        return HandleToggleManager._instance
    }

    static init(enabled?: boolean) {
        enabled = enabled ?? ConfigManager.get("handleToggle.enabled")
        
        if (!HandleToggleManager._instance)
            HandleToggleManager._instance = new HandleToggleManager(enabled)
    }

    @ConfigSetter("handleToggle.enabled")
    static toggle(value: boolean) {
        HandleToggleManager._instance?.toggle(value)
    }

    private constructor(enabled: boolean) {
        const stage = Entry.stage
        const stageHandle = stage.handle

        let isEdit = false
        let isCtrl = false

        this.ctrlPressListener = (e) => {
            if (e.key === 'Control') {
                isCtrl = true
                Entry.stage.updateObject()
            }
        }
    
        this.ctrlUpListener = (e) => {
            if (e.key === 'Control') {
                isCtrl = false
                Entry.stage.updateObject()
            }
        }

        if (enabled) {
            Entry.addEventListener('keyPressed', this.ctrlPressListener)
            Entry.addEventListener('keyUpped', this.ctrlUpListener)
        }

        const _editStart = stageHandle.onEditStartFunction
        const _editEnd = stageHandle.onEditEndFunction

        this.editStartHook = function(callNext, ...args) {
            isEdit = true
            return callNext(args)
        }

        this.editEndHook = function(callNext, ...args) {
            isEdit = false
            return callNext(args)
        }

        stageHandle.onEditStartFunction = makeWrap(_editStart, this.editStartHook)
        stageHandle.onEditEndFunction = makeWrap(_editEnd, this.editEndHook)

        if (!enabled) {
            stageHandle.onEditStartFunction.toggleWrapper(this.editStartHook, false)
            stageHandle.onEditEndFunction.toggleWrapper(this.editEndHook, false)
        }

        this.updateObjectHook = function(this: IEntryStage, callNext) {
            const obj = this.selectedObject
            if (obj) {
                const _tempGetLock = obj.getLock
                const isLock = _tempGetLock.call(obj)
                obj.getLock = () => isEdit ? false : (isCtrl ? isLock : true)
                callNext()
                this.handle.setDraggable(!isLock)
                obj.getLock = _tempGetLock
            }
            else {
                callNext()
            }
        }

        stage.updateObject = makeWrap(stage.updateObject, this.updateObjectHook)

        if (!enabled) {
            stage.updateObject.toggleWrapper(this.updateObjectHook, false)
        }

        this.enabled = enabled
    }

    toggle(value: boolean) {
        if (value === this.enabled)
            return

        this.enabled = value
        const stage = Entry.stage;
        const stageHandle = stage.handle;

        (stageHandle.onEditStartFunction as WrappedFunc<Function>).toggleWrapper(this.editStartHook, value);
        (stageHandle.onEditEndFunction as WrappedFunc<Function>).toggleWrapper(this.editEndHook, value);

        (stage.updateObject as WrappedFunc<Function>).toggleWrapper(this.updateObjectHook, value)

        if (value) {
            Entry.addEventListener('keyPressed', this.ctrlPressListener)
            Entry.addEventListener('keyUpped', this.ctrlUpListener)
        }
        else {
            Entry.removeEventListener('keyPressed', this.ctrlPressListener)
            Entry.removeEventListener('keyUpped', this.ctrlUpListener)
        }
        
        stage.updateObject()
    }

    private enabled: boolean = false

    private updateObjectHook: Wrapper<Function>
    private editStartHook: Wrapper<Function>
    private editEndHook: Wrapper<Function>

    private ctrlPressListener: (e: KeyboardEvent) => void
    private ctrlUpListener: (e: KeyboardEvent) => void
}