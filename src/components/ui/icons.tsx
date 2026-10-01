import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 18, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) { return <Icon {...props}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></Icon>; }
export function ArrowLeftIcon(props: IconProps) { return <Icon {...props}><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></Icon>; }
export function CheckIcon(props: IconProps) { return <Icon {...props}><path d="m5 12 4 4L19 6"/></Icon>; }
export function ChevronDownIcon(props: IconProps) { return <Icon {...props}><path d="m6 9 6 6 6-6"/></Icon>; }
export function CalculatorIcon(props: IconProps) { return <Icon {...props}><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8"/><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01M16 18h.01"/></Icon>; }
export function FolderIcon(props: IconProps) { return <Icon {...props}><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></Icon>; }
export function BookIcon(props: IconProps) { return <Icon {...props}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5Z"/><path d="M4 5.5v12A2.5 2.5 0 0 0 6.5 20"/><path d="M8 7h8M8 11h8"/></Icon>; }
export function InfoIcon(props: IconProps) { return <Icon {...props}><circle cx="12" cy="12" r="9"/><path d="M12 10v6"/><path d="M12 7h.01"/></Icon>; }
export function AlertIcon(props: IconProps) { return <Icon {...props}><path d="M10.3 4.4 2.8 17.3A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.7L13.7 4.4a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 16h.01"/></Icon>; }
export function PlusIcon(props: IconProps) { return <Icon {...props}><path d="M12 5v14M5 12h14"/></Icon>; }
export function TrashIcon(props: IconProps) { return <Icon {...props}><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="m6 7 1 13h10l1-13"/><path d="M9 7V4h6v3"/></Icon>; }
export function RotateIcon(props: IconProps) { return <Icon {...props}><path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 5v5h5"/></Icon>; }
export function PrinterIcon(props: IconProps) { return <Icon {...props}><path d="M6 9V4h12v5"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/><path d="M18 12h.01"/></Icon>; }
export function DownloadIcon(props: IconProps) { return <Icon {...props}><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></Icon>; }
export function SaveIcon(props: IconProps) { return <Icon {...props}><path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h8V3"/><path d="M8 15h8v6H8z"/></Icon>; }
export function RulerIcon(props: IconProps) { return <Icon {...props}><path d="m4 15 11-11 5 5L9 20H4z"/><path d="m12 7 5 5M9 10l2 2M7 12l2 2"/></Icon>; }
export function ShieldIcon(props: IconProps) { return <Icon {...props}><path d="M12 3 20 6v6c0 4.5-3.2 7.7-8 9-4.8-1.3-8-4.5-8-9V6z"/><path d="m9 12 2 2 4-4"/></Icon>; }

/**
 * MeasureToBuild brand mark: an abstract geometric "M" above a ruler baseline with
 * graduation ticks. Fill-based (not stroke-based) so it stays crisp from 16px to 32px.
 * The full tile version of the same mark lives in public/brand/logo-mark.svg.
 */
export function BrandMarkIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6.5 22.5 L6.5 6 L10.5 6 L16 13.2 L21.5 6 L25.5 6 L25.5 22.5 L21.5 22.5 L21.5 13.4 L16 20.6 L10.5 13.4 L10.5 22.5 Z"
        fill="currentColor"
      />
      <g fill="currentColor">
        <rect x="7.3" y="23.2" width="1.4" height="1.4" rx="0.5" />
        <rect x="15.3" y="23.2" width="1.4" height="1.4" rx="0.5" />
        <rect x="23.3" y="23.2" width="1.4" height="1.4" rx="0.5" />
        <rect x="6.5" y="25.2" width="19" height="1.8" rx="0.9" />
      </g>
    </svg>
  );
}
