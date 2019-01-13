/* Get canvas */
const canvas: HTMLCanvasElement = document.getElementsByTagName('canvas')[0]
// const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!

/* Canvas initialize size */
canvas.width = window.innerWidth
canvas.height = window.innerHeight

/* Create gui menu */
import * as dat from 'dat.gui'
export const gui = new dat.GUI()

/* Create gui folder */
const guiCanvas = gui.addFolder('Canvas')
guiCanvas.open()
guiCanvas.add(canvas, 'width', 0, window.innerWidth)
guiCanvas.add(canvas, 'height', 0, window.innerHeight)
