import { IEventEmitter } from '../../types/index';

export interface IBasketModel {
    items: Array<string>;
    add(id: string): void;
    remove(id: string): void;
}

export class BasketModel implements IBasketModel {
	constructor(protected events: IEventEmitter) {}
	items: Array<string> = new Array();

	add(id: string): void {
		if (!this.items.includes(id)) {
			this.items.push(id);
			this._changed();
		}
	}
	remove(id: string): void {
		if (!this.items.includes(id)) return;
		else this.items = this.items.filter((item) => item !== id);
		this._changed();
	}

	inCart(id: string): boolean {
		if (this.items.includes(id)) {
			return true;
		} else {
			return false;
		}
	}

	protected _changed() {
		this.events.emit('basket:change', { items: this.items });
	}
}
