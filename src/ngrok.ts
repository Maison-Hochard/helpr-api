import { Injectable } from "@nestjs/common";
import * as ngrok from "ngrok";

@Injectable()
export class NgrokService {
  async connect(): Promise<string> {
    const url = await ngrok.connect({
      addr: process.env.PORT || 3000,
    });
    console.log(`Tunnel créé à l'adresse: ${url}`);
    return url;
  }

  async disconnect(): Promise<void> {
    await ngrok.disconnect();
    console.log("Tunnel fermé");
  }
}
