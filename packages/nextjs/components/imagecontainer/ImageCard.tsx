import React from "react";

interface ImageCardProps {
  imgLink: string;
  altText: string;
  onImgChosen: (imgLink: string) => void;
  isActive: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({ imgLink, altText, onImgChosen, isActive }) => {
  return (
    <div
      onClick={() => onImgChosen(imgLink)}
      className={`max-w-sm rounded overflow-hidden shadow-lg m-2 ${
        isActive ? "border-4 border-blue-500 shadow-lg" : ""
      }`}
    >
      <div className="aspect-w-1 aspect-h-1">
        <img className="w-full object-cover" src={imgLink} alt={altText} />
      </div>
    </div>
  );
};
