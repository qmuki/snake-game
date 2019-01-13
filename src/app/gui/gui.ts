/* Create dat.gui menu */
import * as dat from 'dat.gui'
export const gui = new dat.GUI()

// Create new dat.gui folder
// const gioFolderGridG = gui.addFolder('Player')
// playerGuiFolder.open()

const obj = {
	add: () => {
		console.log('clicked')
	}
}

gui.add(obj, 'add').name('Generate grid')
