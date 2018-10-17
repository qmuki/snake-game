'use strict';

/* get DOM's elements */
const getInputCellSize = document.getElementById('input-cell-size')
const getInputWidth = document.getElementById('input-width')
const getInputHeight = document.getElementById('input-height')

/* settings */
const cellSize = Number(getInputCellSize.value)
const timeSpeed = Number(document.getElementById('time-speed').value)

const gameWindowWidth = (Math.floor(getInputWidth.value / cellSize)) * cellSize
const gameWindowHeight = (Math.floor(getInputHeight.value / cellSize)) * cellSize

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
    ctx.canvas.width = gameWindowWidth;
    ctx.canvas.height = gameWindowHeight;

    gameLoop()
}

/* Game loop */
async function gameLoop() { // async for sleeping
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    while (!isGameOver) {
        await sleep(timeSpeed)
        render()
    }
}

function render() {
    /* clear canvas */
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    /* save tail */
    snakeTail = snake[0]

    /* Physics collisions with walls, snake in self, fruit */
    colission()

    /* Check keyboard and move snake */
    snakeMoving()




    /* generate fruit */
    // fruit can generate in snake
    generateFruit()

    /* drawing fruit */
    drawingFruit()

    /* drawing snake */
    drawingSnake()

    // aim
    if (fruit[0, 0] > snake[0][0]) {
        moveDirection = 'right'
    } else if (fruit[0, 0] < snake[0][0]) {
        moveDirection = 'left'
    } else if (fruit[0, 1] > snake[0][1]) {
        moveDirection = 'down'
    } else if (fruit[0, 1] < snake[0][1]) {
        moveDirection = 'up'
    }
}

/* Drawing */
// snake
function drawingSnake() {
    ctx.fillStyle = `crimson`;

    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i][0], snake[i][1], cellSize, cellSize)
    }
}

// fruit
function drawingFruit() {
    ctx.fillStyle = `green`
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
    if (!isFruitTaken) {
        fruit = [Math.floor(Math.random() * gameWindowWidth / cellSize) * cellSize,
            Math.floor(Math.random() * gameWindowHeight / cellSize) * cellSize
        ]
        isFruitTaken = true
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
        }
        return moveDirection
    }())
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


function gameRestart() {
    snake = generateSnake()
    moveDirection = 'pause'
    isFruitTaken = false

}

function colission() {
    // fruit
    const snakeHead = snake[0]
    if (snakeHead[0] === fruit[0] && snakeHead[1] === fruit[1]) {
        isFruitTaken = false
        isIncrease = true
    }


    // snake in self

    // walls


    // }
}