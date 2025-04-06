import { MediaTypes } from "./MediaTypes";

export interface RemoveModalProps {
  isConfirmModalOpen: boolean;
  setIsConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  itemToRemove: MediaTypes;
  handleRemoveFavorite: () => void;
}
