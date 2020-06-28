const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const startButton = document.getElementById('startButton');

const nw = document.getElementById('nw');
const ne = document.getElementById('ne');
const sw = document.getElementById('sw');
const se = document.getElementById('se');

let model = null;
let isVideo =false;
let soundPlaying = false;

canvas.width=window.innerWidth; 
canvas.height=window.innerHeight;



const modelParams = {
    flipHorizontal: true,
    maxNumBoxes: 1,       
    iouThreshold: 0.5,      
    scoreThreshold: 0.6,    
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
                console.log ("nae video")
            };
            
        });    
};

startButton.addEventListener('click', toggleVideo);

function toggleVideo() {
    if (!isVideo) {
        startVideo();
        isVideo = true;
    } else {
        handTrack.stopVideo(video)
        isVideo = false;
    };
};



handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
});




function soundPicker(preds) {
    if (preds[0]){
    //NW
        if (preds[0].bbox[0]< canvas.width/2 && preds[0].bbox[1] < canvas.height/2){
            console.log("NORTH WEST");              
            playSound(sound1);
            nw.classList.add("animate__animated", "animate__jello");
            setTimeout(() => {nw.classList.remove('animate__animated','animate__jello')},1000);               
        };
        //NE
        if (preds[0].bbox[0] > canvas.width/2 && preds[0].bbox[1] < canvas.height/2){
            console.log("NORTH EAST!");
            playSound(sound2);
            ne.classList.add("animate__animated", "animate__swing");
            setTimeout(() => {ne.classList.remove('animate__animated','animate__swing')},1000);
        };
            //sw
        if (preds[0].bbox[0]< canvas.width/2 && preds[0].bbox[1] > canvas.height/2){
            console.log("South West")
            playSound(sound3);
            sw.classList.add("animate__animated", "animate__wobble");
            setTimeout(() => {sw.classList.remove('animate__animated','animate__wobble')},1000);
        };
                //SE
        if (preds[0].bbox[0]> canvas.width/2 && preds[0].bbox[1] > canvas.height/2){
            console.log("South East")
            playSound(sound4);
            se.classList.add("animate__animated", "animate__bounceOutRight");
            setTimeout(() => {se.classList.remove('animate__animated','animate__bounceOutRight')},1000);
        };       
    };     
};


function playSound (sound) {
        sound.play();
        soundPlaying = true;
        setTimeout(() => soundPlaying = false, 2000);
     
};

function runDetection() {
    model.detect(video).then(predictions => {
        console.log("Predictions: ", predictions);
        model.renderPredictions(predictions, canvas, context, video);

        if(!soundPlaying){
            soundPicker(predictions);
        };
            
        if (isVideo) {
            requestAnimationFrame(runDetection);
        };
    });
};

