type Category =
    | 'софт-скилл'
    | 'хард-скилл'
    | 'кнопка'
    | 'дополнительно'
    | 'другое';
type PaymentMethod = 'card' | 'cash';

interface ICard {
    id: string;
    title: string;
    description: string;
    price: number;
    category: Category;
    image: string;
}

interface ICatalog {
    items: Map<string, ICard>;
    setItems(items: ICard[]): void;
    getItem(id: string): ICard;
}

interface IBasketModel {
    items: Map<string, number>;
    add(id: string): void;
    remove(id: string): void;
}

interface IOrderDetails {
    address: string;
    email: string;
    telephone: number;
    paymentMethod: PaymentMethod;
}

interface IEventEmitter {
    emit: (event: string, data: unknown) => void;
}

interface IView {
    render(data?: object): HTMLElement;
}
