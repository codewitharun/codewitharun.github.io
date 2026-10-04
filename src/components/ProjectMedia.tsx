import DeviceFrame from "@/components/DeviceFrame";
import IPhoneFrame from "@/components/IPhoneFrame";
import { getShowcase } from "@/lib/projectImage";
import type { Project } from "@/data/site";

type ProjectMediaProps = {
  project: Project;
  /** Outer wrapper classes — background, border, rounding for the card. */
  className?: string;
  showStatusBadge?: boolean;
  /** case-study hero: bigger phones, eager images */
  hero?: boolean;
};

/**
 * Picks the right presentation per project (see getShowcase):
 *  - app with screenshots -> 1-3 iPhones, the middle one in front
 *  - website -> laptop (desktop render) + iPhone (mobile render)
 *  - otherwise -> the uploaded cover image, flat (it may already be a
 *    composed graphic, so it isn't framed a second time)
 */
export default function ProjectMedia({ project, className, showStatusBadge, hero }: ProjectMediaProps) {
  const show = getShowcase(project);
  const alt = `${project.title} preview`;

  return (
    <div className={className ?? "relative"}>
      {show.kind === "devices" && (
        <div className="px-6 pt-6 pb-10 md:px-8 md:pt-8 md:pb-12">
          <DeviceFrame src={show.desktop} phoneSrc={show.phone} alt={alt} eager={hero} />
        </div>
      )}
      {show.kind === "phones" && (
        <div className={`phone-stage ${hero ? "phone-stage--hero" : ""}`}>
          <div className={`phone-fan phone-fan--${show.shots.length}`}>
            {show.shots.map((src, i) => (
              <IPhoneFrame
                key={src + i}
                src={src}
                alt={i === 0 ? alt : ""}
                className={`phone-fan__item phone-fan__item--${i}`}
                eager={hero}
              />
            ))}
          </div>
        </div>
      )}
      {show.kind === "cover" && (
        <div className="relative aspect-video overflow-hidden rounded-[inherit]">
          {/* eslint-disable-next-line @next/next/no-img-element -- uploaded cover or static mock */}
          <img
            src={show.src}
            alt={alt}
            className="h-full w-full object-cover"
            loading={hero ? "eager" : "lazy"}
          />
        </div>
      )}
      {showStatusBadge && project.currentlyWorkingOn && (
        <span className="mono-label absolute right-4 top-4 z-10 rounded-full bg-mint px-2.5 py-1 text-[10px] text-bg">
          Currently building
        </span>
      )}
    </div>
  );
}
