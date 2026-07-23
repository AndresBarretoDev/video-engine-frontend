import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface EyePasswordProps {
  onToggle: () => void;
  isVisible: boolean;
}

const EYE_PASSWORD_LABEL = {
  show: 'Show password',
  hide: 'Hide password'
} as const;

/** Icon-only toggle — needs an explicit name/state (WCAG 4.1.2), never relies on the icon alone. */
export const EyePassword = ({ onToggle, isVisible }: EyePasswordProps) => {
  const label = isVisible ? EYE_PASSWORD_LABEL.hide : EYE_PASSWORD_LABEL.show;

  return (
    <button
      type="button"
      className="input-text__show-password"
      onClick={onToggle}
      aria-label={label}
      aria-pressed={isVisible}
    >
      {isVisible ? <EyeOffIcon aria-hidden /> : <EyeIcon aria-hidden />}
    </button>
  );
};
