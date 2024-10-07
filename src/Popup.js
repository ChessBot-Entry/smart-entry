// todo: ts로 변경 + react 적용 + js에서 옵션 생성하게

import { DefaultConfig } from "./js/config/Config"

async function sendMessage(obj) {
    const queryTab = await chrome.tabs.query({active: true, currentWindow: true})
    const firstTab = queryTab[0]
    
    if (firstTab && firstTab.id)
        chrome.tabs.sendMessage(firstTab.id, obj)
}

async function getConfig(key) {
    return await chrome.storage.sync.get(key)[key]
}

function setToggleAnimation() {
    document.querySelectorAll('.select').forEach(function(select) {
        const toggleBtn = select.querySelector('.toggle_btn');
        const toggle = select.querySelector('.toggle');
        const insideToggle = select.querySelector('.inside_toggle');
    
        if (toggleBtn.checked) {
            toggle.style.backgroundColor = '#FE5448'; 
            insideToggle.style.transform = 'translateX(19px)';
        } else {
            toggle.style.backgroundColor = '#5F5F5F'; 
            insideToggle.style.transform = 'translateX(0px)'; 
        }
    
        select.addEventListener('click', function() {
            toggleBtn.click()
    
            if (toggleBtn.checked) {
                toggle.style.backgroundColor = '#FE5448'; 
                insideToggle.style.transform = 'translateX(19px)'; 
            } else {
                toggle.style.backgroundColor = '#5F5F5F'; 
                insideToggle.style.transform = 'translateX(0px)'; 
            }
        });

        toggleBtn.addEventListener('click', function(ev) {
            ev.stopPropagation()
        });
    });
}

async function initConfig() {
    const config = await chrome.storage.sync.get()
    {
        const select = document.querySelector('#handleToggle')
        const toggle =  select.querySelector('.toggle_btn')

        let enabled = config["handleToggle.enabled"]
        if (enabled == null) enabled = DefaultConfig["handleToggle.enabled"]
        
        toggle.checked = enabled

        toggle.addEventListener('click', (ev) => {
            sendMessage({"handleToggle.enabled": toggle.checked})
            chrome.storage.sync.set({"handleToggle.enabled": toggle.checked})
        })
    }

    {
        const select = document.querySelector('#handleGraphic')
        const toggle =  select.querySelector('.toggle_btn')

        let enabled = config["handleGraphic.enabled"]
        if (enabled == null) enabled = DefaultConfig["handleGraphic.enabled"]
        
        toggle.checked = enabled

        toggle.addEventListener('click', (ev) => {
            sendMessage({"handleGraphic.enabled": toggle.checked})
            chrome.storage.sync.set({"handleGraphic.enabled": toggle.checked})
        })
    }

    setToggleAnimation()

    document.querySelector("#toggleFieldset").disabled = false
}

initConfig()