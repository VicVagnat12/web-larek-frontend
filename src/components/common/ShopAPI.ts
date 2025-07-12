import { Api, ApiListResponse } from '../base/api';
import { ICard, PaymentMethod } from '../../types/index';
import { OrderData } from './orderBuilder';

export type OrderSuccess = {
		id: string;
		total: number;
}

export class ShopApi extends Api {

	getCard(id: string): Promise<ICard> {
		return this.get(`/product/${id}`) as Promise<ICard>;
	}

	getCards(): Promise<ApiListResponse<ICard>> {
		return this.get('/product/') as Promise<ApiListResponse<ICard>>;
	}

	order(data: OrderData): Promise<OrderSuccess> {
		return this.post('/order', data) as Promise<OrderSuccess>;
	}
}
