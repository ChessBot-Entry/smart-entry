export const sendMessage = async (value: any) => {
    const queryTab = await chrome.tabs.query({active: true, currentWindow: true})
    const firstTab = queryTab[0]
    
    if (firstTab && firstTab.id)
        chrome.tabs.sendMessage(firstTab.id, value)
}