export interface PageSelectorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface RenderButtons {
  label: string;
  page: number;
  isDisabled: boolean;
}
