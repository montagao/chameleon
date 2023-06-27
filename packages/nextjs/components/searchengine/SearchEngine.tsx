import React, { FC, useState } from "react";

interface SearchInputProps {
  handleSearch: (inputValue: string) => void;
}

const SearchInput: FC<SearchInputProps> = ({ handleSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch(inputValue);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img src="/assets/searchbot.svg" alt="Search Engine Icon" />
      <input
        className="min-w-[500px] outline-black outline-1 placeholder-gray-500 resize-none"
        type="text"
        style={{
          flexGrow: 1,
          color: "black",
          verticalAlign: "middle",
          height: "57px",
          lineHeight: "57px",
          paddingInlineStart: "0.5rem",
        }}
        placeholder="artistic rainbow yarn"
        onKeyDown={handleKeyDown}
        onChange={event => setInputValue(event.target.value)}
        value={inputValue}
      />
      <button
        style={{ backgroundImage: "linear-gradient(90deg, #FFE9D0 0%, #FFCAEA 100%)", height: "57px" }}
        className="outline-black outline-1 text-black px-4 py-2 flex items-center"
        onClick={() => handleSearch(inputValue)}
      >
        <img style={{ marginRight: "8px" }} src="/assets/nounsify.svg" />
        <span>Nounsify!</span>
      </button>
    </div>
  );
};

export default SearchInput;
