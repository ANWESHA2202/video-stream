let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let timer = document.querySelector(".timer");

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
            let videoURL = URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";

            a.click();
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