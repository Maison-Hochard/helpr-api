import { prisma } from "../../../seed";

export async function customerCreatedTrigger(providerId: number) {
  return await prisma.trigger.create({
    data: {
      title: "Customer Created",
      name: "customer-created",
      description: "Triggered when a customer is created",
      value: "customer-created",
      providerId: providerId,
      provider: "stripe",
      variables: {
        create: [
          {
            title: "Customer Name",
            name: "stripe_customer_name",
            value: "{stripe_customer_name}",
          },
          {
            title: "Customer Email",
            name: "stripe_customer_email",
            value: "{stripe_customer_email}",
          },
          {
            title: "Customer Phone",
            name: "stripe_customer_phone",
            value: "{stripe_customer_phone}",
          },
        ],
      },
    },
  });
}

export async function paymentCreatedTrigger(providerId: number) {
  return await prisma.trigger.create({
    data: {
      title: "Payment Created",
      name: "payment-created",
      description: "Triggered when a payment is created",
      value: "payment-created",
      providerId: providerId,
      provider: "stripe",
      variables: {
        create: [
          {
            title: "Payment Amount",
            name: "stripe_payment_amount",
            value: "{stripe_payment_amount}",
          },
          {
            title: "Payment Currency",
            name: "stripe_payment_currency",
            value: "{stripe_payment_currency}",
          },
          {
            title: "Payment Customer",
            name: "stripe_payment_customer",
            value: "{stripe_payment_customer}",
          },
          {
            title: "Payment Description",
            name: "stripe_payment_description",
            value: "{stripe_payment_description}",
          },
        ],
      },
    },
  });
}

export async function productCreatedTrigger(providerId: number) {
  return await prisma.trigger.create({
    data: {
      title: "Product Created",
      name: "product-created",
      description: "Triggered when a product is created",
      value: "product-created",
      providerId: providerId,
      provider: "stripe",
      variables: {
        create: [
          {
            title: "Product Name",
            name: "stripe_product_name",
            value: "{stripe_product_name}",
          },
          {
            title: "Product Description",
            name: "stripe_product_description",
            value: "{stripe_product_description}",
          },
        ],
      },
    },
  });
}
