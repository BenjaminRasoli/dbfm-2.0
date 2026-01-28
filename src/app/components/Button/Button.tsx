import { ButtonProps } from "@/app/Types/ButtonProps";
import Link from "next/link";

const Button = ({ text, linkHref, icon, className }: ButtonProps) => {
  return (
    <Link
      href={linkHref}
      className={`text-white bg-blue hover:bg-blue-hover p-4 rounded-lg font-medium mb-4 transition ease-in-out ${className}`}
    >
      <span className="flex items-center gap-2 justify-center">
        {icon && <span>{icon}</span>}
        {text && <span>{text}</span>}
      </span>
    </Link>
  );
};

export default Button;
