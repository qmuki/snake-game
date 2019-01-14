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

export interface IColors {
	walls: string
	snake: {
		head: string
		body: string
	}
	apple: string
}
