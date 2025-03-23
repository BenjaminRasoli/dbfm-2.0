export interface RemoveModalProps {
  isConfirmModalOpen: boolean;
  setIsConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  itemToRemove: any;
  handleRemoveFavorite: () => void;
}
