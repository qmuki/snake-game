'use strict';

/* declaration paths */
const getSettings = getPath('settings')
const getGrid = getPath('grid')

/* declaration grid */
const grid = []

/* cell size in pixels */
const sizeCell = 10

function render() {
    /* start timer and stop it, when game is over */
    const timer = new Date().getTime()

    /* declaration variables with values */
    const input1 = getValue('input-1')
    const input2 = getValue('input-2')

    /* hiding settings */
    getSettings.hidden = true

    /* generate grid in grid variable */
    gridGenerator(input1, input2)

    /* declaration main logic */
    let gameOver = false

    while(true) {
        break
    } 

    console.log(grid)

    /* stop timer */
    console.log(`timer = ${(new Date().getTime() - timer)} ms`)
}

function gridGenerator(x, y) {
    /* calc resolution */
    const sizeX = Math.floor(x / sizeCell)
    const sizeY = Math.floor(y / sizeCell)
    /* calc resolution and edit width and height of the grid */
    setAttribute(getGrid, 'style', `width: ${sizeX * sizeCell}px; height: ${sizeY * sizeCell}px;`)

    /* push cells in grid */
    for (let i = 0; i < sizeX * sizeY; i++) {
        grid.push(getGrid.appendChild(document.createElement('div')))
        // grid.push(createElement(getGrid, 'div'))
    }
}