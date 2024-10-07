import { DefaultConfig } from "./js/config/Config"

async function sendMessage(obj: any) {
    const queryTab = await chrome.tabs.query({active: true, currentWindow: true})
    const firstTab = queryTab[0]

    if (firstTab && firstTab.id)
        chrome.tabs.sendMessage(firstTab.id, obj)
}

chrome.runtime.onMessage.addListener(async (message, sender) => {
    if (!message.SmartEntryScript)
        return

    const data = message.SmartEntryScript

    if (data.initialized) {
        const data = Object.assign(DefaultConfig, await chrome.storage.sync.get())
        
        if (sender.tab?.id)
            chrome.tabs.sendMessage(sender.tab.id, data)
    }
})