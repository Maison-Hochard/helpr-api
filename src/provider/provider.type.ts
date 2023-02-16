export type createProviderInput = {
  name: string;
  description: string;
  logo: string;
};

export type createActionInput = {
  title: string;

  description: string;
  endpoint: string;
  name: string;
  providerId: number;
};

export type createTriggerInput = {
  name: string;
  description: string;
  value: string;
  providerId: number;
  provider: string;
};
