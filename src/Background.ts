async function sendMessage(obj: any) {
    const queryTab = await chrome.tabs.query({active: true, currentWindow: true})
    const firstTab = queryTab[0]

    if (firstTab && firstTab.id)
        chrome.tabs.sendMessage(firstTab.id, obj)
}

chrome.runtime.onMessage.addListener(async (message) => {
    if (!message.SmartEntryScript)
        return

    const data = message.SmartEntryScript

    if (data.initialized) {
        const welcome = {
            "handleToggle.enabled":  await chrome.storage.sync.get("handleToggle.enabled") || false,
            "handleGraphic.enabled":  await chrome.storage.sync.get("handleGraphic.enabled") || false
        }
        
        sendMessage(welcome)
    }
})