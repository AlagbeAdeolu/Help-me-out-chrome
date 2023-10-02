console.log("Hi, I have been injected whoopie!!!")

var recorder = null;
var chunks = []; // Array to store video data chunks

function onAccessApproved(stream) {
    recorder = new MediaRecorder(stream);

    recorder.start();

    recorder.onstop = function () {
        stream.getTracks().forEach(function (track) {
            if (track.readyState === "live") {
                track.stop();
            }
        });
    }

    recorder.ondataavailable = function (event) {
        let recordedBlob = event.data;
        chunks.push(recordedBlob); // Store the chunk in the array
        console.log(chunks)

        // Simulate sending the chunk to the server by logging it to the console
        console.log("Simulated server received chunk:", recordedBlob);
        sendChunkToServer(recordedBlob)
        let url = URL.createObjectURL(recordedBlob);
        console.log(url);

        // You can also simulate assembling the chunks into a complete video here if needed

    }

    function sendChunkToServer(chunk) {
        // var formData = new FormData();
        // formData.append('blob', chunk, { type: 'video/webm' });
        // // formData.append('videoId', '23JIGstt');

        // // Make an HTTP POST request to your server
        // fetch("https://druth-video-api.onrender.com/upload_video", {
        //     method: "POST",
        //     body: formData,
        // })
        //     .then(response => {
        //         if (response.ok) {
        //             console.log("Chunk successfully sent to the server.");
        //         } else {
        //             console.error("Failed to send chunk to the server.");
        //         }
        //     })
        //     .catch(error => {
        //         console.error("Error sending chunk to the server:", error);
        //     });
        const formData = new FormData();
        formData.append('video', chunk, { type: 'video/webm' });

        fetch('https://druth-video-api.onrender.com/upload_video', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        })
            .then(response => {
                if (response.ok) {
                    console.log("Chunk successfully sent to the server.");
                } else {
                    console.error("Failed to send chunk to the server.");
                }
            })
            .catch(error => {
                console.error("Error sending chunk to the server:", error);
            });
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "request_recording") {
        console.log("requesting recording")

        sendResponse(`processed: ${message.action}`);

        navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: {
                width: 9999999999,
                height: 9999999999
            }
        }).then((stream) => {
            onAccessApproved(stream)
        })
    }

    if (message.action === "stop_recording") {
        console.log("stopping video");
        sendResponse(`processed: ${message.action}`);
        if (!recorder) return console.log("no recorder")

        recorder.stop();
    }
})
