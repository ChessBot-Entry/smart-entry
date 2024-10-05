async function sendMessage(obj) {
    const queryTab = await chrome.tabs.query({active: true, currentWindow: true})
    const firstTab = queryTab[0]
    
    if (firstTab && firstTab.id)
        chrome.tabs.sendMessage(firstTab.id, obj)
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
    {
        const select = document.querySelector('#handleToggle')
        const toggle =  select.querySelector('.toggle_btn')

        let enabled = (await chrome.storage.sync.get("handleToggle.enabled"))["handleToggle.enabled"]
        if (enabled == null) enabled = true
        
        toggle.checked = enabled

        toggle.addEventListener('click', (ev) => {
            sendMessage({"handleToggle.enabled": toggle.checked})
            chrome.storage.sync.set({"handleToggle.enabled": toggle.checked})
        })
    }

    {
        const select = document.querySelector('#handleGraphic')
        const toggle =  select.querySelector('.toggle_btn')

        let enabled = (await chrome.storage.sync.get("handleGraphic.enabled"))["handleGraphic.enabled"]
        if (enabled == null) enabled = false
        
        toggle.checked = enabled

        toggle.addEventListener('click', (ev) => {
            sendMessage({"handleGraphic.enabled": toggle.checked})
            chrome.storage.sync.set({"handleGraphic.enabled": toggle.checked})
        })
    }

    setToggleAnimation()
}

initConfig()