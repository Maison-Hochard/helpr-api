export type createCompletionInput = {
  openai_completion_model: number;
  openai_completion_prompt: string;
  openai_completion_size: number;
};

export enum Model {
  Davinci = 1,
  Curie = 2,
}
