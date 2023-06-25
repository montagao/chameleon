import React from "react";

interface ImageCardProps {
  imgLink: string;
  altText: string;
  onImgChosen: (imgLink: string) => void;
  isActive: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({ imgLink, altText, onImgChosen, isActive }) => {
  return (
    <div onClick={() => onImgChosen(imgLink)} className={`relative max-w-sm rounded`}>
      <div
        className={`relative aspect-w-1 aspect-h-1 overflow-hidden shadow-lg m-2 border-4 transition-all duration-500 ease-in-out transform hover:scale-125 hover:z-10 ${
          isActive ? "border-blue-500" : "border-transparent"
        }`}
      >
        <img className="w-full object-cover" src={imgLink} alt={altText} />
      </div>
    </div>
  );
};
