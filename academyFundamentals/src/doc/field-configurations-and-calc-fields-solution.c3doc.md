Topic Type: Reference
Audience: Customer
Title: Solutions for Lab 3 - Configure Fields and Create Calculated Fields
Abstract: Solutions for the activities in Lab 3.

> If you are viewing this document in VS Code, you can use the keyboard shortcut `Shift` + `Ctrl/Cmd` + `V` to open a preview of the markdown file.

## Table of Contents

- [Section 1](#section-1)
  - [Activity 1.1](#activity-11)
  - [Activity 1.2](#activity-12)
  - [Bonus Activity 1.2](#bonus-activity-12)
- [Section 2](#section-2)
  - [Activity 2.1](#activity-21)
  - [Activity 2.2](#activity-22)
  - [Bonus Activity 2.2](#bonus-activity-22)

## Section 1

### Activity 1.1

`Store.c3typ`

```c3typ
entity type Store {

    /**
     * The full address of the store.
     */
    address: !string

}
```

`City.c3typ`

```c3typ
entity type City {

    /**
     * The name of the city.
     */
    name: !string

}
```

`Sale.c3typ`

```c3typ
entity type Sale {

    /**
     * The date and time the transaction was made.
     */
    date: !datetime

}
```

### Activity 1.2

`Sale.c3typ`

```c3typ
entity type Sale {

    /**
     * The payment method used for the transaction.
     */
    paymentMethod: !string enum('Credit Card', 'Debit Card', 'Cash', 'Mobile Payment')

}
```

### Bonus Activity 1.2

`PaymentMethod.c3typ`

```c3typ
/**
 * PaymentMethod.c3typ
 * The payment method used in {@link Sale} transactions.
 */
enum type PaymentMethod {

    /**
     * Payment made using a credit card.
     */
    CREDIT_CARD = 'Credit Card'

    /**
     * Payment made using a debit card.
     */
    DEBIT_CARD = 'Debit Card'

    /**
     * Payment made using cash.
     */
    CASH = 'Cash'

    /**
     * Payment made using a mobile payment method.
     */
    MOBILE_PAYMENT = 'Mobile Payment'

}
```

`Sale.c3typ`

```c3typ
entity type Sale {

    /**
     * The payment method used for the transaction.
     */
    paymentMethod: !string enum PaymentMethod

}
```

## Section 2

### Activity 2.1

`LineItem.c3typ`

```c3typ
entity type LineItem {

    /**
     * The price of the products at the time of purchase.
     */
    price: float stored calc product.unitPrice * quantity

}
```

### Activity 2.2

`Sale.c3typ`

```c3typ
entity type Sale {

    /**
     * The tax rate applied to the transaction.
     */
    taxRate: float calc store.city.salesTaxRate / 100

}
```

### Bonus Activity 2.2

`Sale.c3typ`

```c3typ
entity type Sale {

    taxRate: float calc store.city.salesTaxRate / 100

    /**
     * The total price charged for the transaction.
     * This solution uses taxRate.
     */
    totalPrice: float stored calc round(sum(itemization.price)*(1 + taxRate), 2)

}
```
