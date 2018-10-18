'use strict';

// Settings
var game = {}
let cellSize = parseInt(document.getElementById('input-cell-size').value)
let timeSpeed = parseInt(document.getElementById('time-speed').value)

// canvas
const gameWindowWidth = (Math.floor(document.getElementById('input-width').value / cellSize)) * cellSize
const gameWindowHeight = (Math.floor(document.getElementById('input-height').value / cellSize)) * cellSize

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// modes
let isPortalMode = true // walls portal
let isAimMode = true // snake aim
let isSnakeInSelfMode = true // snake eat self
let isMovingBackwardMode = true // snake moving backward

// game's logic
let isGameOver = false
let isFruitTaken = false
let isIncrease = false

// colors
let Colors = {}
let color_canvasBody = '#f0f0f0'
let color_snake = generateColor(255, 190, 220)
let color_snakeHead = generateColor(210, 180, 180)
let color_snakeDead = 'red'
let color_fruit = generateColor(150, 210, 210)

function generateColor(r = 255, g = 255, b = 255) {
    return `rgb(${Math.floor(Math.random() * r)},${Math.floor(Math.random() * g)},${Math.floor(Math.random() * b)})`
}



/* snake direction */
let moveDirection = 'pause' // w - up, s - down, a - left, d - right

/* coordinates arrays declaration */
let snake = generateSnake()
let fruit = []

/* updating in colission */
let snakeHead = []
let snakeTail = []







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

    /* Check keyboard and move snake */
    move()



    /* Physics collisions with walls, snake in self, fruit */
    colission()



    /* generate fruit */
    // FIXME: fruit can generate in snake
    generateFruit()

    /* drawing fruit */
    drawingFruit()

    /* drawing snake */
    drawingSnake()

    /* aim mode */
    if (isAimMode === true)
        aimMode()




}







/* Drawing */
function drawingCanvasBody() {
    ctx.fillStyle = color_canvasBody
    ctx.fillRect(0, 0, gameWindowWidth, gameWindowHeight)
}

function drawingSnake() {
    ctx.fillStyle = color_snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i][0], snake[i][1], cellSize, cellSize)
    }
    ctx.fillStyle = color_snakeHead
    ctx.fillRect(snake[0][0], snake[0][1], cellSize, cellSize)
}

function drawingFruit() {
    ctx.fillStyle = color_fruit
    ctx.fillRect(fruit[0], fruit[1], cellSize, cellSize)
}

function drawingOneCell(cellCoordinates) {
    ctx.fillStyle = 'blue'
    ctx.fillRect(cellCoordinates[0], cellCoordinates[1], cellSize, cellSize)
}

/* Generating */
function generateSnake() {
    return [
        [Math.floor(Math.random() * gameWindowWidth / cellSize) * cellSize,
            Math.floor(Math.random() * gameWindowHeight / cellSize) * cellSize
        ]
    ]
}

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
function move() {
    const temp_snake = snake.slice()

    switch (moveDirection) {
        case 'up':
            snake[0] = [snake[0][0], snake[0][1] - cellSize]
            moveAndIncreasSnake()
            break
        case 'down':
            snake[0] = [snake[0][0], parseInt(snake[0][1]) + cellSize]
            moveAndIncreasSnake()
            break
        case 'left':
            snake[0] = [snake[0][0] - cellSize, snake[0][1]]
            moveAndIncreasSnake()
            break
        case 'right':
            snake[0] = [parseInt(snake[0][0]) + cellSize, snake[0][1]]
            moveAndIncreasSnake()
            break
        case 'pause':
            break
        case 'exit':
            console.log('leave the game')
            isGameOver = true
            break
    }

    function moveAndIncreasSnake() {
        // moving all over snake head
        for (let i = 1; i < snake.length; i++) {
            snake[i] = temp_snake[i - 1]
        }

        // increase if is it needed 
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
                return 'exit'
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

/* Colission */
function colission() {
    snakeHead = snake[0] // update head
    snakeTail = snake[0] // update tail

    // fruit
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
    const htmlButton = document.getElementById('portal-mode')

    isPortalMode = (function () {
        switch (isPortalMode) {
            case true:
                htmlButton.innerHTML = `<p>turn on portal</p>`
                htmlButton.className = 'bt-on'
                return false
            case false:
                htmlButton.innerHTML = `<p>turn off portal</p>`
                htmlButton.className = 'bt-off'
                return true
        }
    }())
}

function changeAimMode() {
    const htmlButton = document.getElementById('aim-mode')

    isAimMode = (function () {
        switch (isAimMode) {
            case true:
                moveDirection = 'pause'

                htmlButton.innerHTML = `<p>turn on aim mode</p>`
                htmlButton.className = 'bt-on'
                return false
            case false:
                htmlButton.innerHTML = `<p>turn off aim</p>`
                htmlButton.className = 'bt-off'
                return true
        }
    }())
}

function changeSnakeInSelfMode() {
    const htmlButton = document.getElementById('snake-in-self-mode')

    isSnakeInSelfMode = (function () {
        switch (isSnakeInSelfMode) {
            case true:
                htmlButton.innerHTML = `<p>turn on snake in self</p>`
                htmlButton.className = 'bt-on'
                return false
            case false:
                htmlButton.innerHTML = `<p>turn off snake in self</p>`
                htmlButton.className = 'bt-off'
                return true
        }
    }())
}

function changeMovingBackwardMode() {
    const htmlButton = document.getElementById('moving-backward-mode')

    isMovingBackwardMode = (function () {
        switch (isMovingBackwardMode) {
            case true:
                htmlButton.innerHTML = `<p>turn on moving backward</p>`
                htmlButton.className = 'bt-on'
                return false
            case false:
                htmlButton.innerHTML = `<p>turn off moving backward</p>`
                htmlButton.className = 'bt-off'
                return true
        }
    }())
}

/* modes */
function aimMode() {
    moveDirection = (function () {
        let temp_direction
        let isMoveUp = true,
            isMoveDown = true,
            isMoveLeft = true,
            isMoveRight = true

        /* TODO: blocking wrong direction */
        // up
        temp_direction = [snakeHead[0], snakeHead[1] - cellSize]
        drawingOneCell(temp_direction)
        // down
        // left
        // right

        /* find fruit and moving in this direction */
        if (fruit[0, 1] < snake[0][1] && isMoveUp) {
            return 'up'
        }
        if (fruit[0, 1] > snake[0][1] && isMoveDown) {
            return 'down'
        }
        if (fruit[0, 0] < snake[0][0] && isMoveLeft) {
            return 'left'
        }
        if (fruit[0, 0] > snake[0][0] && isMoveRight) {
            return 'right'
        }

        // if is it returned, snake moving in walls or in body
        console.log('bad move')
        return moveDirection
    }())
}