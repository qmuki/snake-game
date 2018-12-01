class Mode {
	private _isEnabled: boolean = false // state of mode
	private btn: HTMLButtonElement		// button element

	constructor(buttonId: string) {
		/* Get current state */
		this.btn = <HTMLButtonElement>document.getElementById(buttonId) // get button id

		/* Create event */
		this.btn.addEventListener("click", () => {
			this.switch() // Switch state of mode
		})
	}

	public get isEnabled(): boolean {
		return this._isEnabled
	}

	/* Switcher of isEnabled */
	public switch = () => {
		if (this._isEnabled) {
			this._isEnabled = false			// switch mode
			this.btn.className = 'bt-off'	// change color
			this.turnOff()
		} else {
			this._isEnabled = true
			this.btn.className = 'bt-on'
		}
	}

	protected turnOff () {}

}

class Aim extends Mode {
	// TODO: Stop snake, when aim mod is turning off
	// protected turnOff = (): Direction => {
	//	return 'stand'
	// }
}

export namespace modes {
	export const aim = new Aim('aim')
	export const portal = new Mode('portal')
	export const snakeInSelf = new Mode('snake-in-self')
	export const movingBackward = new Mode('moving-backward')
}