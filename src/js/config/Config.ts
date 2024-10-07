export type ConfigName = keyof typeof DefaultConfig

export const DefaultConfig = {
    "handleGraphic.enabled": true,
    "handleGraphic.alpha": 1,

    "handleToggle.enabled": false
} as const