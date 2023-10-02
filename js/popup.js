document.addEventListener("DOMContentLoaded", () => {
    // Selectors
    const startVideoButton = document.querySelector("button#start_video")
    // const stopVideoButton = document.querySelector("button#stop_video")

    // event listener
    startVideoButton.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "request_recording"}, function(response) {
                if(!chrome.runtime.lastError) {
                    console.log(response)
                } else {
                    console.log(chrome.runtime.lastError, 'Error Pop up')
                }
            })
        })
    })
    
    
    // stopVideoButton.addEventListener("click", () => {
    //     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //         chrome.tabs.sendMessage(tabs[0].id, {action: "stop_recording"}, function(response) {
    //             if(!chrome.runtime.lastError) {
    //                 console.log(response)
    //             } else {
    //                 console.log(chrome.runtime.lastError, 'Error Pop up')
    //             }
    //         })
    //     })
    // })

    
})