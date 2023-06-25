export interface ImageCardDTO {
  imgLink: string;
  altText: string;
  isActive: boolean;
  id: string;
}

export interface ImageCardProps extends ImageCardDTO {
  onImgChosen: (imgLink: string) => void;
}
