// A modern iPhone drawn in CSS (titanium frame, Dynamic Island, side
// buttons, screen glare) around any portrait screenshot. Sizes itself from
// its own width (container units), so the same component works as a tiny
// accent next to a laptop and as a big hero phone. Styles: .iphone in
// globals.css.
type IPhoneFrameProps = {
  src: string;
  alt: string;
  className?: string;
  /** above-the-fold hero images load eagerly */
  eager?: boolean;
};

export default function IPhoneFrame({ src, alt, className, eager }: IPhoneFrameProps) {
  return (
    <div className={`iphone ${className ?? ""}`}>
      <div className="iphone__body">
        <span className="iphone__btn iphone__btn--action" aria-hidden />
        <span className="iphone__btn iphone__btn--vol-up" aria-hidden />
        <span className="iphone__btn iphone__btn--vol-down" aria-hidden />
        <span className="iphone__btn iphone__btn--power" aria-hidden />
        <div className="iphone__screen">
          {/* eslint-disable-next-line @next/next/no-img-element -- uploaded/live screenshot URLs, not build-time assets */}
          <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} />
          <span className="iphone__island" aria-hidden />
          <span className="iphone__glare" aria-hidden />
        </div>
      </div>
    </div>
  );
}
