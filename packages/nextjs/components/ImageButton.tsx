import React from "react";

interface ImageButtonProps {
  text: string;
  imageUrl: string;
  onClick: () => void;
}

export const ImageButton: React.FC<ImageButtonProps> = ({ text, imageUrl }) => {
  return (
    <button
      style={{ backgroundImage: "linear-gradient(270deg, #D9FFD3 0%, #D5D7E1 100%)", marginRight: "2rem" }}
      className="text-black px-4 py-2 flex items-center"
    >
      <img className="h-6 mr-3" src={imageUrl} alt="" />
      <span>{text}</span>
    </button>
  );
};
