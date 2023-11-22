import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Button, Flex, Text } from "@radix-ui/themes";
import React, { useState } from "react";

interface Pagination {
  pageNumber: number;
  numberOfItems: number;
  count: number;
}

interface Props {
  pagination: Pagination;
  setPagination: (pagination: Pagination) => void;
}

const Pagination = ({ pagination, setPagination }: Props) => {
  let maxPageNumber = Math.ceil(pagination.count / pagination.numberOfItems);

  const nextExists = () => {
    if (maxPageNumber == pagination.pageNumber + 1) return false;
    return true;
  };

  const prevExists = () => {
    if (pagination.pageNumber - 1 == -1) return false;
    return true;
  };

  const handlePreviousPage = () => {
    setPagination({
      ...pagination,
      pageNumber: pagination.pageNumber - 1,
    });
  };

  const handleNextPage = () => {
    setPagination({
      ...pagination,
      pageNumber: pagination.pageNumber + 1,
    });
  };

  if (maxPageNumber <= 1) return null;

  return (
    <Flex className="w-full p-2" justify={"center"}>
      <Flex
        justify={"between"}
        align={"center"}
        gap={"3"}
        className="border shadow-sm bg-white p-2 rounded-full w-96"
      >
        <Flex className="w-1/4">
          {prevExists() && (
            <Button variant="soft" radius="full" onClick={handlePreviousPage}>
              <ArrowLeftIcon />
            </Button>
          )}
        </Flex>
        <Text className="text-xs text-slate-500 w-1/2 text-center">
          Showing {pagination.pageNumber + 1} of {maxPageNumber} Pages
        </Text>
        <Flex className="w-1/4" justify={"end"}>
          {nextExists() && (
            <Button variant="soft" radius="full" onClick={handleNextPage}>
              <ArrowRightIcon />
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Pagination;
