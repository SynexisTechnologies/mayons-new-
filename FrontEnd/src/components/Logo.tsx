import logo from "../assets/mayons logo.png";

type Props = {
  /** rendered height of the framed logo, in px */
  height?: number;
  /** width of the visible frame, in px */
  width?: number;
  /** zoom factor used to crop out the logo's transparent padding */
  zoom?: number;
  className?: string;
};

/**
 * The brand asset (`mayons logo.png`) is a yellow cart + white "MAYONS"
 * wordmark centred inside a large transparent square. We zoom-crop into the
 * artwork so it frames nicely on the (purple) bars it sits on.
 */
export default function Logo({ height = 56, width, zoom = 2.7, className = "" }: Props) {
  return (
    <div
      style={{ height, width: width ?? height * 1.5 }}
      className={`relative overflow-hidden flex items-center justify-center shrink-0 ${className}`}
    >
      <img
        src={logo}
        alt="Mayons"
        style={{ height: height * zoom }}
        className="w-auto max-w-none object-contain pointer-events-none select-none"
      />
    </div>
  );
}
