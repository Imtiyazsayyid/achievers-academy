import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";
import React from "react";
import Pagination from "./Pagination";

interface Props {
  placeholder: string;
  searchText: string;
  setSearchText: (text: string) => void;
  setPagination?: (pagination: Pagination) => void;
  pagination?: Pagination;
}

const SearchBar = ({
  placeholder,
  setSearchText,
  searchText,
  pagination,
  setPagination,
}: Props) => {
  return (
    <TextField.Root className="w-80">
      <TextField.Slot>
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
      <TextField.Input
        placeholder={placeholder}
        onChange={(e) => {
          setSearchText(e.target.value);
          if (pagination && setPagination) {
            setPagination({ ...pagination, pageNumber: 0 });
          }
        }}
        value={searchText}
      />
    </TextField.Root>
  );
};

export default SearchBar;
