import SmartEntry from "./js/SmartEntry.ts";
import { waitForElement } from "./js/Inject.ts";

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

    const entryjs = await waitForElement(document.body, entryjsFinder,
        { attributes: false, childList: true, subtree: false })

    if ('Entry' in window) {
        // TODO: global 타입 적용
        window.SmartEntry = new SmartEntry()
        return
    }
    
    entryjs.addEventListener('load', () => {
        if ('Entry' in window) window.SmartEntry = new SmartEntry()
        else console.warn("Entry 객체를 찾지 못했습니다")
    })
})()