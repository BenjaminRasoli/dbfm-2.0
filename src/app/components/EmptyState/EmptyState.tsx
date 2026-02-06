import { EmptyStateProps } from "@/app/Types/EmptyStateProps";
import Button from "../Button/Button";

export default function EmptyState({
  title,
  description,
  linkHref,
  linkText,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center min-h-[80dvh] justify-center text-center py-20 px-6 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
        {title}
      </h1>

      {description && (
        <p className="text-gray-800 dark:text-gray-300 max-w-lg mx-auto mb-6 text-lg">
          {description}
        </p>
      )}

      {linkHref && <Button text={linkText} linkHref={linkHref} icon={icon} />}
    </div>
  );
}
