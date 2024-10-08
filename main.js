"use strict"

// Settings
let cellSize = parseInt(document.getElementById("input-cell-size").value)
let timeSpeed = parseInt(document.getElementById("time-speed").value)

// canvas
const gameWindowWidth =
	Math.floor(document.getElementById("input-width").value / cellSize) *
	cellSize
const gameWindowHeight =
	Math.floor(document.getElementById("input-height").value / cellSize) *
	cellSize

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

// modes
const Modes = {
	aim: {
		button: document.getElementById("mode-aim"),
		value: true
	},
	snakeInSelf: {
		button: document.getElementById("mode-snake-in-self"),
		value: true
	},
	movingBackward: {
		button: document.getElementById("mode-moving-backward"),
		value: true
	},
	// create new colors when fruit is taken
	newColors: {
		button: document.getElementById("mode-new-colors"),
		value: false
	},
	portal: {
		button: document.getElementById("mode-portal"),
		value: true
	}
}

/* Game's logic */
let isFruitTaken = false
let isIncrease = false

// game over
let isGameOver = false
let gameEndMessage = {
	// Lose
	crashWithSelf: false,
	crashWithWalls: false,
	// Win
	maxScore: false
}

// stats
let score = 1 // 1 = head
let scoreDone = 0 // max possible score

// colors
let color_aimTrue = "rgba(0, 0, 255, 0.1)"
let color_aimFalse = "rgba(255, 255, 0, 0.8)"
let color_canvasBody = "#f0f0f0"
let color_snake = NaN
let color_snakeHead = NaN
let color_snakeDead = "red"
let color_fruit = NaN
regenerateColors()

function random(from, to) {
	return Math.floor(from + Math.random() * to)
}

function randomColor(dirty) {
	// dirty: number (1 - 101)
	return `hsl(${random(0, 361)}, ${dirty}%, 50%)`
}

function regenerateColors() {
	color_snake = randomColor(50)
	color_snakeHead = randomColor(25)
	color_fruit = randomColor(75)
}

/* snake direction */
let moveDirection = "pause" // w - up, s - down, a - left, d - right

/* coordinates arrays declaration */
let snake = generateSnake()
let fruit = []

/* updating in colission */
let snakeHead = []

/* update in move */
let lastDirection = NaN

function start() {
	/* setup resolution of the canvas in html */
	ctx.canvas.width = gameWindowWidth
	ctx.canvas.height = gameWindowHeight

	// Add max possible score in stats panel
	scoreDone = (gameWindowWidth / cellSize) * (gameWindowHeight / cellSize)
	document.getElementById("score-done").innerHTML = scoreDone

	// Generate DOM for modes buttons
	toggleMode(Modes.aim)
	toggleMode(Modes.snakeInSelf)
	toggleMode(Modes.movingBackward)
	toggleMode(Modes.newColors)
	toggleMode(Modes.portal)

	startGame()
}

function startGame() {
	gameLoop()
}

/* Game loop */
async function gameLoop() {
	// async for sleeping
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}

	while (!isGameOver) {
		await sleep(timeSpeed)
		render()
	}

	if (gameEndMessage.crashWithSelf) console.log("You lose!")
	else if (gameEndMessage.crashWithWalls) console.log("You lose!")
	else if (gameEndMessage.maxScore) console.log("You won!")
}

function render() {
	/* clear canvas */
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	drawingCanvasBody()

	/* Check keyboard and move snake */
	if (moveDirection !== "pause") move()

	/* Update variables */
	snakeHead = snake[0]

	/* Physics collisions with walls, snake in self, fruit */
	collision()

	/* generate fruit */
	if (isFruitTaken === false) generateFruit()

	/* drawing fruit */
	drawingFruit()

	/* drawing snake */
	drawingSnake()

	/* aim mode */
	if (Modes.aim.value === true) aimMode()
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
	ctx.fillRect(snakeHead[0], snakeHead[1], cellSize, cellSize)
}

function drawingFruit() {
	ctx.fillStyle = color_fruit
	ctx.fillRect(fruit[0], fruit[1], cellSize, cellSize)
}

function drawOneCell(cellCoordinates, color) {
	ctx.fillStyle = color
	ctx.fillRect(cellCoordinates[0], cellCoordinates[1], cellSize, cellSize)
}

/* Generating */
function generateSnake() {
	return [
		[
			Math.floor((Math.random() * gameWindowWidth) / cellSize) * cellSize,
			Math.floor((Math.random() * gameWindowHeight) / cellSize) * cellSize
		]
	]
}

function generateFruit() {
	// toggle boolean
	isFruitTaken = true

	// generate new colors
	if (Modes.newColors.value) regenerateColors()
	else color_fruit = randomColor(75)

	// generate fruit position while it's in the snake
	generate()
	while (collisionWithSnake() === true) {
		generate()
	}

	function generate() {
		fruit = [
			Math.floor((Math.random() * gameWindowWidth) / cellSize) * cellSize,
			Math.floor((Math.random() * gameWindowHeight) / cellSize) * cellSize
		]
	}
	function collisionWithSnake() {
		for (let i = 0; i < snake.length; i++)
			if (fruit[0] === snake[i][0] && fruit[1] === snake[i][1])
				return true
	}
}

/* Moving snake */
function move() {
	const temp_snake = snake.slice()

	// move snakeHead and checking blocking ways
	switch (moveDirection) {
	case "up":
		if (lastDirection === "down") {
			moveDirection = lastDirection
			moveDown()
			break
		}
		moveUp()
		break
	case "down":
		if (lastDirection === "up") {
			moveDirection = lastDirection
			moveUp()
			break
		}
		moveDown()
		break
	case "left":
		if (lastDirection === "right") {
			moveDirection = lastDirection
			moveRight()
			break
		}
		moveLeft()
		break
	case "right":
		if (lastDirection === "left") {
			moveDirection = lastDirection
			moveLeft()
			break
		}
		moveRight()
		break
	}

	/* move snake array over snake head */
	function moving() {
		for (let i = 1; i < snake.length; i++) {
			snake[i] = temp_snake[i - 1]
		}

		// increase snake if fruit taken
		if (isIncrease) {
			// Increase snake
			snake.push(temp_snake[length])

			// Update and increase score
			score += 1
			document.getElementById("score").innerHTML = score
			if (score >= scoreDone) {
				isGameOver = true
				gameEndMessage.maxScore = true
			}

			// Reset boolean
			isIncrease = false
		}

		// update lastDirection
		if (!Modes.movingBackward.value) lastDirection = moveDirection
	}

	/* move snakeHead */
	function moveUp() {
		snake[0] = [snakeHead[0], snakeHead[1] - cellSize]
		moving()
	}

	function moveDown() {
		snake[0] = [snakeHead[0], parseInt(snakeHead[1]) + cellSize]
		moving()
	}

	function moveLeft() {
		snake[0] = [snakeHead[0] - cellSize, snakeHead[1]]
		moving()
	}

	function moveRight() {
		snake[0] = [parseInt(snakeHead[0]) + cellSize, snakeHead[1]]
		moving()
	}
}

/* Check keyboard */
function keyDown(key) {
	// physical keys
	key = key || window.event

	moveDirection = (function() {
		switch (key.keyCode) {
		case 38: // arrow up
		case 87: // w
			return "up"
		case 40: // arrow down
		case 83: // s
			return "down"
		case 37: // arrow left
		case 65: // a
			return "left"
		case 39: // arrow right
		case 68: // d
			return "right"
		case 32: // space
			return "pause"
		case 82: // r
			gameRestart()
			break
		case 27: // esc
			return "exit"
		case 189: // -
			timeSpeed += 25
			break
		case 187: // +
			timeSpeed < 26 ? (timeSpeed = 1) : (timeSpeed -= 25)
			break
		}
		return moveDirection
	})()
}

function virtualKeyDown(key) {
	// virtual keys
	moveDirection = (function() {
		switch (key) {
		case "up":
			return "up"
		case "down":
			return "down"
		case "left":
			return "left"
		case "right":
			return "right"
		case "pause":
			return "pause"
		case "restart":
			gameRestart()
			break
		case "speed-increase":
			timeSpeed < 26 ? (timeSpeed = 1) : (timeSpeed -= 25)
			break
		case "speed-decrease":
			timeSpeed += 25
			break
		}
		return moveDirection
	})()
}

function gameRestart() {
	// Start new game when it's lose
	let temp_isGameOver = false
	if (isGameOver) temp_isGameOver = true

	// Clear bool game over
	isGameOver = false
	for (let i = 0; i < gameEndMessage.length; i++) gameEndMessage[i] = false

	// Generate new position
	snake = generateSnake()
	snakeHead = snake[0]

	isFruitTaken = false

	// Generate new colors
	regenerateColors()

	// Clear stats
	score = 1
	document.getElementById("score").innerHTML = 1

	// Clear bool directions
	moveDirection = "pause"
	lastDirection = NaN

	// Start new game when it's lose
	if (temp_isGameOver) startGame()
}

/* Colission */
function collision() {
	// fruit
	if (snakeHead[0] === fruit[0] && snakeHead[1] === fruit[1]) {
		isFruitTaken = false
		isIncrease = true
	}

	// snake in self
	if (Modes.snakeInSelf.value === false) {
		// i = 1. For skip the head-to-head check
		for (let i = 1; i < snake.length; i++) {
			if (snakeHead[0] === snake[i][0] && snakeHead[1] === snake[i][1]) {
				// Game over
				isGameOver = true
				gameEndMessage.crashWithSelf = true
			}
		}
	}

	// walls
	if (Modes.portal.value === true) {
		// portal mode - on
		if (snakeHead[0] < 0) snake[0][0] = gameWindowWidth - cellSize
		else if (snakeHead[1] < 0) snake[0][1] = gameWindowHeight - cellSize
		else if (snakeHead[0] >= gameWindowWidth) snake[0][0] = 0
		else if (snakeHead[1] >= gameWindowHeight) snake[0][1] = 0
	} else {
		// portal mode - off
		if (
			snakeHead[0] < 0 ||
			snakeHead[1] < 0 ||
			snakeHead[0] >= gameWindowWidth ||
			snakeHead[1] >= gameWindowHeight
		) {
			// Game over
			isGameOver = true
			gameEndMessage.crashWithWalls = true
		}
	}
}

/* modes switches */
function toggleMode(mode) {
	// button: domElement, boolean: Modes = { button: domElement, value: boolean}
	console.log(Modes.movingBackward)
	// get span in button
	const span = mode.button.getElementsByTagName("span")[0]

	// toggle boolean
	mode.value = !mode.value

	// change button class and text
	if (mode.value == true) {
		mode.button.className = "bt-on"
		span.innerHTML = "on"

		// specials modes
		if (mode == Modes.movingBackward) lastDirection = NaN
	} else {
		mode.button.className = "bt-off"
		span.innerHTML = "off"

		// specials modes
		if (mode == Modes.aim) moveDirection = "pause"
		else if (mode == Modes.movingBackward) lastDirection = moveDirection
	}
}

/* modes */
// Aim v2.0 FIXME: Crash with walls when trying moving backward
function aimMode() {
	moveDirection = (function() {
		let temp_direction

		let isMoveUp, isMoveDown, isMoveLeft, isMoveRight

		// Up
		isMoveUp = (function() {
			temp_direction = [snakeHead[0], snakeHead[1] - cellSize] // find direction

			// she'll never go in to wall
			if (temp_direction[1] < 0) console.log("walls") // block move if is it walls

			// FIXME: Perfomance: Call it 1 time for all directions
			checkSelfBody(temp_direction)

			// default
			return true
		})()
		isMoveUp
			? drawOneCell(temp_direction, color_aimTrue)
			: drawOneCell(temp_direction, color_aimFalse) // draw

		// Down
		isMoveDown = (function() {
			temp_direction = [snakeHead[0], parseInt(snakeHead[1]) + cellSize]

			if (temp_direction[1] >= gameWindowHeight) return false

			checkSelfBody(temp_direction)

			return true
		})()
		isMoveDown
			? drawOneCell(temp_direction, color_aimTrue)
			: drawOneCell(temp_direction, color_aimFalse)

		// Left
		isMoveLeft = (function() {
			temp_direction = [snakeHead[0] - cellSize, snakeHead[1]]

			if (temp_direction[0] < 0) return false

			checkSelfBody(temp_direction)

			return true
		})()
		isMoveLeft
			? drawOneCell(temp_direction, color_aimTrue)
			: drawOneCell(temp_direction, color_aimFalse)

		// Right
		isMoveRight = (function() {
			temp_direction = [parseInt(snakeHead[0]) + cellSize, snakeHead[1]]

			if (temp_direction[0] >= gameWindowWidth) return false

			checkSelfBody(temp_direction)

			return true
		})()
		isMoveRight
			? drawOneCell(temp_direction, color_aimTrue)
			: drawOneCell(temp_direction, color_aimFalse)

		function checkSelfBody(direction) {
			for (let i = 1; i < snake.length; i++) {
				if (
					direction[0] === snake[i][0] &&
					direction[1] === snake[i][1]
				)
					return false
			}
		}

		/* find fruit and moving in this direction */
		if (fruit[(0, 1)] < snakeHead[1] && isMoveUp) {
			return "up"
		}
		if (fruit[(0, 1)] > snakeHead[1] && isMoveDown) {
			return "down"
		}
		if (fruit[(0, 0)] < snakeHead[0] && isMoveLeft) {
			return "left"
		}
		if (fruit[(0, 0)] > snakeHead[0] && isMoveRight) {
			return "right"
		}

		return moveDirection
	})()
}
