export const mockCart = {
  items: [
    {
      key: "9f1c4a7b2e",
      id: 101,
      name: "SL-03",
      permalink: "https://exemple.test/product/sl-03/",
      images: [
        {
          thumbnail: "https://placeholder.pics/svg/160/DEDEDE/555555/SL-03",
        },
      ],
      quantity: 2,
      quantity_limits: { minimum: 1, maximum: 10 },
      variation: [{ attribute: "Taille", value: "42" }],
      prices: {
        price: "54000",
        currency_code: "EUR",
        currency_minor_unit: 2,
      },
      totals: {
        line_total: "108000",
        currency_code: "EUR",
        currency_minor_unit: 2,
      },
    },
    {
      key: "3d8e6b0f51",
      id: 102,
      name: "SL-01",
      permalink: "https://exemple.test/product/sl-01/",
      images: [
        {
          thumbnail: "https://placeholder.pics/svg/160/DEDEDE/555555/SL-01",
        },
      ],
      quantity: 1,
      quantity_limits: { minimum: 1, maximum: 4 },
      variation: [],
      prices: {
        price: "26000",
        currency_code: "EUR",
        currency_minor_unit: 2,
      },
      totals: {
        line_total: "26000",
        currency_code: "EUR",
        currency_minor_unit: 2,
      },
    },
  ],
  totals: {
    total_items: "134000",
    total_shipping: null,
    total_tax: "0",
    total_price: "134000",
    currency_code: "EUR",
    currency_minor_unit: 2,
  },
  coupons: [],
};
