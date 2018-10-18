'use strict';

/* Settings */
const cellSize = parseInt(document.getElementById('input-cell-size').value)
let timeSpeed = parseInt(document.getElementById('time-speed').value)

const gameWindowWidth = (Math.floor(document.getElementById('input-width').value / cellSize)) * cellSize
const gameWindowHeight = (Math.floor(document.getElementById('input-height').value / cellSize)) * cellSize

/* Modes */
// walls portal
let isPortalMode = document.getElementById('portal-mode').value === 'on' ? true : false
// snake aim
let isAimMode = document.getElementById('aim-mode').value === 'on' ? true : false
// snake eat self
let isSnakeInSelfMode = document.getElementById('snake-in-self-mode').value === 'on' ? true : false

/* Colors */
let color_canvasBody = '#e0e9eb'
let color_snake = generateColor(255, 190, 220)
let color_snakeHead = generateColor(210, 180, 180)
let color_snakeDead = 'red'
let color_fruit = generateColor(150, 210, 210)

function generateColor(r = 255, g = 255, b = 255) {
    return `rgb(${Math.floor(Math.random() * r)},${Math.floor(Math.random() * g)},${Math.floor(Math.random() * b)})`
}



/* snake direction */
let moveDirection = 'pause' // w - up, s - down, a - left, d - right

/* canvas */
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

/* coordinates arrays declaration */
let snake = generateSnake()
let fruit = []
let snakeTail = [] // save at the render() beginning, push it when eating fruit

/* logic's variables */
let isGameOver = false
let isFruitTaken = false
let isIncrease = false






function startGame() {
    /* setup resolution of the canvas in html */
    ctx.canvas.width = gameWindowWidth
    ctx.canvas.height = gameWindowHeight

    gameLoop()
}

/* Game loop */
async function gameLoop() { // async for sleeping
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    while (isGameOver === false) {
        await sleep(timeSpeed)
        render()
    }
}

function render() {
    /* clear canvas */
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawingCanvasBody()

    /* save tail */
    snakeTail = snake[0]

    /* Check keyboard and move snake */
    snakeMoving()




    /* generate fruit */
    // fruit can generate in snake
    generateFruit()

    /* drawing fruit */
    drawingFruit()

    /* Physics collisions with walls, snake in self, fruit */
    colission()

    /* drawing snake */
    drawingSnake()

    /* aim mode */
    if (isAimMode === true)
        aimMode()




}







/* Drawing */
// canvas body
function drawingCanvasBody() {
    ctx.fillStyle = color_canvasBody
    ctx.fillRect(0, 0, gameWindowWidth, gameWindowHeight)
}

// snake
function drawingSnake() {
    ctx.fillStyle = color_snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i][0], snake[i][1], cellSize, cellSize)
    }
    ctx.fillStyle = color_snakeHead
    ctx.fillRect(snake[0][0], snake[0][1], cellSize, cellSize)
}

// fruit
function drawingFruit() {
    ctx.fillStyle = color_fruit
    ctx.fillRect(fruit[0], fruit[1], cellSize, cellSize)
}

/* Generating */
// snake
function generateSnake() {
    return [
        [Math.floor(Math.random() * gameWindowWidth / cellSize) * cellSize,
            Math.floor(Math.random() * gameWindowHeight / cellSize) * cellSize
        ]
    ]
}

// fruit
function generateFruit() {
    if (isFruitTaken === false) {
        fruit = [Math.floor(Math.random() * gameWindowWidth / cellSize) * cellSize,
            Math.floor(Math.random() * gameWindowHeight / cellSize) * cellSize
        ]
        isFruitTaken = true
        color_fruit = generateColor(150, 210, 210) // change fruit color
    }
}

/* Moving snake */
function snakeMoving() {
    const temp_snake = snake.slice()

    if (moveDirection === 'up') {
        snake[0] = [snake[0][0], snake[0][1] - cellSize]
        movingAndIncrease()
    } else if (moveDirection === 'down') {

        snake[0] = [snake[0][0], parseInt(snake[0][1]) + cellSize]
        movingAndIncrease()
    } else if (moveDirection === 'left') {
        snake[0] = [snake[0][0] - cellSize, snake[0][1]]
        movingAndIncrease()
    } else if (moveDirection === 'right') {
        snake[0] = [parseInt(snake[0][0]) + cellSize, snake[0][1]]
        movingAndIncrease()
    } else if (moveDirection === 'pause') {
        // nothing
    } else if (moveDirection === 'esc') {
        console.log('leave the game')
        isGameOver = true
    }

    /* moving snake and increase if is it needed  */
    function movingAndIncrease() {
        for (let i = 1; i < snake.length; i++) {
            snake[i] = temp_snake[i - 1]
        }
        if (isIncrease) {
            snake.push(temp_snake[length])
            isIncrease = false
        }
    }
}

/* Check keyboard */
function keyDown(key) { // physical keys
    key = key || window.event

    moveDirection = (function () {
        switch (key.keyCode) {
            case 38: // arrow up
            case 87: // w
                return 'up'
            case 40: // arrow down
            case 83: // s
                return 'down'
            case 37: // arrow left
            case 65: // a
                return 'left'
            case 39: // arrow right
            case 68: // d
                return 'right'
            case 32: // space
                return 'pause'
            case 82: // r
                gameRestart()
                break
            case 27: // esc
                isGameOver = true
                break
            case 189: // +
                timeSpeed += 25
                break
            case 187: // -
                timeSpeed < 26 ? timeSpeed = 1 : timeSpeed -= 25
                break
        }
        return moveDirection
    }())
}

function virtualKeyDown(key) { // virtual keys
    moveDirection = (function () {
        switch (key.keyCode) {
            case 'up':
                return 'up'
            case 'down':
                return 'down'
            case 'left':
                return 'left'
            case 'right':
                return 'right'
            case 'pause':
                return 'pause'
            case 'restart':
                gameRestart()
                break
            case 'speed-increase':
                timeSpeed += 25
                break
            case 'speed-decrease':
                timeSpeed < 26 ? timeSpeed = 1 : timeSpeed -= 25
                break
        }
        return moveDirection
    }())
}

function gameRestart() {
    snake = generateSnake()
    moveDirection = 'pause'
    isFruitTaken = false

    color_snake = generateColor(255, 190, 220)
    color_snakeHead = generateColor(210, 180, 180)
}

function colission() {
    // fruit
    const snakeHead = snake[0]
    if (snakeHead[0] === fruit[0] && snakeHead[1] === fruit[1]) {
        isFruitTaken = false
        isIncrease = true
    }

    // snake in self
    if (isSnakeInSelfMode === false) {
        for (let i = 1; i < snake.length; i++) {
            if (snakeHead[0] === snake[i][0] && snakeHead[1] === snake[i][1]) {
                color_snake = color_snakeDead
                color_snakeHead = color_snakeDead
                console.log('eaten by itself')
                gameRestart()
                // isGameOver = true
            }
        }
    }

    // walls
    if (isPortalMode === true) { // portal mode - on
        if (snake[0][0] < 0)
            snake[0][0] = gameWindowWidth - cellSize
        else if (snake[0][1] < 0)
            snake[0][1] = gameWindowHeight - cellSize
        else if (snake[0][0] >= gameWindowWidth)
            snake[0][0] = 0
        else if (snake[0][1] >= gameWindowHeight)
            snake[0][1] = 0
    } else { // portal mode - off
        if (snake[0][0] < 0 || snake[0][1] < 0 || snake[0][0] >= gameWindowWidth || snake[0][1] >= gameWindowHeight) {
            color_snake = color_snakeDead
            color_snakeHead = color_snakeDead
            console.log('crash with walls')
            gameRestart()
            // isGameOver = true
        }
    }
}

/* modes switches */
function changePortalMode() {
    // portalMode === true ? portalMode = false : portalMode = true

    const htmlButton = document.getElementById('portal-mode')
    if (isPortalMode === true) {
        htmlButton.innerHTML = `turn on porta mode`
        isPortalMode = false
    } else {
        isPortalMode = true
        htmlButton.innerHTML = `<b>turn off portal mode</b>`
    }
}

function changeAimMode() {
    const htmlButton = document.getElementById('aim-mode')
    if (isAimMode === true) {
        htmlButton.innerHTML = `turn on aim mode`
        isAimMode = false
        moveDirection = 'pause'
    } else {
        isAimMode = true
        htmlButton.innerHTML = `<b>turn off aim mode</b>`
    }
}

function changeSnakeInSelfMode() {
    const htmlButton = document.getElementById('snake-in-self-mode')
    if (isSnakeInSelfMode === true) {
        htmlButton.innerHTML = `turn on snake in self`
        isSnakeInSelfMode = false
    } else {
        isSnakeInSelfMode = true
        htmlButton.innerHTML = `<b>turn off snake in self mode</b>`
    }
}

/* modes */
function aimMode() {
    moveDirection = (function () {
        // find fruit and moving
        if (fruit[0, 0] > snake[0][0]) {
            return 'right'
        } else if (fruit[0, 0] < snake[0][0]) {
            return 'left'
        } else if (fruit[0, 1] < snake[0][1]) {
            return 'up'
        } else if (fruit[0, 1] > snake[0][1]) {
            return 'down'
        }
        // TODO: check self body
        // TODO: check walls

        return moveDirection
    }())
}