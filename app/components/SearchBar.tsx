import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";
import React from "react";

interface Props {
  placeholder: string;
  searchText: string;
  setSearchText: (text: string) => void;
}

const SearchBar = ({ placeholder, setSearchText, searchText }: Props) => {
  return (
    <TextField.Root className="w-80">
      <TextField.Slot>
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
      <TextField.Input
        placeholder={placeholder}
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
      />
    </TextField.Root>
  );
};

export default SearchBar;
