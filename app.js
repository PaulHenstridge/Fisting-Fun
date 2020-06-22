const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

const boxes = document.querySelectorAll('.box');
let model = null;
let isVideo =false;

canvas.width=window.innerWidth; 
canvas.height=window.innerHeight;



const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 1,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
};

const sound1 = new Howl({
    src: ['sounds/Hit1.wav']
  });
const sound2 = new Howl({
    src: ['sounds/Hit2.wav']
  });
const sound3 = new Howl({
    src: ['sounds/Death2.wav']
  });
const sound4= new Howl({
    src: ['sounds/Attack5.wav']
  });



const startVideo = () => {
    
        handTrack.startVideo(video).then((status) => {
            console.log("video started", status);
            if (status){
                isVideo = true;
                runDetection();
            } else {
                consile.log ("nae video")
            };
            
        });    
};

startButton.addEventListener('click', toggleVideo);

// stopButton.addEventListener('click', () => {
//     handTrack.stopVideo()
//     isVideo = false;
// });
    
function toggleVideo() {
    if (!isVideo) {
        startVideo();
        isVideo = true;
    } else {
        handTrack.stopVideo(video)
        isVideo = false;
    }
}


// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel;
});

function runDetection() {
    model.detect(video).then(predictions => {
        console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, video);

        if (predictions[0]){
            //NW
            if (predictions[0].bbox[0]< window.innerWidth/2 && predictions[0].bbox[1] < window.innerHeight/2){
                console.log("North West");              
                sound1.play();
            };
            //NE
            if (predictions[0].bbox[0] > window.innerWidth/2 && predictions[0].bbox[1] < window.innerHeight/2){
                console.log("NORTH EAST!");
                sound2.play();
            };
                //sw
            if (predictions[0].bbox[0]< window.innerWidth/2 && predictions[0].bbox[1] > window.innerHeight/2){
                console.log("SOUth WEST")
                sound3.play();
            };
                    //SE
            if (predictions[0].bbox[0]> window.innerHWidth/2 && predictions[0].bbox[1] > window.innerHeight/2){
                console.log("South East")
                 sound4.play();
            };
        };
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
};



// create a rectangle object
