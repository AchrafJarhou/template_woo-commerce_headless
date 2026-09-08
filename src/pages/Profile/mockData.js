export const mockUser = {
  username: 'jean.dupont',
  email: 'jean.dupont@email.com',
  firstName: 'Jean',
  lastName: 'Dupont',
};

export const mockBilling = {
  firstName: 'Jean',
  lastName: 'Dupont',
  company: 'Tech Solutions',
  address_1: '123 Rue de la Paix',
  city: 'Paris',
  postcode: '75001',
  country: 'France',
  email: 'jean.dupont@email.com',
  phone: '+33 1 23 45 67 89',
};

export const mockShipping = {
  firstName: 'Jean',
  lastName: 'Dupont',
  address_1: '456 Avenue de la République',
  city: 'Lyon',
  postcode: '69000',
  country: 'France',
};

export const mockOrders = [
  {
    id: 1,
    number: '#12345',
    date: '15 Septembre 2024',
    total: '125,50 €',
    status: 'Livré',
    items: 3,
  },
  {
    id: 2,
    number: '#12344',
    date: '8 Septembre 2024',
    total: '89,99 €',
    status: 'En cours de livraison',
    items: 2,
  },
  {
    id: 3,
    number: '#12343',
    date: '1 Septembre 2024',
    total: '250,00 €',
    status: 'Livré',
    items: 5,
  },
  
];
