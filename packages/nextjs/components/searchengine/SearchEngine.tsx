import React, { FC } from "react";

interface SearchInputProps {
  onTextChanged: (text: string) => void;
}

const SearchInput: FC<SearchInputProps> = ({ onTextChanged }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img src="/assets/searchbot.svg" />

      <textarea
        className="min-w-[500px] outline-black outline-1 placeholder-gray-500 resize-none"
        rows={2}
        style={{
          flexGrow: 1,
          color: "black",
          verticalAlign: "middle",
          height: "57px",
          lineHeight: "57px",
          paddingInlineStart: "0.5rem",
        }}
        placeholder="artistic rainbow yarn"
        onChange={event => onTextChanged(event.target.value)}
      />
    </div>
  );
};

export default SearchInput;
