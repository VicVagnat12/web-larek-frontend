import { EventEmitter } from '../base/events';
import { ICard } from '../../types';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class CardView extends Component<ICard> {
    protected _id: string;
    protected _title: HTMLElement;
    protected _image: HTMLImageElement | null;
    protected _category: HTMLSpanElement;
    protected _price: HTMLSpanElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: EventEmitter, protected inCart: boolean = false) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container) as HTMLElement;
        this._image = container.querySelector('.card__image') as HTMLImageElement | null;
        this._button = container.querySelector('.card__button') as HTMLButtonElement;
        this._description = container.querySelector('.card__text') as HTMLElement;
        this._price = container.querySelector('.card__price') as HTMLSpanElement;
        this._category = container.querySelector('.card__category') as HTMLSpanElement;

        this.changeButtonDescription(inCart);

		if (this.container.classList.contains('gallery__item')) {
			this.container.addEventListener('click', () => {
				this.events.emit('ui:card-click', { id: this._id });
			});
		} else {
			this._button.addEventListener('click', () => this.toggleInCart());
		}
	}

	protected toggleInCart() {
		if (this.inCart) {
			this.events.emit('ui:card-remove', { id: this._id });
		} else {
			this.events.emit('ui:card-add', { id: this._id });
		}

		this.inCart = !this.inCart;
		this.changeButtonDescription(this.inCart);
	}

	set id(value: string) {
		this._id = value;
	}

	get id(): string {
		return this._id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		const baseUrl = 'https://larek-api.nomoreparties.co/content/weblarek';
		const imageUrl = value.startsWith('http') ? value : `${baseUrl}${value}`;
		this.setImage(this._image, imageUrl, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set price(value: number | null) {
		this.setText(
			this._price,
			value ? `${value.toString()} синапсов` : 'Бесценно'
		);
		if (value === null && this._button) {
			this._button.disabled = true;
			this.button = 'Недоступно';
		}
	}

	set button(value: string) {
		this.setText(this._button, value);
	}

	changeButtonDescription(inCart: boolean) {
		if (inCart) {
			this.button = 'Удалить из корзины';
		} else {
			this.button = 'В корзину';
		}
	}
}
