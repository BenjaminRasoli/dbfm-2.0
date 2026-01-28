import { ReactNode } from "react";

export interface ButtonProps {
  text?: string;
  linkHref: string;
  icon?: ReactNode;
  className?: string;
}
