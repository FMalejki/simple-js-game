const aim = document.getElementById('aim');
const score = document.getElementById('score');
const container = document.getElementById('container');
const heart1 = document.getElementById('heart1');
const heart2 = document.getElementById('heart2');
const heart3 = document.getElementById('heart3'); 
const popup = document.getElementById('gameOverPopup');
const sadMusic = document.getElementById('sadMusic');
const resetButton = document.getElementById('resetButton')
const body = document.getElementById('body')
const zombieContainer = document.querySelector('.zombie-container');
const spawnRate = 1000;
score.innerText = '0000';

function handleClickOnContainer(event){
    addToScore(-5);
}

container.addEventListener('click', handleClickOnContainer);



function heartTurnOff(){
    console.log("in function")
    if( heart1.getAttribute('src') === "./media/full_heart.png" ){
        console.log("in first if")
        heart1.src = "./media/empty_heart.png"
    }
    else if( heart2.getAttribute('src') === "./media/full_heart.png" ){
        console.log("in second if")
        heart2.src = "./media/empty_heart.png"
    }
    else{
        console.log("in third if")
        heart3.src = "./media/empty_heart.png"
        gameOver();
    }
}


function addToScore(numberToAdd){
    let number = parseInt(score.innerText)+numberToAdd

    if( number < 0 ){
        score.innerText = '0000'
    } else if (number < 10) {
        score.innerText = '000' + number;
    } else if (number < 100) {
        score.innerText = '00' + number;
    } else if (number < 1000) {
        score.innerText = '0' + number;
    } else {
        score.innerText = number;
    }
}

function gameOver(){
    popup.style.display = 'block'
    sadMusic.play();
    aim.style.display = 'none'
    body.style.cursor = 'default'
    container.style.pointerEvents = 'none'
    container.removeEventListener('click', handleClickOnContainer);
}

document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    aim.style.left = `${mouseX}px`;
    aim.style.top = `${mouseY}px`;
});

function animateZombie(zombie, image) {
    let positionMap = 0//parseFloat(zombie.style.right.replace('vw', ''));
    const zombieWidth = parseFloat(zombie.style.width.replace('px', ''));
    const imageWidth = parseFloat(image.style.width.replace('px', '')); // Total width of the sprite sheet
    const containerWidth = zombie.offsetWidth;
    const speed = Math.random() * (0.5 - 0.2) + 0.2;
    let imagePositionX = 0
    let last = 0
    let fps = 32
    let interval = 1000/fps

    function animate(timestamp){
        if (positionMap < 100 && zombie.style.display !== 'none') {
            if(timestamp - last >= interval){
                last = timestamp
                console.log(positionMap)
                imagePositionX = (imagePositionX + zombieWidth)%(imageWidth - containerWidth);
                positionMap += speed;
                zombie.style.right = `${positionMap}vw`;
                image.style.transform = `translateX(-${imagePositionX}px)`;

            }
            requestAnimationFrame(animate)

        }
        else{
            console.log("get to end")
            if(zombie.style.display !== 'none'){
                heartTurnOff()
                zombie.remove()
            }
        }
    }

    requestAnimationFrame(animate)

}

function randomizeParameters(zombie, image){

    const positionMap = Math.floor(Math.random() * (30 - 0) + 0); // 0 to 30
    const zombiePositionY = Math.floor(Math.random() * (70 - 50) + 50); // 50 to 70
    const zombieWidth = Math.floor(Math.random() * (200 - 60) + 60); // 60 to 200
    const allZombiesWidth = zombieWidth*10;

    zombie.style.zIndex = `${zombieWidth}`
    zombie.style.right = `${positionMap}vw`
    zombie.style.width = `${zombieWidth}px`
    zombie.style.top = `${zombiePositionY}%`
    image.style.width = `${allZombiesWidth}px`


}

function createZombie(){
    const newZombie = document.createElement('div');
    newZombie.classList.add('single-zombie'); 
    const imageZombie = document.createElement('img');
    imageZombie.classList.add('all-zombies');
    imageZombie.src = './media/walkingdead.png';

    randomizeParameters(newZombie, imageZombie)
    console.log(newZombie.style.right)

    newZombie.addEventListener('click', (event) => {
        event.stopPropagation();
        newZombie.style.display = 'none';
        addToScore(20);
    })

    newZombie.appendChild(imageZombie);

    return [newZombie, imageZombie];
}

function addZombie() {
    const newZombie = createZombie() 
    zombieContainer.appendChild(newZombie[0]);
    animateZombie(newZombie[0], newZombie[1])
}

let i = 0
function startZombieSpawner() {
    console.log('started spawner')

    setInterval(() => {
        addZombie();
    }, spawnRate);
}


function resetGame(){
    console.log('aaaa')
    positionMap = 0
    imagePositionX = 0
    popup.style.display = 'none'
    aim.style.display = 'block'
    body.style.cursor = 'none'
    container.style.pointerEvents = 'all'

    sadMusic.pause()
    sadMusic.currentTime = 0
    heart1.src = "./media/full_heart.png"
    heart2.src = "./media/full_heart.png"
    heart3.src = "./media/full_heart.png"
    container.addEventListener('click', handleClickOnContainer);
    const zombies = document.querySelectorAll('.single-zombie');
    zombies.forEach(zombie => {
        zombie.style.display = 'none'
        zombie.remove()
    });
}

resetButton.addEventListener('click', () => {
    console.log('aaa')
    resetGame()
})


//resetButton - done

//appendChild

//to randomize: - done
//imagePositionX = width of singleZombie
//width of singleZombie * 10 = width of allZombies
//top singleZombie - difference
//positionMap
//createZombie()

startZombieSpawner()