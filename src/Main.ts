import SmartEntry from "./js/SmartEntry.ts";
import { waitForElement } from "./js/Inject.ts";
import { ConfigManager } from "./js/config/WsConfigManager";

console.log("test");

ConfigManager.init();

(async () => {
    const entryjsFinder = () => {
        for (let script of Array.from(document.scripts)) {
            if (!script.src) continue

            let loc = script.src.split('/')
            let file = loc.pop()

            if (file == undefined) continue

            if (file.indexOf('?') !== -1)
                file = file.slice(0, file.indexOf('?'))

            if (file === 'entry.min.js' || file === 'entry.js')
                return script
        }
    }

    console.log("SmartEntry 시작")

    const entryjs = await waitForElement(document.body, entryjsFinder,
        { attributes: false, childList: true, subtree: false })

    if ('Entry' in window) {
        // TODO: global 타입 적용
        window.SmartEntry = new SmartEntry()
        return
    }
    console.log("entry.js 확인")
    
    entryjs.addEventListener('load', () => {
        if ('Entry' in window) {
            console.log("SmartEntry 객체 생성")
            window.SmartEntry = new SmartEntry()
        }
        else console.warn("Entry 객체를 찾지 못했습니다")
    })
})()