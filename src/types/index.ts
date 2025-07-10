export type Category =
    | 'софт-скилл'
    | 'хард-скилл'
    | 'кнопка'
    | 'дополнительно'
    | 'другое';
export type PaymentMethod = 'card' | 'cash';

export interface ICard {
    id: string;
    title: string;
    description: string;
    price: number | null;
    category: Category;
    image: string;
    inCart: boolean;
}

export interface IEventEmitter {
    emit: (event: string, data: unknown) => void;
}