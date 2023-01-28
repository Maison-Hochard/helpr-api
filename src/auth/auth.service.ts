import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
/*import { OAuth2Client } from "google-auth-library";*/
import { User } from "@prisma/client";
import { decrypt } from "../utils";

export interface JwtPayload {
  id: string;
  role: number;
  email: string;
  username: string;
}

/*interface GooglePayload {
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
}*/

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private createJwtPayload(user): JwtPayload {
    return {
      id: user.id,
      role: user.role,
      email: user.email,
      username: user.username,
    };
  }

  async validateUser(login: string, password: string): Promise<User> {
    const user = await this.userService.getUserByLogin(login);
    if (!user || !(await decrypt(password, user.password))) {
      throw new BadRequestException("invalid_credentials");
    }
    return user;
  }

  async createAccessToken(user): Promise<string> {
    const payload = this.createJwtPayload(user);
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get("jwt.access_token_secret"),
      expiresIn: this.configService.get("jwt.access_token_expiration"),
    });
  }

  async createRefreshToken(user): Promise<string> {
    const payload = this.createJwtPayload(user);
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get("jwt.refresh_token_secret"),
      expiresIn: this.configService.get("jwt.refresh_token_expiration"),
    });
  }

  async refreshToken(request): Promise<{ authToken: string }> {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException("refresh_token_not_provided");
    }
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get("jwt.refresh_token_secret"),
    });
    const user = await this.userService.getUserById(payload.id);
    const decryptedRefreshToken = await decrypt(
      refreshToken,
      user.refreshToken,
    );
    if (decryptedRefreshToken) {
      return {
        authToken: await this.createAccessToken(user),
      };
    } else {
      throw new UnauthorizedException("invalid_refresh_token");
    }
  }

  /*async googleAuth(token, response) {
    const client = new OAuth2Client(this.configService.get("google.client_id"));
    client.setCredentials({ access_token: token });
    const googleUser = await client.request({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });
    const userInfo = googleUser.data as GooglePayload;
    const user = await this.userService.getUserByLogin(userInfo.email);
    if (user) {
      return this.getTokens(user, response);
    } else {
      const newUser = new User();
      newUser.username =
        userInfo.given_name +
        userInfo.family_name +
        Math.floor(Math.random() * 1000);
      newUser.email = userInfo.email;
      newUser.firstname = userInfo.given_name;
      newUser.lastname = userInfo.family_name;
      newUser.password = await utils.encrypt(token);
      newUser.avatar = userInfo.picture;
      const createdUser = await this.userService.create(newUser);
      return this.getTokens(createdUser, response);
    }
  }*/
}
