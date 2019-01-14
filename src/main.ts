import { Game } from './app/Game'

/* Initialize game */
const game = new Game()
console.log(game)

/* Game loop */
render()

function render() {
	requestAnimationFrame(render)
	game.renderer()
}
