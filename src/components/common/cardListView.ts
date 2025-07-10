import { Component } from '../base/Component';

export class CardListView extends Component<HTMLElement[]> {
	constructor(protected container: HTMLElement) {
		super(container);
	}
	render(data: HTMLElement[]) {
		super.render();
		if (data) {
			this.container.replaceChildren(...data);
		}
		return this.container;
	}
}
