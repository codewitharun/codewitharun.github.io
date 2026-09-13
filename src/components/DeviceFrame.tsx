// A laptop + phone mockup built entirely from CSS shapes, not a
// pre-composited raster image. Any screenshot — a live capture of the
// project's own site or a hand-picked fallback — drops into both frames
// at render time, so adding a project never means commissioning a new
// mockup graphic.
type DeviceFrameProps = {
  src: string;
  alt: string;
};

export default function DeviceFrame({ src, alt }: DeviceFrameProps) {
  return (
    <div className="device-frame">
      <div className="device-frame__laptop">
        <div className="device-frame__laptop-screen">
          <div className="device-frame__laptop-bezel">
            {/* eslint-disable-next-line @next/next/no-img-element -- external/dynamic screenshot URLs, not a build-time-known asset */}
            <img src={src} alt={alt} loading="lazy" />
          </div>
        </div>
        <div className="device-frame__laptop-base" />
      </div>
      <div className="device-frame__phone">
        <div className="device-frame__phone-notch" />
        <div className="device-frame__phone-bezel">
          {/* eslint-disable-next-line @next/next/no-img-element -- same screenshot, cropped narrower for the phone frame */}
          <img src={src} alt="" aria-hidden loading="lazy" />
        </div>
      </div>
    </div>
  );
}
