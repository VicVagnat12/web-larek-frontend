import { ICard, IEventEmitter } from '../../types/index';

export interface ICatalog {
    items: Map<string, ICard>;
    setItems(items: ICard[]): void;
    getItem(id: string): ICard;
}

export class CatalogModel implements ICatalog {
	items: Map<string, ICard> = new Map();

	constructor(protected events: IEventEmitter) {}

	setItems(items: Array<ICard>): void {
		items.forEach((item) => {
			this.items.set(item.id, item);
		});
		this.events.emit('catalog:change', {
			items: Array.from(this.items.values()),
		});
	}
	getItem(id: string): ICard {
		return this.items.get(id);
	}
}
