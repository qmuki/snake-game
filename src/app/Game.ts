import { Canvas } from './Canvas'
import { gui } from './gui'
import { IPosition, IStyle } from './Interfaces'

/**
 * class Game - glues together classes and logics.
 */
export class Game {
	private canvas = new Canvas()
	private canvasGradient = new Canvas()

	// Window - will be updated
	private window: IPosition = {
		x: window.innerWidth,
		y: window.innerHeight
	}

	private grid: IPosition // Grid - sizes of cells

	private STYLE: IStyle = {
		colors: {
			apple: 'red',
			backgroud: 'rgb(26, 27, 30)',
			snake: 'rgb(112, 121, 255)',
			walls: 'rgb(99, 61, 41)'
		},
		gradient: {
			r0: this.window.x / 2.5,
			r1: this.window.x / 1.7,
			transparency: 0.4
		},
		gridPadding: 0.3
	}

	constructor() {
		/* Initialization */
		this.grid = {
			x: Math.floor(this.window.x / 40),
			y: Math.floor(this.window.y / 40)
		}

		/* Create gui */

		/* Gui - new game */
		const guiNewGame = gui.addFolder('New game')
		guiNewGame.open()

		guiNewGame // columns
			.add(this.grid, 'x', 2, Math.floor(this.window.x / 8))
			.step(1)
			.name('<b style="color: lightgreen;">columns</b>')
		guiNewGame // rows
			.add(this.grid, 'y', 2, Math.floor(this.window.y / 8))
			.step(1)
			.name('<b style="color: lightgreen;">rows</b>')
		guiNewGame // button
			.add(this, 'startGame')
			.name('<b style="color: lightgreen;">START GAME</b>')

		/* Gui - style */
		const guiStyle = gui.addFolder('Style')
		const guiColors = guiStyle.addFolder('Colors')
		guiStyle.open()
		guiColors.open()

		guiColors // colors
			.add(this.STYLE, 'gridPadding', -0.5, 10)
			.step(0.0001)
			.name('colors')
		guiStyle // padding
			.add(this.STYLE, 'gridPadding', -1, 100)
			.step(0.0001)
			.name('grid padding')

		/* Gui - gradient */
		const guiGradient = guiStyle.addFolder('gradient')

		guiGradient.add(this.STYLE.gradient, 'transparency', 0, 1).step(0.0001)
		guiGradient.add(this.STYLE.gradient, 'r0', 0, this.window.y)
		guiGradient.add(this.STYLE.gradient, 'r1', 0, this.window.x)

		/* Draw static objects */
		this.drawGradient()
	}

	public renderer = () => {
		// Clear whole canvas
		this.canvas.ctx.clearRect(0, 0, this.window.x, this.window.y)

		// Set color
		this.canvas.ctx.fillStyle = 'rgb(112, 121, 255)'

		// Draw cells
		for (let i = 0; i < this.grid.y; i++) {
			for (let j = 0; j < this.grid.x; j++) {
				this.canvas.ctx.fillRect(
					j * (this.window.x / this.grid.x) +
						this.STYLE.gridPadding / 2,
					i * (this.window.y / this.grid.y) +
						this.STYLE.gridPadding / 2,
					this.window.x / this.grid.x - this.STYLE.gridPadding,
					this.window.y / this.grid.y - this.STYLE.gridPadding
				)
			}
		}

		// TODO: Draw gradient only when it's change
		this.drawGradient()
	}

	public startGame() {
		/* Gui - hide folder */
	}

	private drawGradient() {
		/* Delete previous gradient */
		this.canvasGradient.ctx.clearRect(0, 0, this.window.x, this.window.y)

		const grd = this.canvasGradient.ctx.createRadialGradient(
			this.window.x / 2,
			this.window.y / 2,
			this.STYLE.gradient.r0,
			this.window.x / 2,
			this.window.y / 2,
			this.STYLE.gradient.r1
		)
		grd.addColorStop(0, 'rgba(0, 0, 0, 0)')
		grd.addColorStop(
			1,
			`rgba(0, 0, 0, ${this.STYLE.gradient.transparency})`
		)

		this.canvasGradient.ctx.fillStyle = grd
		this.canvasGradient.ctx.fillRect(0, 0, this.window.x, this.window.y)
	}
}
