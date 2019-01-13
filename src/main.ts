/* Create dat.gui menu */
import * as dat from 'dat.gui'
export const gui = new dat.GUI()

const obj = {
	add: () => {
		console.log('clicked')
	}
}
gui.add(obj, 'add')
