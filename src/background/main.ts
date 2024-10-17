import { DefaultConfig } from 'src/common/config.ts'

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