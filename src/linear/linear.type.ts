export type Team = {
  id: string;
  name: string;
  projects: Project[];
};

export type Project = {
  id: string;
  name: string;
};

export type Issue = {
  id: string;
  title: string;
  number: number;
  labels: Label[];
  team: Team;
};

export type Label = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  teams: {
    nodes: Team[];
  };
};

export type TeamResponse = {
  teams: {
    nodes: Team[];
  };
};
