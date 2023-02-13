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

@Injectable()
export class StripeService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private providerService: ProviderService,
  ) {}

  async handleWebhook(body: any) {
    console.log(body);
    if (body.data) {
      const { object } = body.data;
      switch (body.type) {
        case "customer.created":
          console.log("customer created");
          break;
        case "charge.succeeded":
          console.log("charge succeeded");
          break;
        case "product.created":
          console.log("product created");
          break;
        case "payment_link.created":
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
    const webhookDevUrl = "https://a09d-163-5-23-73.eu.ngrok.io/stripe/webhook";
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
      amount: createPaymentInput.amount,
      currency: createPaymentInput.currency,
      customer: createPaymentInput.customer,
      description: createPaymentInput.description,
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
      name: createCustomerInput.name,
      email: createCustomerInput.email,
      phone: createCustomerInput.phone,
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
    const product_id = createProductInput.name.toLowerCase().replace(/\s/g, "");
    const response = await stripeClient.products.create({
      name: createProductInput.name,
      description: createProductInput.description,
      id: "product-" + product_id,
    });
    console.log(product_id);
    if (!response) throw new BadRequestException("product_not_created");
    const price = await stripeClient.prices.create({
      product: response.id,
      unit_amount: createProductInput.price,
      currency: createProductInput.currency,
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
          price: createLinkInput.price,
          quantity: createLinkInput.quantity,
        },
      ],
    });
    return {
      message: "payment_link_created",
      data: response,
    };
  }
}
