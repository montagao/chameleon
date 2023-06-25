import React from "react";

interface ImageButtonProps {
  text: string;
  imageUrl: string;
  onClick: () => void;
}

export const ImageButton: React.FC<ImageButtonProps> = ({ text, imageUrl, onClick }) => {
  return (
    <button
      style={{ backgroundImage: "linear-gradient(270deg, #D9FFD3 0%, #D5D7E1 100%)" }}
      className="text-black px-4 py-2 flex items-center"
      onClick={onClick}
    >
      <img className="h-6 mr-3" src={imageUrl} alt="" />
      <span>{text}</span>
    </button>
  );
};
