export const ConfigInfo: Record<string, ConfigUIDataAll> = {
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
        defaultValue: 1
    },

    "handleToggle.enabled": {
        type: "boolean",
        name: "Ctrl로 오브젝트 조절",
        description: "오브젝트 조절을 Ctrl 키로 가능하게 합니다.",
        defaultValue: false
    }
} as const


export interface ConfigUIRealType {
    "boolean": boolean
    "range": number
    "number": number
}

// 자동으로 추론시키는 법을 모르겠네
type ConfigUIDataAll = ConfigUIData<"number">
                        | ConfigUIData<"boolean">
                        | ConfigUIData<"range">

export type ConfigUIType = keyof ConfigUIRealType

export type ConfigName = keyof typeof ConfigInfo 

export type ConfigData = {
    [T in ConfigName] : typeof ConfigInfo[T]
}

export interface ConfigUIData<T extends ConfigUIType> {
    type: T
    name: string
    description: string
    defaultValue: ConfigUIRealType[T]
}

export const ConfigUI:ConfigName[] = [
    "handleGraphic.enabled",
    "handleToggle.enabled"
]

export const DefaultConfig: ConfigData = Object.assign({}, ...Object.entries(ConfigInfo).map(([id, data]) => ({[id]: data.defaultValue})))