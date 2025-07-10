import { Api, ApiListResponse } from '../base/api';
import { ICard } from '../../types/index';

export class ShopApi extends Api {
	getCard(id: string): Promise<ICard> {
		return this.get(`/product/${id}`) as Promise<ICard>;
	}

	getCards(): Promise<ApiListResponse<ICard>> {
		return this.get('/product/') as Promise<ApiListResponse<ICard>>;
	}
}
