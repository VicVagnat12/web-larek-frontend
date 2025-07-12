import { PaymentMethod } from '../../types/index';

export type OrderData = {
    payment: PaymentMethod,
    email: string,
    phone: string,
    address: string,
    total: number,
    items: Array<string>
}

export class OrderBuilder {
	private order: Partial<OrderData> = {};

	setData<K extends keyof OrderData>(key: K, value: OrderData[K]): void {
        this.order[key] = value;
    }

    build(): OrderData {
        if (
            !this.order.payment ||
            !this.order.email ||
            !this.order.phone ||
            !this.order.address ||
            !this.order.total ||
            !this.order.items
        ) {
            console.error("Не все поля заполнены!");
        }
        return this.order as OrderData;
    }

	clear() {
		this.order = {};
	}
}
