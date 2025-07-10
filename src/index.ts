import { ICard } from './types/index';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { ShopApi } from './components/common/ShopAPI';
import { CatalogModel } from './components/common/catalogModel';
import { BasketModel } from './components/common/basketModel';
import { CardListView } from './components/common/cardListView';
import { CardView } from './components/common/cardView';
import { BasketItemView } from './components/common/basketItemView';
import { BasketView } from './components/common/basketView';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/base/Modal';
import { Page } from './components/common/page';
import { FormOrderView } from './components/common/formOrderView';
import { FormContactsView } from './components/common/formContactsView';
import { OrderSuccessView } from './components/common/orderSuccessView';

const api = new ShopApi(API_URL);
const events = new EventEmitter();
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const basketView = new BasketView(document.querySelector('.basket'), events);
const cardListView = new CardListView(document.querySelector('.gallery'));
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const page = new Page(document.querySelector('.page'), events);
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

api
	.getCards()
	.then((res) => res.items)
	.then((items) => catalogModel.setItems(items))
	.catch((err) => console.error(err));

events.on('catalog:change', (data: { items: ICard[] }) => {
	const cardElements = data.items.map((item) => {
		const cardView = new CardView(cloneTemplate(cardCatalogTemplate), events);
		return cardView.render(item);
	});
	cardListView.render(cardElements);
});

events.on('ui:card-click', (data: { id: string }) => {
	const cardData = catalogModel.getItem(data.id);
	const cardElement = cloneTemplate(cardTemplate);
	const cardView = new CardView(
		cardElement,
		events,
		basketModel.inCart(data.id)
	);
	modal.render({
		content: cardView.render(cardData),
	});
	page.locked = true;
});

events.on('ui:card-add', (events: { id: string }) => {
	basketModel.add(events.id);
});

events.on('ui:card-remove', (events: { id: string }) => {
	basketModel.remove(events.id);
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('basket:open', () => {
	const basketItems: Array<HTMLElement> = new Array();
	// переменная для подсчета общей суммы
	let totalPrice = 0;

	basketModel.items.forEach((id: string, index: number) => {
		const basketItem = new BasketItemView(
			cloneTemplate(basketItemTemplate),
			events
		);
		const itemData = catalogModel.getItem(id);
		basketItems.push(
			basketItem.render({
				id: id,
				title: itemData.title,
				price: itemData.price + ` синапсов`,
				index: index + 1,
			})
		);
		// Суммируем цены товаров
		totalPrice += itemData.price;
	});
	modal.render({
		content: basketView.render({
			items: basketItems,
			price: `${totalPrice} синапсов`,
		}),
	});
	page.locked = true;
});

events.on('ui:basket-remove', (data: { id: string }) => {
	basketModel.remove(data.id);
	const basketItems: Array<HTMLElement> = new Array();
	let totalPrice = 0;

	basketModel.items.forEach((id: string, index: number) => {
		const basketItem = new BasketItemView(
			cloneTemplate(basketItemTemplate),
			events
		);
		const itemData = catalogModel.getItem(id);
		basketItems.push(
			basketItem.render({
				id: id,
				title: itemData.title,
				price: itemData.price + ` синапсов`,
				index: index + 1,
			})
		);
		totalPrice += itemData.price;
	});
	modal.render({
		content: basketView.render({
			items: basketItems,
			price: `${totalPrice} синапсов`,
		}),
	});
});

events.on('basket:change', (data: { items: string[] }) => {
	page.basketCounter = data.items.length;
});

events.on('ui:basket-checkOut', () => {
	const orderForm = new FormOrderView(cloneTemplate(orderFormTemplate), events);
	modal.render({
		content: orderForm.render({
			valid: false,
			errors: '',
		}),
	});
});

events.on('order:submit', () => {
	const contactsForm = new FormContactsView(
		cloneTemplate(contactsFormTemplate) as HTMLFormElement,
		events
	);
	modal.render({
		content: contactsForm.render({
			valid: false,
			errors: '',
			email: '',
			phone: '',
		}),
	});
});

events.on('contacts:submit', () => {
	const totalPrice = basketModel.items.reduce((sum, id) => {
		return sum + catalogModel.getItem(id).price;
	}, 0);
	const successOrder = new OrderSuccessView(
		cloneTemplate(successTemplate) as HTMLElement,
		events
	);
	modal.render({
		content: successOrder.render({
			description: `Списано ${totalPrice} синапсов`,
		}),
	});
	basketModel.items = [];
	page.basketCounter = 0;
});

events.on('ui:successOrder-close', () => {
	modal.close();
});
