function AddTypeGuard<T extends Record<string, ConfigUIDataAll>>(input: T) {
    return input
}

export const ConfigInfo = AddTypeGuard({
    "handleGraphic.enabled": {
        type: "boolean",
        name: "더 나은 오브젝트 조절",
        description: "오브젝트 조절 버튼의 그래픽을 개선합니다.",
        defaultValue: true
    },
    "handleGraphic.alpha": {
        type: "range",
        name: "오브젝트 조절 투명도",
        description: "오브젝트 조절 버튼의 투명도를 설정합니다.",
        defaultValue: 1,
        range: [0, 1, 0.005, false]
    },

    "handleToggle.enabled": {
        type: "boolean",
        name: "Ctrl로 오브젝트 조절",
        description: "오브젝트 조절을 Ctrl 키로 가능하게 합니다.",
        defaultValue: false
    }
})

export interface ConfigUIRealType {
    "boolean": boolean
    "range": number
    "number": number
}

type ConfigUIDataAdditionalRecord = {
    "range": { range: [number, number, number?, boolean?] }
} & Record<ConfigUIType, unknown>

export type ConfigUIData<T extends ConfigUIType> = ConfigUIDataDefault<T> & ConfigUIDataAdditionalRecord[T]

// 자동으로 추론시키는 법을 모르겠네
type ConfigUIDataAll = ConfigUIData<"number">
                        | ConfigUIData<"boolean">
                        | ConfigUIData<"range">

export type ConfigUIType = keyof ConfigUIRealType

export type ConfigName = keyof typeof ConfigInfo 

export type ConfigData = {
    [T in ConfigName] : ConfigUIRealType[typeof ConfigInfo[T]["type"]]
}

interface ConfigUIDataDefault<T extends ConfigUIType> {
    type: T
    name: string
    description: string
    defaultValue: ConfigUIRealType[T]
}

export const ConfigUI:ConfigName[] = [
    "handleGraphic.enabled",
    "handleGraphic.alpha",
    "handleToggle.enabled"
]

export const DefaultConfig: ConfigData = Object.assign({}, ...Object.entries(ConfigInfo).map(([id, data]) => ({[id]: data.defaultValue})))