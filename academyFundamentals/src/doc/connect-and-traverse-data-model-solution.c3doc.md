Topic Type: Reference
Audience: Customer
Title: Solutions for Lab 2 - Connect Types and Traverse a Data Model
Abstract: Solutions for the activities in Lab 2.

> If you are viewing this document in VS Code, you can use the keyboard shortcut `Shift` + `Ctrl/Cmd` + `V` to open a preview of the markdown file.

## Table of contents

- [Section 1](#section-1)
  - [Activity 1.1](#activity-11)
- [Section 2](#section-2)
  - [Activity 2.1](#activity-21)
  - [Activity 2.2](#activity-22)
  - [Activity 2.3](#activity-23)
- [Section 3](#section-3)
  - [Activity 3.1](#activity-31)
  - [Activity 3.2](#activity-32)
  - [Activity 3.3](#activity-33)

## Section 1

### Activity 1.1

`Store.c3typ`

```c3typ
entity type Store {

    /**
     * The {@link City} the store is located in.
     *
     * Lab 2 - Activity 1.1 solution:
     */
    city: City

}
```

`LineItem.c3typ`

```c3typ
entity type LineItem {

    /**
     * The sale that this line item is part of.
     */
    sale: Sale

    /**
     * The product that is being purchased in this line item.
     */
    product: Product

}
```

`Sale.c3typ`

```c3typ
entity type Sale {

    /**
     * The store that the transaction was made at.
     */
    store: Store

}
```

## Section 2

### Activity 2.1

`City.c3typ`

```c3typ
entity type City {

    /**
     * The stores in the city.
     */
    stores: [Store]

}
```

### Activity 2.2

`City.c3typ`

```c3typ
entity type City {

    /**
     * The stores in the city.
     */
    stores: [Store](city)

}
```

### Activity 2.3

`Sale.c3typ`

```c3typ
entity type Sale {

    /**
     * The line items receipt of the transaction.
     */
    itemization: [LineItem](sale)

}
```

`Product.c3typ`

```c3typ
entity type Product {

    /**
     * The transcation line items that include this product.
     */
    sales: [LineItem](product)

}
```

`Store.c3typ`

```c3typ
entity type Store {

    /**
     * The {@link Sale}s made at the store.
     */
    sales: [Sale](store)

}
```

## Section 3

### Activity 3.1

```js
LineItem.fetch({ include: "[this, product.unitPrice]" });
```

### Activity 3.2

```js
Store.fetch({ include: "[this, city.salesTaxRate]" });
```

### Activity 3.3

```js
Sale.fetch({ include: "[this, store.city.salesTaxRate]", limit: 1 });
```
