setTimeout(() => {
    if (db) {

        let dbVideoTransaction = db.transaction('video', 'readonly');
        let videoStore = dbVideoTransaction.objectStore('video');
        let videoRequest = videoStore.getAll();

        videoRequest.onsuccess = (e) => {
            let videoResults = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            videoResults.forEach((videoObj) => {
                let mediaElement = document.createElement("div");
                mediaElement.setAttribute("class", "media-cont");
                mediaElement.setAttribute("id", videoObj.id);

                let videoURL = URL.createObjectURL(videoObj.blobData);
                mediaElement.innerHTML = `
                    <div class="media">
                        <video autoplay loop src="${videoURL}"></video>
                    </div>
                    <div class="delete action-btn">DELETE</div>
                    <div class="download action-btn">DOWNLOAD</div>
                `;

                galleryCont.appendChild(mediaElement);

                let deleteBtn = mediaElement.querySelector(".delete");
                let downloadBtn = mediaElement.querySelector(".download");
                deleteBtn.addEventListener("click", deleteListener)
                downloadBtn.addEventListener("click", downloadListener)



            })
        }

        let dbImageTransaction = db.transaction('image', 'readonly');
        let imageStore = dbImageTransaction.objectStore('image');
        let imageRequest = imageStore.getAll();

        imageRequest.onsuccess = (e) => {
            let imageResults = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            imageResults.forEach((imageObj) => {
                let mediaElement = document.createElement("div");
                mediaElement.setAttribute("class", "media-cont");
                mediaElement.setAttribute("id", imageObj.id);

                let imageURL = imageObj.blobData;
                mediaElement.innerHTML = `
                    <div class="media">
                        <img src="${imageURL}" />
                    </div>
                    <div class="delete action-btn">DELETE</div>
                    <div class="download action-btn">DOWNLOAD</div>
                `;
                galleryCont.appendChild(mediaElement);
                let deleteBtn = mediaElement.querySelector(".delete");
                let downloadBtn = mediaElement.querySelector(".download");
                deleteBtn.addEventListener("click", deleteListener)
                downloadBtn.addEventListener("click", downloadListener)

            })
        }
    }
}, 100)

function deleteListener(e) {
    let id = e.target.parentElement.getAttribute("id");
    if (id.slice(0, 3) === "vdo") {
        let dbVideoTransaction = db.transaction('video', 'readwrite');
        let videoStore = dbVideoTransaction.objectStore('video');
        videoStore.delete(id);
    } else if (id.slice(0, 3) === "img") {
        let dbImageTransaction = db.transaction('image', 'readwrite');
        let imageStore = dbImageTransaction.objectStore('image');
        imageStore.delete(id);
    }
    e.target.parentElement.remove();
}

function downloadListener(e) {
    let id = e.target.parentElement.getAttribute("id");
    if (id.slice(0, 3) === "vdo") {
        let dbVideoTransaction = db.transaction('video', 'readwrite');
        let videoStore = dbVideoTransaction.objectStore('video');
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;

            let a = document.createElement("a");
            a.href = URL.createObjectURL(videoResult.blobData);
            a.download = "stream.mp4";
            a.click();
        }
    } else if (id.slice(0, 3) === 'img') {
        let dbImageTransaction = db.transaction('image', 'readwrite');
        let imageStore = dbImageTransaction.objectStore('image');
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;

            let a = document.createElement("a");
            a.href = imageResult.blobData;
            a.download = "stream.jpg";
            a.click();
        }
    }
}