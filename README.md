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

Для реализации данной проектной работы использован MVP-паттерн, который состоит из Model (слоя модель), View (слоя представления) и Presenter (слоя презентера). Model хранит в себе данные и методы работы с данными, View отвечает за отображение и взаимодействие с пользователем, слой Presenter - отвечает за обработку и управление, Model и View напрямую не взаимодействуют, только через Presenter. Интерфейсы обозначены в файле (src/types/index.ts)

## Слой Model

1. **class BasketModel**
   Класс для реализации корзины, имплементирует интерфейс IBasketModel, отвечает за хранение товаров в корзине, добавление и удаление товаров, уведомление об изменении и посчёт общей цены товаров в корзине

```
items: Map<string, number>; // переменная, в которой хранится словарь с данными ключ-значения (key-value). В данном случае key имеет тип - string, value - number. Map<string, number> - хранит id товара и количество
```

Ключевые методы:

```
remove(id: string): void; // - удалить определенный товар из корзины
add(id: string): void; // - добавление карточки
countTotal(): number; // - метод посчёта общей цены товаров в корзине
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
setItems(items:ICard[]): void; // - устанавливает карточки в катологе
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
getCards(): Promise<ICard[]>; // -  получает список всех карточек товаров, и возвращает промис
```

## Слой View

Каждый из классов слоя представления будет имплементировать интерфейс IView. Он определяет стандартную структуру для всех View-классов: метод render(), который принимает опциональные данные (data?: object) и возвращает HTML-элемент для отображения на странице

1. **class CardView**
   Класс для отображения одной карточки. Конструктор принимает аргументы: защищенный контейнер, в который будет рендерится карточка и защищенный events реализуемый через EventEmitter. Далее этот констуктор будет повторяться в других классах

```
constructor(protected container: HTMLElement,  protected events: EventEmitter); // - конструктор класса
```

Ключевые методы:

```
render(data: {item: ICard}); // - рендерит карточку на основе переданных данных
```

2. **class CardListView**
   Класс для отображения списка карточек

```
constructor(protected container: HTMLElement); // - контейнер для списка карточек
```

Ключевые методы:

```
render(data: {items: HTMLElement[]}); // - принимает массив элементов и вставляет их в контейнер
```

3. **class CardModalView**
   Отображение карточки в модальном окне

```
constructor(protected container: HTMLElement,  protected events: EventEmitter); // - в констукторе указаны: контейнер модального окна и механизм событий реализованный через EventEmitter
```

Ключевые методы:

```
render(data: {item: ICard}); // - рендерит карточку товара в модальном окне
```

4. **class Modal**
   Класс для модального окна. Контейнер модального окна выбирается из HTML разметки. В этом классе представленны все события, которые можно совершить с модальным окном - они одинаковы для каждого модального окна

```
modalElement: HTMLElement; // - выбираем элемент модального окна

constructor(protected container: HTMLElement,  protected events: EventEmitter); // - конструктор с контейнером и событием
```

Ключевые методы:

```
close(): void; // - метод закрытия модального окна, также в нем будет реализован метод для отчистки данных при закрытии (clear(): void)
open(): void; // - открытие модального окна
render(data: {modalContent: HTMLElement}): HTMLElement; // - рендер переданного контента в модальное окно
```

5. **class BasketItemView**
   Класс для отображения одного товара в корзине:

```
title: HTMLSpanElement; // - название товара
removeButton: HTMLButtonElement; // - кнопка удаления для данного товара
id: string | null = null; // - id товара
price: HTMLSpanElement; // - цена товара

constructor(protected container: HTMLElement, protected events: EventEmitter); // -  конструктор с контейнером и событием
```

Ключевые методы:

```
render(data: {item: ICard}); // - рендер одного товара в корзине
```

6. **class BasketView**
   Отображение всей корзины - со списком товаров

```
constructor(protected container: HTMLElement); // - контейнер корзины
```

Ключевые методы:

```
render(data: {items: HTMLElement[]}); // - принимает массив элементов (BasketItemView) и рендерит их
```

7. **class FormView**
   Отображение формы оформления заказа. Универсален для обоих форм

```
constructor(protected container: HTMLElement,  protected events: EventEmitter); // -  конструктор с контейнером и событием
```

Ключевые методы:

```
render(data: {form: HTMLElement}): HTMLElement; // - рендер формы
```

8. **class OrderView**
   Отображение информации о заказе

```
constructor(protected container: HTMLElement,  protected events: EventEmitter); // - конструктор с контейнером и событием
```

Ключевые методы:

```
render(data: {order: HTMLElement}): HTMLElement; // - рендер формы
```

## Слой Presenter

    Задача слоя презентера, как центрального управляющего элемента, координировать взаимодействие между слоями Model и View. Он подписывается на события, обновляет модели и управляет рендерингом представлений
    Последовательность действий презентера на примере добавления товара в корзину: пользователь добавляет товар в корзину, взаимодействие с View -> View генерирует событие добавления товара -> Presenter получает событие (с помощью EventEmitter()) и обновляет basketModel -> Model уведомляет об изменении данных -> Presenter вызывает renderBasket(), чтобы обновить отображение на странице

Также же импортируются и объявляются все необходимые компоненты:

```
api = new ShopAPI(); // - API для работы с сервером
events = new EventEmitter(); // - центральный EventEmitter
modal = new Modal(container, events); // - модальное окно

basketView = new BasketView(document.querySelector('.basket')); // - корзина
basketModel = new BasketModel(events); // - модель корзины
catalogModel = new CatalogModel(events); // - модель каталога
```

Ключевые методы:

```
renderBasket(items: string[]): void; // - обновляет отображение корзины
renderCardList(): void; // - рендерит список товаров
renderCardModal(id: string): void; // - рендерит модальное окно с карточкой товара
renderForm(templateId: string): void; // - рендерит форму, для этого использует уникальный идентификатор шаблона формы
renderOrderSuccess(): void; // - рендерит отображение заказа
```

1. **class EventEmitter**
   Используется для взаимодействия между компонентами. Реализует систему событий (паттерн "Наблюдатель"), позволяет объектам подписываться на события и реагировать на них. Имплементирует интерфейс IEvents. on, off, emit - основнее методы, подписка на событие, отписка от события и уведомление объектам о наступлении события. onAll, offAll - дополнительные методы, подписка или отписка на все события. trigger - создает функцию-обработчик, которая при вызове генерирует указанное событие (полезно для передачи в другие компоненты без прямой зависимости от EventEmitter)

Пример подписки на изменение корзины:

```
events.on('basket:change', (data: { items: string[]}) => {
    // выводим куда-то
});
```