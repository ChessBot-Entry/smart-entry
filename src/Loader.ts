// TODO: https://github.com/crxjs/chrome-extension-tools/issues/695
// content script에서 main world 바로 사용 불가능
// loader 사용 시 스크립트 주입 속도 느려짐
// crx를 빼던가, 포크해서 고치던가, pr 적용 기다리던가

// @ts-expect-error
import mainScript from "./Main.ts?script&module"
import './css/Workspace.css';

const script = document.createElement('script')
script.src = chrome.runtime.getURL(mainScript)
script.type = 'module'
document.head.prepend(script)

chrome.runtime.onMessage.addListener((message) => {
    console.log(message)
    window.postMessage({SmartEntryPopup: message})
})

window.addEventListener("message", (event) => {
    if (event.data.SmartEntryScript) {
        console.log(event.data)
        chrome.runtime.sendMessage(event.data.SmartEntryScript)
    }
})