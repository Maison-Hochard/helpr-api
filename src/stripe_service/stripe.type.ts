export type createCustomerInput = {
  name: string;
  email: string;
  phone: string;
};

export type createPaymentInput = {
  amount: number;
  currency: string;
  customer: string;
  description: string;
};

export type createProductInput = {
  name: string;
  description: string;
  price: number;
  currency: string;
};

export type createLinkInput = {
  price: string;
  quantity: number;
};
