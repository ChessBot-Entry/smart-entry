import { StrictMode, Suspense, useState } from 'react'
import './css/popup.css'
import { ConfigData, ConfigName, ConfigUI, ConfigUIInfo, ConfigUIType, DefaultConfig } from './js/config/Config'
import { createRoot } from 'react-dom/client'

const sendMessage = async (value: any) => {
    const queryTab = await chrome.tabs.query({active: true, currentWindow: true})
    const firstTab = queryTab[0]
    
    if (firstTab && firstTab.id)
        chrome.tabs.sendMessage(firstTab.id, value)
}

async function readConfig() {
    currentConfig = await chrome.storage.sync.get() as ConfigData
    configStatus = 'fulfilled'
}

let currentConfig: ConfigData
const configPromise = readConfig()
let configStatus = 'pending'

interface ConfigToggleProps {
    id: ConfigName
    defaultValue: any
}

function ConfigToggleButton({id, defaultValue}: ConfigToggleProps) {
    const {name, description} = ConfigUIInfo[id]
    // const defaultValue = currentConfig[id] as boolean
    const [enabled, setEnabled] = useState(defaultValue)

    const clickToggle = () => {
        setEnabled(!enabled)
        
        // 어케 해결하지
        currentConfig[id] = !enabled as never
        sendMessage({[id]: !enabled})
    }

    return <div id="handleToggle" onClick={clickToggle} className="select">
        {name}
        <span className={`toggle ${enabled ? "toggle-checked" : ""}`}>
            <span className={`inside-toggle ${enabled ? "inside-toggle-checked" : ""}`}></span>
        </span>
    </div>
}

interface PopupComponentFuncArg {
    id: ConfigName
    defaultValue: any
}
type PopupComponentFunction = (data: PopupComponentFuncArg) => React.JSX.Element

function PopupConfig() {
    if (configStatus === 'pending') throw configPromise

    const configComponentMap: Record<ConfigUIType, ((id: ConfigName, value: any) => React.JSX.Element) | null> = {
        "boolean": (id, value) => <ConfigToggleButton id={id} defaultValue={value}/>,
        "int": null,
        "number": null,
        "range": null
    }

    const configComponents = ConfigUI.map(id => {
        const info = ConfigUIInfo[id]
        const targetComponent = configComponentMap[info.type]

        if (targetComponent) 
            return targetComponent(id, currentConfig[id])
        else
            return null
    })

    return configComponents
}

function Popup() {
    return (
    <Suspense>
      <div id="box">
        <PopupConfig />
      </div>
    </Suspense>
    )
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Popup />
    </StrictMode>,
)