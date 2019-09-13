export interface ConvertOptions {
  apiKey: string;
  fileId: string;
  workspaceName: string;
  templatesFile: string;
}

export interface FigmaNode {
  id: number;
  name: string;
  type: string;
  children: FigmaNode[];
}

export interface FigmaObjectTree {
  document: FigmaNode;
}
