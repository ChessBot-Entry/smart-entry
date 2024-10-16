import { ConfigData, ConfigName, DefaultConfig } from "src/common/config"

export class ConfigManager {
    storedConfig: Partial<ConfigData>
    private static _instance?: ConfigManager

    static get instance() {
        return ConfigManager._instance
    }

    static init() {
        if (!ConfigManager._instance)
            ConfigManager._instance = new ConfigManager()
    }

    // todo: 속성 제대로 나오게 하기
    static get<T extends ConfigName>(key: T): ConfigData[T] {
        return ConfigManager._instance?.storedConfig[key] ?? DefaultConfig[key]
    }

    private constructor() {
        this.storedConfig = {}
        window.addEventListener("message", this.onMessage.bind(this))
        this.postMessage({"initialized": true})
    }

    private postMessage(message: any) {
        window.postMessage({SmartEntryScript: message})
    }

    private onMessage(event: any) {
        if (!event.data.SmartEntryPopup)
            return

        const data = event.data.SmartEntryPopup

        for (const key in data) {
            if (key in ConfigSetters) { // 이러면 암시적으로 key 타입은 ConfigName인 게 아닌가???
                let newVal = ConfigSetters[key as ConfigName]?.(data[key])

                if (newVal == null)
                    newVal = data[key]
                else {
                    this.postMessage({
                        [key]: newVal
                    })
                }

                this.storedConfig[key as ConfigName] = newVal
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