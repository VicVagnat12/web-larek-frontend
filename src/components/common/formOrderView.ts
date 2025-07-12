import { EventEmitter } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { Form } from '../base/Form';

export interface IOrderFormData {
	payment: 'card' | 'cash';
	address: string;
}

export class FormOrderView extends Form<IOrderFormData> {
	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container, events);

		const cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        const cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);

        cardButton.addEventListener('click', () => this.handlePaymentSelect('card'));
        cashButton.addEventListener('click', () => this.handlePaymentSelect('cash'));

        ensureElement<HTMLInputElement>('input[name="address"]', container)
            .addEventListener('input', () => this.validate());
	}

	private handlePaymentSelect(paymentType: 'card' | 'cash') {
		this.container.querySelectorAll('.button_alt').forEach((button: HTMLElement) => {
			this.toggleClass(button, 'button_active');
			(button as HTMLElement).style.border = 'none';
		});

		const selectedButton = ensureElement<HTMLButtonElement>(`button[name="${paymentType}"]`,this.container);
		this.toggleClass(selectedButton, 'button_active', true);
		selectedButton.style.border = '2px solid rgba(255, 255, 255, 1)';

		this.onInputChange('payment', paymentType);
		this.validate();
	}

	private validate() {
		const addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.container
		);
		const address = addressInput.value.trim();
		const isAddressValid = address.length > 0;
		const isPaymentSelected = !!this.container.querySelector(
			'.button_alt.button_active'
		);
		const addressError = ensureElement<HTMLSpanElement>('.form__errors');

		if (!isAddressValid) {
			this.setText(addressError, 'Необходимо указать адрес');
		} else {
			this.setText(addressError, '');
		}
		this.valid = isAddressValid && isPaymentSelected;
	}
}
