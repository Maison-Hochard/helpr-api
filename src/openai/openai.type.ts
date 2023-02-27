export type createCompletionInput = {
  openai_model: number;
  openai_prompt: string;
  openai_max_tokens: number;
};

export enum Model {
  Davinci = 1,
  Curie = 2,
}
