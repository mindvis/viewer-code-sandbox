// ==============================|| TYPES - ThreeDModels  ||============================== //

export type ThreeDModels = {
  _id?: string;
  name?: string;
  description?: string;
  thumbnail?: string;
  tags:string[];
};

export type ThreeDModelsProps = {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  tags:string[];
};
