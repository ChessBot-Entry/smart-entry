
interface HandleGraphicSet {
    resizeKnob: createjs.Graphics[]
    centerPoint: createjs.Graphics
}

const rotateKnobScaleNew = 0.3

export class HandleGraphicManager {
    private static _instance: HandleGraphicManager

    static get instance() {
        return HandleGraphicManager._instance
    }

    static init() {
        if (!HandleGraphicManager._instance)
            HandleGraphicManager._instance = new HandleGraphicManager()
    }

    private constructor() {
        const handle = Entry.stage.handle
        const createJSGraphics: typeof createjs.Graphics = handle.centerPoint.graphics.__proto__.constructor  

        const resizeKnobBackup: createjs.Graphics[] = []
        const resizeKnobNew: createjs.Graphics[] = []

        handle.knobs.forEach((shape: createjs.Shape) => {
            resizeKnobBackup.push(shape.graphics)

            const newGraphics = new createJSGraphics()
            .ss(0.2, 0, 0)
            .s('#d8d8d8')
            .beginFill('#ffffff')
            .rr(-4, -4, 8, 8, 1)
            .beginFill(handle.knobColor)
            .rr(-2.5, -2.5, 5, 5, 1)

            resizeKnobNew.push(newGraphics)

            shape.set({graphics: newGraphics})
        })
        
        const centerPointBackup = handle.centerPoint.graphics
        const centerPointNew = new createJSGraphics()
        .ss(2.2, 2, 0)
        .s('#FFFFFF')
        .beginFill(handle.centerColor)
        .dc(0, 0, 4.5)

        handle.centerPoint.set({graphics: centerPointNew})
        
        this.rotateKnobScaleBackup = handle.rotateKnob.scaleX

        handle.rotateKnob.scaleX = handle.rotateKnob.scaleY = rotateKnobScaleNew

        this.backupGraphics = {
            resizeKnob: resizeKnobBackup,
            centerPoint: centerPointBackup
        }

        this.newGraphics = {
            resizeKnob: resizeKnobNew,
            centerPoint: centerPointNew
        }

        this.enabled = true
    }

    toggle(value: Boolean) {
        if (value === this.enabled)
            return

        this.enabled = value

        const handle = Entry.stage.handle

        let graphicsDest: HandleGraphicSet
        let rotateScaleDest: number
        let alphaDest: number

        if (value) {
            graphicsDest = this.newGraphics
            rotateScaleDest = rotateKnobScaleNew
            alphaDest = this.newAlpha
        }
        else {
            graphicsDest = this.backupGraphics
            rotateScaleDest = this.rotateKnobScaleBackup
            alphaDest = 1
        }

        handle.knobs.forEach((shape: createjs.Shape, idx: number) => {
            shape.set({graphics: graphicsDest.resizeKnob[idx]})
            shape.alpha = alphaDest
        })

        handle.centerPoint.set({graphics: graphicsDest.centerPoint})

        handle.rotateKnob.scaleX = handle.rotateKnob.scaleY = rotateScaleDest

        handle.rotateKnob.alpha = handle.centerPoint.alpha = handle.directionArrow.alpha = alphaDest

        Entry.stage.updateObject()
    }

    setAlpha(value: number) {
        const handle = Entry.stage.handle
        handle.rotateKnob.alpha = handle.centerPoint.alpha = handle.directionArrow.alpha = this.newAlpha = value

        Entry.stage.updateObject()
    }

    private enabled: Boolean = false

    private newAlpha: number = 1
    private rotateKnobScaleBackup: number

    private backupGraphics: HandleGraphicSet
    private newGraphics: HandleGraphicSet
}