Topic Type: Reference
Audience: Customer
Title: Solutions for Lab 1 - Create and Query Persistable Types.
Abstract: Solutions for the activities in Lab 1.

> If you are viewing this document in VS Code, you can use the keyboard shortcut `Shift` + `Ctrl/Cmd` + `V` to open a preview of the markdown file.

## Table of Contents

- [Section 1](#section-1)
  - [Activity 1.1](#activity-11)
  - [Activity 1.2](#activity-12)
  - [Activity 1.3](#activity-13)
  - [Activity 1.4](#activity-14)
  - [Activity 1.5](#activity-15)
- [Section 2](#section-2)
  - [Activity 2.1](#activity-21)
  - [Activity 2.2](#activity-22)
  - [Activity 2.3](#activity-23)
- [Section 3](#section-3)
  - [Activity 3.1](#activity-31)
  - [Activity 3.2](#activity-32)
  - [Bonus Activity](#bonus-activity)

## Section 1

### Activity 1.1

`Store.c3typ`

```js
/**
 * Store.c3typ
 * Represents a store.
 */
entity type Store {

    /**
     * The full address of the store.
     */
    address: string

    /**
     * The latitude of the store's location.
     */
    latitude: float

    /**
     * The longitude of the store's location.
     */
    longitude: float

    /**
     * The {@link City} the store is located in.
     */
    city: string

}
```

### Activity 1.2

`City.c3typ`

```js
/**
 * City.c3typ
 * Represents a city.
 */
entity type City {

    /**
     * The name of the city.
     */
    name: string

    /**
     * The population of the city.
     */
    population: int

    /**
     * The sales tax rate applied to transactions in the city.
     */
    salesTaxRate: float

}

```

### Activity 1.3

`Sale.c3typ`

```js
/**
 * Sale.c3typ
 * The transactions made at a store.
 */
entity type Sale {

    /**
     * The date and time the transaction was made.
     */
    date: datetime

    /**
     * The payment method used for the transaction.
     */
    paymentMethod: string

    /**
     * The store that the transaction was made at.
     */
    store: string

    /**
     * The total price charged for the transaction.
     */
    totalPrice: float

}
```

### Activity 1.4

`LineItem.c3typ`

```js
/**
 * LineItem.c3typ
 * The line item of a {@link Transcation} made at a store.
 */
entity type LineItem {

    /**
     * The sale that this line item is part of.
     */
    sale: string

    /**
     * The quantity of the product being purchased in this line item.
     * This is a float to allow for fractional quantities, in
     * case of products sold by weight or volume.
     */
    quantity: float

    /**
     * The price of the products at the time of purchase.
     */
    price: float

    /**
     * The product that is being purchased in this line item.
     */
    product: string

}

```

### Activity 1.5

`Product.c3typ`

```js
/**
 * Product.c3typ
 * A product sold at a {@link Store} as part of a {@link Sale}.
 */
entity type Product {

    /**
     * The name of the product.
     */
    name: string

    /**
     * The description of the product.
     */
    description: string

    /**
     * The category of the product.
     */
    category: string

    /**
     * The unit price of the product.
     */
    unitPrice: double

}
```

## Section 2

### Activity 2.1

```js
City.make({
  id: 'NYC',
  name: 'New York City',
  population: 8478072,
  salesTaxRate: 8.875,
}).create();
```

### Activity 2.2

```js
City.make({
  id: 'RWC',
  name: 'Redwood City',
  population: 84292,
}).merge();
```

### Activity 2.3

```js
// Iterative approach
stores.forEach((store) => Store.make(store).create());
products.forEach((product) => Product.make(product).create());

// Batch method approach
Store.createBatch(stores);
Product.createBatch(products);
```

## Section 3

### Activity 3.1

```js
City.fetch({ filter: Filter.ge('salesTaxRate', 9) });
```

### Activity 3.2

```js
Store.fetch({
  filter: Filter.eq('city', 'city_001').or().eq('city', 'city_002'),
  include: 'id, latitude, longitude',
});
```

### Bonus Activity

```js
filter = {
  filter: Filter.eq('category', 'Clothing').or().eq('category', 'Footwear'),
};
sale_products = Product.fetch({ filter: filter }).objs;

for (i = 0; i < sale_products.length; i++) {
  product = sale_products[i];

  // TODO: Update the price of the product based on its category
  // Hint: Use an if/else statement to check the category, and access the
  // `unitPrice` field to update the price.
  if (product.category == 'Clothing') {
    updatedPrice = product.unitPrice * 0.75; // Apply a 25% discount for Clothing
  } else {
    updatedPrice = product.unitPrice * 0.6; // Apply a 40% discount for Footwear
  }

  // TODO: Persist the changes.
  // Hint: Access the `id` field of the product and use .make({...})
  // to create the updated Product object.
  Product.make({ id: product.id, unitPrice: updatedPrice }).merge();
}

// Display results
Product.fetch(filter);
```

## Section 4

### Activity 4.1

```js
Store.removeAll(null, true);
Product.removeAll(null, true);
```
