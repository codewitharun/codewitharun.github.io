// A laptop + iPhone mockup built entirely from CSS shapes, not a
// pre-composited raster image. The laptop gets the desktop screenshot and
// the iPhone gets a real phone-sized one (a mobile render of the site, or
// the project's first app screenshot), so neither is a squeezed crop.
import IPhoneFrame from "@/components/IPhoneFrame";

type DeviceFrameProps = {
  src: string;
  /** portrait screenshot for the phone; falls back to `src` */
  phoneSrc?: string;
  alt: string;
  eager?: boolean;
};

export default function DeviceFrame({ src, phoneSrc, alt, eager }: DeviceFrameProps) {
  return (
    <div className="device-frame">
      <div className="device-frame__laptop">
        <div className="device-frame__laptop-screen">
          <div className="device-frame__laptop-bezel">
            {/* eslint-disable-next-line @next/next/no-img-element -- external/dynamic screenshot URLs, not a build-time-known asset */}
            <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} />
          </div>
        </div>
        <div className="device-frame__laptop-base" />
      </div>
      <IPhoneFrame src={phoneSrc ?? src} alt="" className="device-frame__iphone" eager={eager} />
    </div>
  );
}
