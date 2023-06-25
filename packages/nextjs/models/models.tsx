export interface ImageCardDTO {
  image: string;
  altText: string;
  isActive: boolean;
  id: string;
  URI?: string;
}

export interface ImageCardProps extends ImageCardDTO {
  onImgChosen: (imgLink: string) => void;
}

export interface StableDiffusionPayload {
  head: Array<string>;
  glasses: Array<string>;
  body: Array<string>;
  accessories: Array<string>;
}

interface Attribute {
  trait_type: string;
  value: string;
}
export interface NFTMetaData {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes: Array<Attribute>;
  URI: string;
}
