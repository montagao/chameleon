import React, { useRef } from "react";

interface ImageButtonProps {
  text: string;
  imageUrl: string;
  onClick: () => void;
  tooltipText?: string;
}

export const ImageButton: React.FC<ImageButtonProps> = ({ text, imageUrl, onClick, tooltipText }) => {
  const [tooltipVisible, setTooltipVisible] = React.useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (tooltipText) {
      timeoutId.current = setTimeout(() => {
        setTooltipVisible(true);
      }, 400);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
    setTooltipVisible(false);
  };

  return (
    <div className="relative">
      {tooltipText && (
        <div
          className={`absolute text-xs bg-black text-white p-2 rounded-md -top-12 -left-60 origin-bottom-right transform transition-all duration-555 ease-in-out w-[230px] ${
            tooltipVisible ? "opacity-75 scale-100" : "opacity-0 scale-50"
          }`}
        >
          {tooltipText}
        </div>
      )}
      <button
        style={{ backgroundImage: "linear-gradient(270deg, #D9FFD3 0%, #D5D7E1 100%)" }}
        className="text-black px-4 py-2 flex items-center"
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img className="h-6 mr-3" src={imageUrl} alt="" />
        <span>{text}</span>
      </button>
    </div>
  );
};
