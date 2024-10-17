import loading_image from "assets/images/loading.svg"
import { Suspense } from "react"
import { ConfigData, ConfigInfo, ConfigName, ConfigUI, ConfigUIType, DefaultConfig } from "src/common/config"
import { ConfigSlider, ConfigToggleButton } from "./popupComponent"
import styled from "styled-components"

const configPromise = readConfig()
let currentConfig: ConfigData
let configStatus = 'pending'

async function readConfig() {
    currentConfig = Object.assign(DefaultConfig, await chrome.storage.sync.get()) as ConfigData
    configStatus = 'fulfilled'
}

const ConfigContainer = styled.div`
align-items: center;
padding: 8px 0px 8px 0px;
`;

const ConfigDescription = styled.p`
    font-size: 12px;
    color: #7f7f7f;
    margin: 2px 0;
`

function PopupConfig() {
    if (configStatus === 'pending')
        throw configPromise

    const configComponentMap: Record<ConfigUIType, ((id: ConfigName, value: any) => React.JSX.Element) | null> = {
        "boolean": (id, value) => <ConfigToggleButton id={id} defaultValue={value}/>,
        "number": null,
        "range": (id, value) => <ConfigSlider id={id} defaultValue={value}/>
    }

    const configComponents = ConfigUI.map(id => {
        const info = ConfigInfo[id]
        const targetComponent = configComponentMap[info.type]

        return (
            <div>
                <ConfigContainer>
                    <span style={{fontWeight: 'bold'}}>{ info.name }</span>
                    { targetComponent?.(id, currentConfig[id]) ?? null }
                    <ConfigDescription>
                        { info.description }
                    </ConfigDescription>
                </ConfigContainer>
                
            </div>
        )
    })

    return configComponents
}

const LoadingImage = styled.img`
    margin: 0 auto;
    display: block;
`

export default function Popup() {
    return (
    <div id="box">
        <Suspense fallback={ <LoadingImage src={loading_image} /> }>
            <PopupConfig />
        </Suspense>
    </div>    
    )
}