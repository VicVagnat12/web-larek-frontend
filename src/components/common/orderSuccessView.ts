import { EventEmitter } from '../base/events';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface ISuccessData {
	description: string;
}

export class OrderSuccessView extends Component<ISuccessData> {
	protected description: HTMLElement;
	protected closeButton: HTMLButtonElement;
	protected image: HTMLImageElement;

	constructor(
		protected container: HTMLElement,
		protected events: EventEmitter
	) {
		super(container);
		
		this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close',container);
		this.description = ensureElement<HTMLElement>('.order-success__description',container);

		this.closeButton.addEventListener('click', () => {
			this.events.emit('ui:successOrder-close');
		});
	}
	render(data: ISuccessData) {
		super.render();
		this.description.textContent = data.description;
		return this.container;
	}
}
