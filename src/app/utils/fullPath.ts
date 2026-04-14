import { usePathname, useSearchParams } from "next/navigation";

export function useFullPath() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullPath =
    searchParams.toString().length > 0
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

  return fullPath;
}
