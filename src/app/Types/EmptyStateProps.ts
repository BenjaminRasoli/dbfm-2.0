import { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description: string;
  linkHref: string;
  linkText: string;
  icon?: ReactNode;
}
