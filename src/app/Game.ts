import { Canvas } from './Canvas'
import { gui } from './gui'

/**
 * class Game - glues together classes and logics.
 */
export class Game {
	/* Initialize classes */
	private canvas = new Canvas() // Initialize canvas

	// Window - will be updated
	private window = {
		height: window.innerHeight,
		width: window.innerWidth
	}

	// Grid - sizes of cells
	private grid = {
		columns: 20,
		rows: 20
	}

	constructor() {
		/* Create gui */
		// Create folders
		const guiNewGame = gui.addFolder('New game')
		const guiGrid = guiNewGame.addFolder('Create grid')

		// open gui folders
		guiNewGame.open()
		guiGrid.open()

		/* gui grid */
		guiGrid.add(this.grid, 'columns', 1, 100).step(1)
		guiGrid.add(this.grid, 'rows', 1, 100).step(1)

		/* gui start game button */
		guiNewGame.add(this, 'startNewGame')
	}

	public renderer = () => {
		// Clear whole canvas
		this.canvas.ctx.clearRect(0, 0, this.window.width, this.window.height)

		// Set color
		this.canvas.ctx.fillStyle = 'red'

		// Draw cells
		for (let i = 0; i < this.grid.rows; i++) {
			for (let j = 0; j < this.grid.columns; j++) {
				this.canvas.ctx.fillRect(
					j * (this.window.width / this.grid.columns) + 1,
					i * (this.window.height / this.grid.rows) + 1,
					this.window.width / this.grid.columns - 2,
					this.window.height / this.grid.rows - 2
				)
			}
		}
	}

	public startNewGame() {}
}
