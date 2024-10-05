import { HandleGraphicManager } from "./fix/HandleGraphic"
import { HandleToggleManager } from "./fix/HandleToggle"

export class ConfigManager {
    constructor() {

    }

    init() {
        if (this.initialized)
            return

        this.initialized = true

        window.postMessage({
            SmartEntryScript: {
                initialized: true
            }
        })
        window.addEventListener("message", this.onMessage.bind(this))
    }

    onMessage(event: any) {
        if (!event.data.SmartEntryPopup)
            return

        const data = event.data.SmartEntryPopup
        
        if ("handleGraphic.enabled" in data)
            HandleGraphicManager.instance.toggle(data["handleGraphic.enabled"])

        if ("handleToggle.enabled" in data)
            HandleToggleManager.instance.toggle(data["handleToggle.enabled"])
    }

    private initialized = false
}