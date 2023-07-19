let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let timer = document.querySelector(".timer");
let filterColor = 'transparent';

let recordFlag = false;
let chunks = [];

let recorder;
let constraints = {
    video: true,
    audio: true
}

navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;
        recorder = new MediaRecorder(stream);

        recorder.addEventListener("start", (e) => {
            chunks = [];
        })

        recorder.addEventListener("dataavailable", (e) => {
            chunks.push(e.data);
        })
        recorder.addEventListener("stop", (e) => {
            let blob = new Blob(chunks, { type: 'video/mp4' });
            if (db) {
                let videoID = shortid();
                let dbTransaction = db.transaction('video', 'readwrite');
                let videoStore = dbTransaction.objectStore('video')
                let videoEntry = {
                    id: `vdo-${videoID}`,
                    blobData: blob
                }
                videoStore.add(videoEntry);
            }
            // let videoURL = URL.createObjectURL(blob);
            // let a = document.createElement("a");
            // a.href = videoURL;
            // a.download = "stream.mp4";

            // a.click();
        })
    })


recordBtnCont.addEventListener("click", (e) => {
    if (!recorder) return;

    recordFlag = !recordFlag;

    if (recordFlag) {
        recorder.start();
        recordBtn.classList.add("scale-record");

        startTimer();

    } else {
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }
})

let timerID;
let counter = 0;


function startTimer() {
    timer.style.display = "block";

    function displayTimer() {
        let totalSeconds = counter;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        totalSeconds %= 60;
        let seconds = totalSeconds;

        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;
        counter++;

    }
    timerID = setInterval(displayTimer, 1000)
}

function stopTimer() {
    clearInterval(timerID);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
}

let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filter) => {
    filter.addEventListener("click", (e) => {

        filterColor = getComputedStyle(filter).getPropertyValue("background-color");
        console.log(filterColor);
        filterLayer.style.backgroundColor = filterColor;
    })
})

captureBtnCont.addEventListener("click", (e) => {
    captureBtn.classList.add("scale-capture");
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);
    tool.fillStyle = filterColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL();

    if (db) {
        let imageID = shortid();
        let dbTransaction = db.transaction('image', 'readwrite');
        let imageStore = dbTransaction.objectStore('image')
        let imageEntry = {
            id: `img-${imageID}`,
            blobData: imageURL
        }
        imageStore.add(imageEntry);
    }
    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 500)

})