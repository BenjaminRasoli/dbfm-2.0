export interface PageSelectorTypes {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface RenderButtonsTypes {
  label: string;
  page: number;
  isDisabled: boolean;
}
