// export const handleStateChange =
//   (setter: Function, resetPage: boolean = false) =>
//   (value: string | number, setPage: Function) => {
//     setter(value);
//     if (resetPage) setPage(1);
//   };

import { Dispatch, SetStateAction } from "react";

export const handleStateChange =
  <T>(setter: Dispatch<SetStateAction<T>>, resetPage: boolean = false) =>
  (value: T, setPage: Dispatch<SetStateAction<number>>) => {
    setter(value);
    if (resetPage) setPage(1);
  };
