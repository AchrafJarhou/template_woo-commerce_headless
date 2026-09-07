export const mockCartItems = [
  {
    id: 103,
    name: "SL-03",
    quantity: 2,
    price: "540,00 €",
    total: "1 080,00 €",
    image: "https://placeholder.pics/svg/80/DEDEDE/555555/SL-03",
  },
  {
    id: 101,
    name: "SL-01",
    quantity: 1,
    price: "260,00 €",
    total: "260,00 €",
    image: "https://placeholder.pics/svg/80/DEDEDE/555555/SL-01",
  },
];

export const mockCartTotals = {
  subtotal: "1 340,00 €",
  shipping: "0,00 €",
  tax: "0,00 €",
  total: "1 340,00 €",
};

export const mockShippingAddress = {
  firstName: "Jean",
  lastName: "Dupont",
  address: "456 Avenue de la République",
  city: "Lyon",
  postcode: "69000",
  country: "France",
  email: "jean.dupont@email.com",
  phone: "+33 1 23 45 67 89",
};

export const mockBillingAddress = {
  firstName: "Jean",
  lastName: "Dupont",
  company: "Tech Solutions",
  address: "123 Rue de la Paix",
  city: "Paris",
  postcode: "75001",
  country: "France",
  email: "jean.dupont@email.com",
  phone: "+33 1 23 45 67 89",
};
