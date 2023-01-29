import { Injectable } from "@nestjs/common";
import { MailingService } from "../mailing/mailing.service";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
import Stripe from "stripe";

@Injectable()
export class StripeService {
  private stripe;

  constructor(
    private prisma: PrismaService,
    private mailingService: MailingService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get("stripe.secret_key"), {
      apiVersion: "2022-11-15",
    });
  }

  async createCheckoutSession(
    userId: number,
    priceId: string,
    quantity: number,
  ): Promise<Stripe.Checkout.Session> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const url = `${this.configService.get("app.url")}/stripe/checkout-success`;
    return await this.stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      customer_email: user.email,
      success_url: `${url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: url,
    });
  }
}
