export interface IPosition {
	x: number
	y: number
}

export interface IWalls {
	up: number
	down: number
	left: number
	right: number
}

export interface ISnake {
	head: IPosition
	body: IPosition[]
}

export interface IApple {
	position: IPosition
}

export interface IStyle {
	colors: {
		apple: string
		backgroud: string
		snake: string
		walls: string
	}
	gradient: {
		r0: number
		r1: number
		transparency: number
	}
	gridPadding: number
}
