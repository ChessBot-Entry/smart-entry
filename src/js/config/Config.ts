export type ConfigName = keyof ConfigData


// 화나서 인터페이스 추가함
export interface ConfigData {
    "handleGraphic.enabled": Boolean
    "handleGraphic.alpha": number

    "handleToggle.enabled": Boolean
}

export const DefaultConfig: ConfigData = {
    "handleGraphic.enabled": true,
    "handleGraphic.alpha": 1,

    "handleToggle.enabled": false
} as const