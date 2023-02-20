import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";
import { ProviderService } from "../provider/provider.service";
import {
  createCustomerInput,
  createPaymentInput,
  createProductInput,
  createLinkInput,
} from "./stripe.type";
import { Stripe } from "stripe";
import { FlowService } from "../flow/flow.service";

@Injectable()
export class StripeService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
    private flowService: FlowService,
  ) {}

  async handleWebhook(body: any) {
    console.log(body);
    if (body.data) {
      switch (body.type) {
        case "customer.created":
          const user = await this.userService.getUserByProviderId(body.data.id);
          const customer_name = body.data.object.name;
          const customer_email = body.data.object.email;
          const customer_phone = body.data.object.phone;
          await this.flowService.addOrUpdateWebhookData({
            userId: user.id,
            provider: "stripe",
            type: "customer_created",
            data: JSON.stringify({
              customer_name,
              customer_email,
              customer_phone,
            }),
          });
          console.log("customer created");
          break;
        case "charge.succeeded":
          const charge_amount = body.data.object.amount;
          const charge_currency = body.data.object.currency;
          const charge_customer = body.data.object.customer;
          const charge_description = body.data.object.description;
          await this.flowService.addOrUpdateWebhookData({
            userId: user.id,
            provider: "stripe",
            type: "payment_created",
            data: JSON.stringify({
              charge_amount,
              charge_currency,
              charge_customer,
              charge_description,
            }),
          });
          console.log("payment created");
          break;
        case "product.created":
          const product_name = body.data.object.name;
          const product_description = body.data.object.description;
          const product_price = body.data.object.price; // NO PRICE
          const product_currency = body.data.object.currency; // NO CURRENCY
          await this.flowService.addOrUpdateWebhookData({
            userId: user.id,
            provider: "stripe",
            type: "product_created",
            data: JSON.stringify({
              product_name,
              product_description,
              product_price,
              product_currency,
            }),
          });
          console.log("product created");
          break;
        case "payment_link.created":
          const link_price = body.data.object.price; // NO PRICE
          const link_quantity = body.data.object.quantity; // NO QUANTITY
          await this.flowService.addOrUpdateWebhookData({
            userId: user.id,
            provider: "stripe",
            type: "payment_link_created",
            data: JSON.stringify({
              link_price,
              link_quantity,
            }),
          });
          console.log("payment link created");
          break;
        default:
          break;
      }
    }
  }

  async createWebhook(userId: number) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "stripe",
      true,
    );
    const stripeClient = new Stripe(accessToken, {
      apiVersion: "2022-11-15",
    });
    const env = this.configService.get("env");
    const webhookProdUrl =
      this.configService.get("api_url") + "/stripe/webhook";
    const webhookDevUrl = "https://9a0d-163-5-23-73.eu.ngrok.io/stripe/webhook";
    const finalUrl = env === "production" ? webhookProdUrl : webhookDevUrl;
    await stripeClient.webhookEndpoints.create({
      url: finalUrl,
      enabled_events: [
        "customer.created",
        "charge.succeeded",
        "product.created",
        "payment_link.created",
      ],
    });
    return {
      message: "webhook_created",
    };
  }

  async createCredentials(userId: number, accessToken: string) {
    const stripe = new Stripe(accessToken, {
      apiVersion: "2022-11-15",
    });
    const { id } = await stripe.accounts.retrieve();
    if (!id) throw new BadRequestException("invalid_credentials");
    const response = await this.providerService.addCredentials(
      userId,
      id,
      "stripe",
      accessToken,
    );
    return {
      message: "credentials_added",
      data: response,
    };
  }

  async createPayment(userId: number, createPaymentInput: createPaymentInput) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "stripe",
      true,
    );
    const stripeClient = new Stripe(accessToken, {
      apiVersion: "2022-11-15",
    });
    const response = await stripeClient.charges.create({
      amount: createPaymentInput.stripe_payment_amount,
      currency: createPaymentInput.stripe_payment_currency,
      customer: createPaymentInput.stripe_payment_customer,
      description: createPaymentInput.stripe_payment_description,
    });
    return {
      message: "payment_created",
      data: response,
    };
  }

  async createCustomer(
    userId: number,
    createCustomerInput: createCustomerInput,
  ) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "stripe",
      true,
    );
    const stripeClient = new Stripe(accessToken, {
      apiVersion: "2022-11-15",
    });
    const response = await stripeClient.customers.create({
      name: createCustomerInput.stripe_customer_name,
      email: createCustomerInput.stripe_customer_email,
      phone: createCustomerInput.stripe_customer_phone,
    });
    return {
      message: "customer_created",
      data: response,
    };
  }

  async createProduct(userId: number, createProductInput: createProductInput) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "stripe",
      true,
    );
    const stripeClient = new Stripe(accessToken, {
      apiVersion: "2022-11-15",
    });
    const product_id = createProductInput.stripe_product_name
      .toLowerCase()
      .replace(/\s/g, "");
    const response = await stripeClient.products.create({
      name: createProductInput.stripe_product_name,
      description: createProductInput.stripe_product_description,
      id: "product-" + product_id,
    });
    console.log(product_id);
    if (!response) throw new BadRequestException("product_not_created");
    const price = await stripeClient.prices.create({
      product: response.id,
      unit_amount: createProductInput.stripe_product_price,
      currency: createProductInput.stripe_product_currency,
    });
    if (!price) throw new BadRequestException("price_not_created");
    return {
      message: "product_created",
      data: response,
    };
  }

  async createLink(userId: number, createLinkInput: createLinkInput) {
    const { accessToken } = await this.providerService.getCredentialsByProvider(
      userId,
      "stripe",
      true,
    );
    const stripeClient = new Stripe(accessToken, {
      apiVersion: "2022-11-15",
    });
    const response = await stripeClient.paymentLinks.create({
      line_items: [
        {
          price: createLinkInput.stripe_link_price,
          quantity: createLinkInput.stripe_link_quantity,
        },
      ],
    });
    return {
      message: "payment_link_created",
      data: response,
    };
  }
}
