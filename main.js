const video = document.querySelector('video')

const loadFaceAPI = async () => {
    await faceapi.nets.faceLandmark68Net.loadFromUri('./models')
    await faceapi.nets.faceRecognitionNet.loadFromUri('./models')
    await faceapi.nets.tinyFaceDetector.loadFromUri('./models')
    await faceapi.nets.faceExpressionNet.loadFromUri('./models')

}

function getCameraStream() {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: {} })
            .then(streams => {
                video.srcObject = streams
            })
    }
}

video.addEventListener('playing', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = {
        width: video.videoWidth,
        height: video.videoWidth
    }

    setInterval(async () => {
        const detects = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks().withFaceExpressions()

        const reSize = faceapi.resizeResults(detects, displaySize)
        canvas.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height)
        faceapi.draw.drawDetections(canvas, reSize)
        faceapi.draw.drawFaceLandmarks(canvas, reSize)
        faceapi.draw.drawFaceExpressions(canvas,reSize)
    }, 300);
});

loadFaceAPI().then(getCameraStream)

