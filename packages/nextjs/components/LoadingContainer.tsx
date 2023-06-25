import React from "react";

interface LoadingContainerProps {
  isLoading: boolean;
}

export const LoadingContainer: React.FC<LoadingContainerProps> = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="relative flex items-center mx-auto rounded h-[300px]">
      <img className="max-h-[260px] object-contain" src="/assets/zawarudo.gif" alt="Loading..." />
    </div>
  );
};
