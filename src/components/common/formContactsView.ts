import { EventEmitter } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { Form } from '../base/Form';

export interface IContactsFormData {
	email: string;
	phone: string;
}

export class FormContactsView extends Form<IContactsFormData> {
	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container, events);
		container
			.querySelectorAll('input[name="email"], input[name="phone"]')
			.forEach((input) => {
				input.addEventListener('input', () => this.validate());
			});
	}

	private validate() {
		const email = ensureElement<HTMLInputElement>('input[name="email"]',this.container).value;
		const phone = ensureElement<HTMLInputElement>('input[name="phone"]',this.container).value;

		const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		const isPhoneValid = phone.replace(/\D/g, '').length >= 11;

		this.valid = isEmailValid && isPhoneValid;
	}
}
