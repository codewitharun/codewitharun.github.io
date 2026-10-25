import Link from "next/link";
import { FaApple, FaGooglePlay, FaGithub, FaGlobe, FaLifeRing, FaShieldAlt } from "react-icons/fa";
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
  support: { label: "Help & support", Icon: FaLifeRing },
  privacy: { label: "Privacy", Icon: FaShieldAlt },
};

const ORDER: (keyof ProjectLinks)[] = ["appStore", "playStore", "website", "github"];
// For people who already use the app: only on its own case-study page.
const HELP: (keyof ProjectLinks)[] = ["support", "privacy"];

type ProjectLinkButtonsProps = {
  links: ProjectLinks;
  className?: string;
  /** Also show Help & support and Privacy (case-study page). */
  withHelp?: boolean;
};

export default function ProjectLinkButtons({ links, className, withHelp = false }: ProjectLinkButtonsProps) {
  const keys = (withHelp ? [...ORDER, ...HELP] : ORDER).filter((key) => links[key]);
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
