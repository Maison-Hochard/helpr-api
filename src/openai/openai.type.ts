export type createCompletionInput = {
  model: number;
  prompt: string;
  size: number;
};

export enum Model {
  Davinci = 1,
  Curie = 2,
}
