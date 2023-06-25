import React, { FC } from "react";

interface SearchInputProps {
  onTextChanged: (text: string) => void;
}

const SearchInput: FC<SearchInputProps> = ({ onTextChanged }) => {
  return (
    <div className="px-4 py-2 bg-gray-200 rounded-lg w-full">
      <textarea
        className="min-w-[400px] bg-transparent outline-none placeholder-gray-500 resize-none"
        rows={2}
        placeholder="Halloween"
        onChange={event => onTextChanged(event.target.value)}
      />
    </div>
  );
};

export default SearchInput;
