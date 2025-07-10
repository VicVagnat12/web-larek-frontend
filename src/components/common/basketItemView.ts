import { EventEmitter } from '../base/events';
import { Component } from '../base/Component';

export class BasketItemView extends Component<HTMLElement> {
	protected title: HTMLSpanElement;
	protected price: HTMLSpanElement;
	protected deleteButton: HTMLButtonElement;
	protected index: HTMLSpanElement;

	protected id: string | null = null;

	constructor(
		protected container: HTMLElement,
		protected events: EventEmitter
	) {
		super(container);

		this.title = container.querySelector('.card__title') as HTMLSpanElement;
		this.price = container.querySelector('.card__price') as HTMLSpanElement;
		this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;
		this.index = container.querySelector('.basket__item-index') as HTMLSpanElement;

		this.deleteButton.addEventListener('click', () => {
			this.events.emit('ui:basket-remove', { id: this.id });
		});
	}

	render(data: { id: string; index: number; title: string; price: string }) {
		if (data) {
			this.id = data.id;
			this.title.textContent = data.title;
			this.price.textContent = data.price;
			this.index.textContent = data.index.toString();
		}
		return this.container;
	}
}
