import { EventEmitter } from '../base/events';
import { Component } from '../base/Component';

export interface IBasketData {
	items: HTMLElement[];
	price: string;
}

export class BasketView extends Component<IBasketData> {
	protected list: HTMLElement;
	protected checkOutButton: HTMLButtonElement;
	protected basketPrice: HTMLSpanElement;

	constructor(
		protected container: HTMLElement,
		protected events: EventEmitter
	) {
		super(container);
		this.list = container.querySelector('.basket__list') as HTMLElement;
		this.checkOutButton = container.querySelector('.basket__button') as HTMLButtonElement;
		this.basketPrice = container.querySelector('.basket__price') as HTMLSpanElement;

		this.checkOutButton.addEventListener('click', () => {
			this.events.emit('ui:basket-checkOut');
		});
	}

	render(data: IBasketData) {
		super.render();
		if (data) {
			this.list.replaceChildren(...data.items);
			this.setText(this.basketPrice, data.price);
		}
		if (data.items.length === 0) {
			const message = document.createElement('span');
			this.setText(message, 'Корзина пуста');
			message.style.opacity = '0.3';
			this.list.append(message);
			this.checkOutButton.style.opacity = '0.3';
			this.checkOutButton.setAttribute('disabled', 'true');
		} else {
			this.checkOutButton.style.opacity = '1';
			this.checkOutButton.removeAttribute('disabled');
		}
		return this.container;
	}
}
