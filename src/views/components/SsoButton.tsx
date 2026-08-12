import type { AuthProvider } from "../../types/auth";
import ProviderIcon from "./ProviderIcon";
import { useGsapHover } from "../../hooks/useGsapHover";

interface SsoButtonProps {
  provider: AuthProvider;
  disabled?: boolean;
  onClick: (id: string) => void;
}

function SsoButton({ provider, disabled = false, onClick }: SsoButtonProps) {
  const buttonRef = useGsapHover<HTMLButtonElement>({ scale: 1.02, y: 0 });

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      onClick={() => onClick(provider.id)}
      className="flex w-full items-center justify-center gap-3 rounded-full  px-5 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:border-primary/60 hover:bg-elevate focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ProviderIcon icon={provider.icon} />
      {provider.label}
    </button>
  );
}

export default SsoButton;
