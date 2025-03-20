import { Dispatch, SetStateAction } from "react";

export const handleStateChange =
  <T>(setter: Dispatch<SetStateAction<T>>, resetPage: boolean = false) =>
  (value: T, setPage?: Dispatch<SetStateAction<number>>) => {
    setter(value);
    if (resetPage && setPage) setPage(1);
  };
