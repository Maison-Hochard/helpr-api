import { prisma } from "../../../seed";

export async function createCustomerAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Customer",
      description: "Create a Stripe customer",
      endpoint: "stripe",
      name: "create-customer",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Create Customer Name",
            name: "stripe_customer_name",
            value: "{stripe_customer_name}",
          },
          {
            title: "Create Customer Email",
            name: "stripe_customer_email",
            value: "{stripe_customer_email}",
          },
          {
            title: "Create Customer Phone",
            name: "stripe_customer_phone",
            value: "{stripe_customer_phone}",
          },
        ],
      },
    },
  });
}

export async function createPaymentAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Payment",
      description: "Create a Stripe payment",
      endpoint: "stripe",
      name: "create-payment",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Create Payment Amount",
            name: "stripe_payment_amount",
            value: "{stripe_payment_amount}",
          },
          {
            title: "Create Payment Currency",
            name: "stripe_payment_currency",
            value: "{stripe_payment_currency}",
          },
          {
            title: "Create Payment Customer",
            name: "stripe_payment_customer",
            value: "{stripe_payment_customer}",
          },
          {
            title: "Create Payment Description",
            name: "stripe_payment_description",
            value: "{stripe_payment_description}",
          },
        ],
      },
    },
  });
}

export async function createProductAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Product",
      description: "Create a Stripe product",
      endpoint: "stripe",
      name: "create-product",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Create Product Name",
            name: "stripe_product_name",
            value: "{stripe_product_name}",
          },
          {
            title: "Create Product Description",
            name: "stripe_product_description",
            value: "{stripe_product_description}",
          },
          {
            title: "Create Product Price",
            name: "stripe_product_price",
            value: "{stripe_product_price}",
          },
          {
            title: "Create Product Currency",
            name: "stripe_product_currency",
            value: "{stripe_product_currency}",
          },
        ],
      },
    },
  });
}

export async function createPaymentLinkAction(providerId: number) {
  return await prisma.action.create({
    data: {
      title: "Create Payment Link",
      description: "Create a Stripe payment link",
      endpoint: "stripe",
      name: "create-link",
      providerId: providerId,
      variables: {
        create: [
          {
            title: "Create Link Price",
            name: "stripe_link_price",
            value: "{stripe_link_price}",
          },
          {
            title: "Create Link Quantity",
            name: "stripe_link_quantity",
            value: "{stripe_link_quantity}",
          },
        ],
      },
    },
  });
}
