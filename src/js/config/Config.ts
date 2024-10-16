export type ConfigName = keyof ConfigData


// 화나서 인터페이스 추가함
export interface ConfigData {
    "handleGraphic.enabled": boolean
    "handleGraphic.alpha": number

    "handleToggle.enabled": boolean
}

export type ConfigUIType = "boolean" | "int" | "number" | "range"

export interface ConfigUIData {
    type: ConfigUIType
    name: string
    description: string
    range?: [number, number, number?]
}

export const ConfigUIInfo: Record<keyof ConfigData, ConfigUIData> = {
    "handleGraphic.enabled": {
        type: "boolean",
        name: "더 나은 오브젝트 조절",
        description: "오브젝트 조절 버튼의 그래픽을 개선합니다."
    },
    "handleGraphic.alpha": {
        type: "range",
        name: "오브젝트 조절 투명도",
        description: "오브젝트 조절 버튼의 투명도를 설정합니다."
    },

    "handleToggle.enabled": {
        type: "boolean",
        name: "Ctrl로 오브젝트 조절",
        description: "오브젝트 조절을 Ctrl 키로 가능하게 합니다."
    }
}

export const ConfigUI:ConfigName[] = [
    "handleGraphic.enabled",
    "handleToggle.enabled"
]

export const DefaultConfig: ConfigData = {
    "handleGraphic.enabled": true,
    "handleGraphic.alpha": 1,

    "handleToggle.enabled": false
} as const