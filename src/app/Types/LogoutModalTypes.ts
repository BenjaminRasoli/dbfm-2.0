export interface LogoutModalProps {
  isOpen: boolean;
  text?: string;
  onCancel: () => void;
  onConfirm: () => void;
}
