import { ConfigName, DefaultConfig } from "./Config"

export class ConfigManager {
    storedConfig: Partial<typeof DefaultConfig>
    private static _instance: ConfigManager

    static get instance() {
        return ConfigManager._instance
    }

    static init() {
        if (!ConfigManager._instance)
            ConfigManager._instance = new ConfigManager()
    }

    private constructor() {
        this.storedConfig = {}
        window.addEventListener("message", this.onMessage.bind(this))
    }

    onMessage(event: any) {
        if (!event.data.SmartEntryPopup)
            return

        const data = event.data.SmartEntryPopup

        for (const key in data) {
            if (key in ConfigSetters) { // 이러면 암시적으로 key 타입은 ConfigName인 게 아닌가???
                let newVal = ConfigSetters[key as ConfigName]?.(data[key])

                if (newVal == null)
                    newVal = data[key]
                else {
                    window.postMessage({
                        SmartEntryScript: {
                            [key]: data[key]
                        }
                    })
                }

                this.storedConfig[key as ConfigName] == data[key]
            }
        }
    }
}

const ConfigSetters: Partial<Record<ConfigName, Function>> = {}

export const ConfigSetter = (configKey: ConfigName) => {
    return (target: Function, descriptor: ClassMethodDecoratorContext) => {
        ConfigSetters[configKey] = target
    }
}