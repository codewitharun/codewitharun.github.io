import Link from "next/link";
import { FaApple, FaGooglePlay, FaGithub, FaGlobe } from "react-icons/fa";
import type { IconType } from "react-icons";
import type { ProjectLinks } from "@/data/site";

// One entry per possible link on a project, each with its own icon and
// label so a visitor always knows what a click will open before they
// click it — App Store and Play Store are never interchangeable, and a
// marketing site isn't source code.
const LINK_META: Record<keyof ProjectLinks, { label: string; Icon: IconType }> = {
  appStore: { label: "App Store", Icon: FaApple },
  playStore: { label: "Play Store", Icon: FaGooglePlay },
  website: { label: "Website", Icon: FaGlobe },
  github: { label: "Source", Icon: FaGithub },
};

const ORDER: (keyof ProjectLinks)[] = ["appStore", "playStore", "website", "github"];

type ProjectLinkButtonsProps = {
  links: ProjectLinks;
  className?: string;
};

export default function ProjectLinkButtons({ links, className }: ProjectLinkButtonsProps) {
  const keys = ORDER.filter((key) => links[key]);
  if (keys.length === 0) return null;

  return (
    <div className={className ?? "flex flex-wrap gap-4"}>
      {keys.map((key) => {
        const { label, Icon } = LINK_META[key];
        return (
          <Link
            key={key}
            href={links[key]!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-mint"
          >
            <Icon size={14} /> {label}
          </Link>
        );
      })}
    </div>
  );
}
