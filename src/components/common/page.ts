import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IPage {
	counter: number;
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _basketCounter: HTMLSpanElement;
	protected _buttonHeaderBasket: HTMLButtonElement;
	protected _wrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
		this._buttonHeaderBasket = ensureElement<HTMLButtonElement>(
			'.header__basket',
			container
		);
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._buttonHeaderBasket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set basketCounter(value: number) {
		this.setText(this._basketCounter, value);
	}

	set locked(value: boolean) {
		if (value) {
			this.toggleClass(this._wrapper, 'page__wrapper_locked', true);
		} else {
			this.toggleClass(this._wrapper, 'page__wrapper_locked');
		}
	}
}
