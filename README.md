# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание данных

Для реализации данной проектной работы использован MVP-паттерн, который состоит из Model (слоя модель), View (слоя представления) и Presenter (слоя презентера). Model хранит в себе данные и методы работы с данными, View отвечает за отображение и взаимодействие с пользователем, слой Presenter - отвечает за обработку и управление, Model и View напрямую не взаимодействуют, только через Presenter. Интерфейсы обозначены в файле (src/types/index.ts).

## Слой Model

1. **class BasketModel**
   Класс для реализации корзины, имплементирует интерфейс IBasketModel, отвечает за хранение товаров в корзине, добавление и удаление товаров, уведомление об изменении и посчёт общей цены товаров в корзине

```
items: Array<string>; // переменная, которая хранит массив с карточками 
```

Ключевые методы:

```
remove(id: string): void; // - удалить определенный товар из корзины
add(id: string): void; // - добавление карточки
inCart(id: string): boolean // - проверяет, находится ли данный товар (по id) в корзине. Возвращает true или false
_changed(): void; // - внутренний метод для генерации событий при изменении корзины
```

Пример использования _changed():

```
protected _changed() {
        this.events.emit('basket:change', {items: Array.from(this.items.keys())});  // в событии передаем данные корзины при изменении

    }
```

2. **class CatalogModel**
   Реализует интерфейс ICatalog представляет собой модель каталога товаров. Также использует интерфейс ICard

```
items:Map<string, ICard>; // - переменная для хранения карточек
```

Ключевые методы:

```
setItems(items: ICard[]): void; // - устанавливает карточки в катологе
getItem(id: string): ICard; // - по id возвращает карточку
```

3. **class Api**
   Класс для работы с данными с сервера. Вкючает в себя базовые методы управления - get и post (имеющие Type - generic-параметр), а также защищенный метод handleResponse - для обработки ответа с сервера. Инкапсулирует работу с fetch, добавляя базовый URL и настройки запросов

```
baseUrl: string;  // - базовый адресс API
options: RequestInit;  // - настройки запроса по умолчанию
```

Ключевые методы:

```
handleResponse(Response): Promise<object>;  // - обрабатывает ответ: возвращает JSON при успехе или отклоняет промис с ошибкой
get(string): Promise<ApiListResponse<Type>>;  // - выполняет GET-запрос для получения данных с сервера
post(string, oblect, ApiPostMethods): Promise;  // - выполняет POST/PUT/PATCH-запрос для отправки данных на сервер
```

4. **class ShopApi**
   Класс ShopApi наследует класс Api и расширяет его функциональность

Ключевые методы:

```
getCard(id: string): Promise<ICard>; // - получает данные одной карточки товара по её идентификатору и возвращает промис
getCards(): Promise<ApiListResponse<ICard>>; // -  получает список всех карточек товаров, и возвращает промис
```

## Слой View

Большая часть классов слоя представления будет наследовать абстрактный класс Component<T>, кроме классов FormOrderView и FormContactsView. Они будут наследовать класс Form<T>

1. **class Component**
   Является базовым абстрактным классом для слоя представления. Работает с DOM (HTMLElement, classList, textContent). Содержит методы для манипуляции с UI (скрыть, показать и тд.)

Конструктор:

```
protected constructor(protected readonly container: HTMLElement) // - принимает только HTMLElement
```

Ключевые методы:

```
toggleClass(element: HTMLElement, className: string, force?: boolean); // - переключить класс
protected setText(element: HTMLElement, value: unknown); // - установить текстовое содержимое
setDisabled(element: HTMLElement, state: boolean); // - сменить статус блокировки
protected setHidden(element: HTMLElement); // - скрыть
protected setVisible(element: HTMLElement); // - показать
protected setImage(element: HTMLImageElement, src: string, alt?: string); // - установить изображение с алтернативным текстом
render(data?: Partial<T>): HTMLElement; // - вернуть корневой DOM-элемент
```

2. **class Form**
   Наследует Component<IFormState>, имеет общие методы для обеих форм (order и contacts)

protected _submit: HTMLButtonElement // - кнопка отправки формы
protected _errors: HTMLElement // - контейнер для отображения ошибок валидации 

Ключевые методы:

```
protected onInputChange(field: keyof T, value: string); // - обрабатывает изменение значений полей формы
set valid(value: boolean); // - Устанавливает состояние валидности формы (активация/деактивация кнопки)
set errors(value: string); // - Устанавливает текст ошибки валидации
render(state: Partial<T> & IFormState); // - Отрисовывает форму с переданными данными и состоянием
```

3. **class Modal**
   Класс для модального окна. Контейнер модального окна выбирается из HTML разметки. В этом классе представленны все события, которые можно совершить с модальным окном - они одинаковы для каждого модального окна. Наследует Component<IModalData> 

```
protected _closeButton: HTMLButtonElement;
protected _content: HTMLElement;

constructor(container: HTMLElement, protected events: IEvents) // - конструктор с контейнером и событием
```

Ключевые методы:

```
set content(value: HTMLElement); - установить контент в HTML разметку
close(): void; // - метод закрытия модального окна, также отчищает данные при закрытии
open(): void; // - открытие модального окна 
render(data: IModalData): HTMLElement; // - рендер переданного контента в модальное окно
```

4. **class CardView**
   Класс для отображения одной карточки. Конструктор принимает аргументы: защищенный контейнер, в который будет рендерится карточка, защищенный events реализуемый через EventEmitter и inCart. Наследует класс Component<ICard>. Отображение карточки будет меняться в зависимости от того, какие данные мы запрашиваем в презентере

```
constructor(protected container: HTMLElement, protected events: EventEmitter, protected inCart: boolean = false) // - конструктор класса, inCart по умолчанию false, значение будет меняться при попадании в корзину 
```

Ключевые методы:

```
toggleInCart(); // - переключает состояние карточки (в корзине/не в корзине)
set id(value: string); // - устанавливает ID карточки
get id(): string; // - возвращает ID карточки
set title(value: string); // - устанавливает заголовок карточки
set image(value: string); // - устанавливает изображение карточки (с обработкой URL)
set description(value: string); // - устанавливает описание карточки
set category(value: string); // - устанавливает категорию карточки
set price(value: number | null); // - устанавливает цену карточки (с обработкой null)
set button(value: string); // - устанавливает текст кнопки
changeButtonDescription(inCart: boolean); // - изменяет текст кнопки в зависимости от состояния корзины
```

5. **class CardListView**
   Класс для отображения списка карточек. Наследует Component<HTMLElement[]>

```
constructor(protected container: HTMLElement); // - контейнер для списка карточек
```

Ключевые методы:

```
render(data: HTMLElement[]); // - принимает массив элементов и вставляет их в контейнер
```

6. **class BasketItemView**
   Класс для отображения одного товара в корзине. Наследует Component<HTMLElement>.

```
protected title: HTMLSpanElement; // - название товара
protected price: HTMLSpanElement; // - цена товара
protected deleteButton: HTMLButtonElement; // - кнопка удаления для данного товара
protected index: HTMLSpanElement; // - порядковый номер в корзине

constructor(protected container: HTMLElement, protected events: EventEmitter); // -  конструктор с контейнером и событием
```

Ключевые методы:

```
render(data: { id: string; index: number; title: string; price: string }) // - рендер одного товара в корзине
```

7. **class BasketView**
   Отображение всей корзины - со списком товаров. Наследует Component<IBasketData>

```
protected list: HTMLElement; // - список товаров в корзине
protected checkOutButton: HTMLButtonElement; // - кнопка оформления заказа
protected basketPrice: HTMLSpanElement; // - общая цена товаров в корзине

constructor(protected container: HTMLElement,protected events: EventEmitter) // - конструктор с контейнером и событием
```

Ключевые методы:

```
render(data: IBasketData); // - принимает данные IBasketData. Обновляет список товаров, меняет цену через textContent, обрабаьывает пустую корзину (блокирует кнопку, добавляет сообщение), частично управляет состоянием UI у кнопки оформления заказа
```

7. **class FormOrderView**
   Отображение формы оформления заказа. Имеет выбор способа оплаты и input для введения адреса. Наследует Form<IOrderFormData>. Если способ оплаты выбран, а адресс не введен, то отображает ошибку

```
constructor(container: HTMLFormElement, events: EventEmitter) // -  конструктор с контейнером и событием
```

Ключевые методы:

```
private handlePaymentSelect(paymentType: 'card' | 'cash'); // - обрабатывает выбор способа оплаты, обновляет визуальное состояние кнопок, инициирует валидацию формы
private validate() ; // - проверяет поля ввода, также управляет отображением ошибок и обновляет общее состояние формы
```

8. **class FormContactsView**
   Отображение формы для контактных данных. Реализует валидацию email и телефона. Форма имеет 2 поля input - для номера телефона и для адреса. Оба поля ввода обязательны. Наследует Form<IContactsFormData>

```
constructor(container: HTMLFormElement, events: EventEmitter) // - конструктор с контейнером и событием
```

Ключевые методы:

```
private validate() // - валидация формы контактных данных, проверяет коректно ли введены email и номер телефона
```

9. **class OrderSuccessView**
   Отображение успешно оформленного заказа. Наследует Component<ISuccessData>. Принимает description - описание результата заказа, в котором хранится поле с общей списанной суммой.

```
constructor(container: HTMLElement, events: EventEmitter) // - конструктор с контейнером и событием
```

Ключевые методы:

```
render(data: ISuccessData) // - обновляет отображение успешного заказа
```

10. **class page**
   Класс для отображения некоторых особенностей страницы: при открытии модальных окон, страница должна быть зафиксированна, nакже на корзине должно отображаться кол-во товаров, находящихся в ней

```
constructor(container: HTMLElement, protected events: IEvents) // - конструктор с контейнером и событием
```

Ключевые методы:

```
set basketCounter(value: number);  // - устанавливает значение счетчика корзины
set locked(value: boolean); // - блокировка скролла через value: boolean, добавление и удаление необходимого класса 'page__wrapper_locked'
```


## Слой Presenter
    Задача слоя презентера, как центрального управляющего элемента, координировать взаимодействие между слоями Model и View. Он подписывается на события, обновляет модели и управляет рендерингом представлений
    Последовательность действий презентера на примере добавления товара в корзину: пользователь добавляет товар в корзину, взаимодействие с View -> View генерирует событие добавления товара -> Presenter получает событие (с помощью EventEmitter()) и обновляет basketModel -> Model уведомляет об изменении данных -> Presenter вызывает renderBasket(), чтобы обновить отображение на странице

1. **class EventEmitter**
   Используется для взаимодействия между компонентами. Реализует систему событий (паттерн "Наблюдатель"), позволяет объектам подписываться на события и реагировать на них. Имплементирует интерфейс IEvents. on, off, emit - основнее методы, подписка на событие, отписка от события и уведомление объектам о наступлении события. onAll, offAll - дополнительные методы, подписка или отписка на все события. trigger - создает функцию-обработчик, которая при вызове генерирует указанное событие (полезно для передачи в другие компоненты без прямой зависимости от EventEmitter)

Пример подписки на изменение корзины: 
 
``` 
events.on('basket:change', (data: { items: string[] }) => {
	page.basketCounter = data.items.length; // - при изменении корзины меняется его счетчик на странице
});
``` 

Импортируются и объявляются все необходимые компоненты:

```
const api = new ShopApi(API_URL); // - API для работы с сервером
const events = new EventEmitter(); // - центральный EventEmitter
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events); // - модальное окно
const catalogModel = new CatalogModel(events); // - модель данных каталога товаров
const basketModel = new BasketModel(events); // - модель данных корзины
const basketView = new BasketView(document.querySelector('.basket'), events); // - представление корзины товаров
const cardListView = new CardListView(document.querySelector('.gallery')); // - представление списка карточек товаров
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog'); // - шаблон карточки товара для каталога
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-preview'); // - шаблон карточки товара 
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket'); // - шаблон элемента корзины
const page = new Page(document.querySelector('.page'), events); // - Основной контроллер страницы
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order'); // - шаблон формы оформления заказа
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts'); // - шаблон формы контактных данных
const successTemplate = ensureElement<HTMLTemplateElement>('#success'); // - шаблон страницы успешного оформления заказа
```

Загружаем карточки с сервера, сохраняем их в модель каталога и отрисоваем на странице:

```
api
	.getCards()
	.then((res) => res.items)
	.then((items) => catalogModel.setItems(items))
	.catch((err) => console.error(err));
```

Описание событий:

```
events.on('catalog:change', (data: { items: ICard[] }) => {}); // - срабатывает при изменении каталога товаров, получает массив карточек и для каждой создает экземпляр CardView на основе шаблона cardCatalogTemplate. Далее рендерит карточки и передает их в cardListView для отображения в каталоге

events.on('ui:card-click', (data: { id: string }) => {}); // - срабатывает при клике на карточку в каталоге. Создает экземпляр CardView с шаблоном cardTemplate и передает его в модальное окно

events.on('ui:card-add', (events: { id: string }) => {}); // -  добавляет товар в корзину

events.on('ui:card-remove', (events: { id: string }) => {}); // - удаляет товар из корзины

events.on('modal:close', () => {page.locked = false}); // - срабатывает при закрытии модального окна, разблокировка страницы для скролла

events.on('basket:open', () => {}); // - открытие корзины. Создает массив элементов корзины basketItems, а также экземпляры BasketItemView с шаблоном basketItemTemplate -> заполняет данные товара, добавляет элементы в массив basketItems, считает общую сумму -> рендерит корзину через basketView.render и открывает модальное окно

events.on('ui:basket-remove', (data: { id: string }) => {}); // - удаляет товар из корзины через basketModel.remove, пересчитывает список товаров и общую сумму, затем обновляет модальное окно с актуальными данными корзины

events.on('basket:change', (data: { items: string[] }) => {}); // - срабатывает при изменении содержимого корзины. Обновляет счетчик товаров в корзине

events.on('ui:basket-checkOut', () => {}); // - срабатывает при нажатии кнопки "Оформить заказ". Создает форму заказа (FormOrderView) с шаблоном orderFormTemplate и открывает её в модальном окне

events.on('order:submit', () => {}); // - срабатывает при отправке формы заказа. Создает форму контактов (FormContactsView) с шаблоном contactsFormTemplate и открывает её в модальном окне

events.on('contacts:submit', () => {}); // - срабатывает при отправке формы контактов. Считает общую сумму заказа, создает уведомление об успешном оформлении заказа (OrderSuccessView) с шаблоном successTemplate, отображает сообщение о списании 'синапсов' -> jчищает корзину и обнуляет счетчик

events.on('ui:successOrder-close', () => {}); // - cрабатывает при закрытии окна успешного заказа. Закрывает модальное окно (modal.close())
```