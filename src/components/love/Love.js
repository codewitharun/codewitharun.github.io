import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LockIcon from "@mui/icons-material/Lock";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Style from "./Love.module.scss";
import BirthdayCake from "./BirthdayCake";
import birthdaySong from "./Raabta Agent Vinod 128 Kbps.mp3";
import birthdayMessageImage from "./photos/message/image.png";
import useSEO from "../../hooks/useSEO";

const CAKE_SCENE_DURATION_MS = 7000;

const PASSWORD = "aadu";

const pickFrom = (list, index) => list[index % list.length];

const getMediaType = (path) =>
  /\.(mp4|webm|mov)$/i.test(path) ? "video" : "image";

const importMedia = (
  context,
  group,
  { tags, flipMessages, viewerNotes, viewerOffset = 0 } = {},
) =>
  context
    .keys()
    .sort()
    .map((key, index) => ({
      id: `${group}-${index}`,
      src: context(key),
      type: getMediaType(key),
      name: key.replace("./", ""),
      tag: tags ? pickFrom(tags, index) : undefined,
      flipMessage: flipMessages ? pickFrom(flipMessages, index) : undefined,
      viewerNote: viewerNotes
        ? pickFrom(viewerNotes, index + viewerOffset)
        : undefined,
    }));

const togetherTags = [
  "our first laugh",
  "side by side",
  "my safe place",
  "just us two",
  "held hands",
  "quiet joy",
  "always us",
  "soft moments",
  "my person",
  "warm memory",
  "forever frame",
];

const cutieFlipMessages = [
  { strong: "Too cute", small: "and still my favorite" },
  { strong: "That smile", small: "melts me every time" },
  { strong: "Pure sunshine", small: "in one photo" },
  { strong: "My heart", small: "did a little flip" },
  { strong: "Adorable", small: "beyond words" },
  { strong: "So pretty", small: "it hurts a little" },
  { strong: "Cutest ever", small: "no debate needed" },
  { strong: "My favorite", small: "face in the world" },
  { strong: "Soft cheeks", small: "soft heart" },
  { strong: "Little angel", small: "energy only" },
  { strong: "Sweetness", small: "personified" },
  { strong: "Heart stealer", small: "as always" },
  { strong: "So lovable", small: "it's unfair" },
  { strong: "Baby girl", small: "energy unlocked" },
  { strong: "Pretty eyes", small: "pretty soul" },
  { strong: "My sunshine", small: "my calm" },
  { strong: "Too precious", small: "to handle" },
  { strong: "Cuteness", small: "overload warning" },
  { strong: "My joy", small: "in one frame" },
  { strong: "Soft girl", small: "strong heart" },
  { strong: "Absolutely", small: "irresistible" },
  { strong: "My favorite", small: "little smile" },
  { strong: "So warm", small: "so you" },
  { strong: "Love this", small: "so much" },
];

const memoryViewerNotes = [
  "one more reason this page is only yours",
  "this smile lives in my heart forever",
  "proof that love looks this beautiful",
  "a little frame of my favorite person",
  "saved forever, just like you in my heart",
  "this moment deserved its own corner here",
  "every pixel of this feels like home",
  "my favorite kind of memory",
  "look at you — my whole world",
  "this one always makes me smile",
  "a secret little treasure of ours",
  "you make even ordinary days glow",
  "my heart chose this one twice",
  "too special to stay in the camera roll",
  "this is what happiness looks like",
  "kept safely because you matter",
  "a quiet reminder of how lucky I am",
  "my favorite chapter, still unfolding",
  "this photo holds more love than words",
  "you, being perfectly you",
  "a soft little piece of us",
  "my eyes found their favorite view",
  "this memory feels like a warm hug",
  "proof that the best things are real",
  "you shine even when you don't try",
  "one glance, endless love",
  "this belongs in my forever folder",
  "my heart still skips here",
  "a beautiful little reason to smile",
  "you are the best part of this frame",
  "kept close, just like you",
  "this one makes me fall again",
  "my favorite evidence of us",
  "soft, sweet, and so you",
  "a memory I replay in my head",
  "look — that's my girl",
  "this smile is my safe place",
  "every detail here feels like love",
  "my little universe in one photo",
  "another reason I'm grateful for you",
  "this moment is pure magic",
  "you make my world feel lighter",
  "a frame full of warmth and you",
  "my heart wrote this caption for you",
  "still my favorite view, always",
];

const togetherPhotos = importMedia(
  require.context("./photos/together", false, /\.(png|jpe?g|webp|gif)$/i),
  "together",
  { tags: togetherTags, viewerNotes: memoryViewerNotes, viewerOffset: 0 },
);
const cutiePhotos = importMedia(
  require.context(
    "./photos/cutie",
    false,
    /(\.(png|jpe?g|webp|gif)$|-web\.mp4$)/i,
  ),
  "cutie",
  {
    flipMessages: cutieFlipMessages,
    viewerNotes: memoryViewerNotes,
    viewerOffset: togetherPhotos.length,
  },
);
const weirdPhotos = importMedia(
  require.context("./photos/weired", false, /\.(png|jpe?g|webp|gif)$/i),
  "weird",
  {
    viewerNotes: memoryViewerNotes,
    viewerOffset: togetherPhotos.length + cutiePhotos.length,
  },
);
const allMemories = [...togetherPhotos, ...cutiePhotos, ...weirdPhotos];

const wishCards = [
  {
    title: "For your beautiful heart",
    body: "May this year protect your peace, keep your smile easy, and remind you every day how deeply you are loved.",
  },
  {
    title: "For your civil services dream",
    body: "May your focus stay strong, your confidence stay louder than doubt, and every small effort bring you closer to the life you are building.",
  },
  {
    title: "For the girl I adore",
    body: "You make ordinary days feel warm. Your kindness, patience, and strength are my favorite things about you.",
  },
  {
    title: "For every tomorrow",
    body: "I hope your future gives you reasons to feel proud, moments that feel magical, and people who love you gently.",
  },
];

const petalNotes = [
  "You are my calm.",
  "You are my favorite smile.",
  "You make life softer.",
  "You deserve everything beautiful.",
  "I am proud of you.",
  "Happy Birthday, my love.",
];

export default function Love() {
  const [started, setStarted] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [activePetal, setActivePetal] = useState(null);
  const [runawayCount, setRunawayCount] = useState(0);
  const [showGift, setShowGift] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showFolderLetter, setShowFolderLetter] = useState(false);
  const [showCakeScene, setShowCakeScene] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [journeyReady, setJourneyReady] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicMessage, setMusicMessage] = useState("");
  const audioRef = useRef(null);
  const userPausedRef = useRef(false);

  const surpriseStarted = showCakeScene || showMessageModal || journeyReady;

  const fallingPetals = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        id: index,
        left: `${(index * 19) % 100}%`,
        delay: `${(index % 14) * 0.22}s`,
        duration: `${6 + (index % 7) * 0.45}s`,
      })),
    [],
  );

  useSEO({
    title: "Love | Birthday Surprise",
    description: "A private birthday surprise made with love.",
    keywords: "Birthday Surprise, Love Page, Arun Kumar",
    url: "https://www.arun.codes/love",
    image: "https://www.arun.codes/favicon_io/android-chrome-512x512.png",
  });

  const playMusic = useCallback(async () => {
    if (!audioRef.current) return false;

    try {
      audioRef.current.volume = 0.85;
      audioRef.current.muted = false;
      await audioRef.current.play();
      setMusicPlaying(true);
      setMusicMessage("Song of the day is playing for you");
      return true;
    } catch (error) {
      setMusicPlaying(false);
      setMusicMessage("tap play if your browser blocked the music");
      return false;
    }
  }, []);

  useEffect(() => {
    const tryAutoPlay = () => {
      if (userPausedRef.current || !audioRef.current?.paused) return;
      playMusic();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      tryAutoPlay();
    };

    if (document.hasFocus()) {
      tryAutoPlay();
    }

    window.addEventListener("focus", tryAutoPlay);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", tryAutoPlay);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [playMusic]);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (musicPlaying) {
      audioRef.current.pause();
      userPausedRef.current = true;
      setMusicPlaying(false);
      setMusicMessage("music paused");
      return;
    }

    userPausedRef.current = false;
    await playMusic();
  };

  const unlockSurprise = async (event) => {
    event.preventDefault();

    if (password.trim().toLowerCase() !== PASSWORD) {
      setPasswordError(
        "Not this one. Hint: the daughter name I once told you.",
      );
      return;
    }

    setPasswordError("");
    setShowCakeScene(true);
    setShowMessageModal(false);
    setJourneyReady(false);
    userPausedRef.current = false;
    await playMusic();
  };

  useEffect(() => {
    if (!showCakeScene || showMessageModal) return undefined;

    const timer = window.setTimeout(() => {
      setShowMessageModal(true);
    }, CAKE_SCENE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [showCakeScene, showMessageModal]);

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setShowCakeScene(false);
    setJourneyReady(true);
    setTimeout(() => {
      document
        .getElementById("wish-garden")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
  };

  const handleRunaway = () => {
    if (runawayCount < 4) {
      setRunawayCount((count) => count + 1);
      return;
    }

    setShowGift(true);
  };

  return (
    <Box className={Style.lovePage} id={"love"}>
      <audio
        ref={audioRef}
        src={birthdaySong}
        loop
        preload="auto"
        onPause={() => setMusicPlaying(false)}
        onPlay={() => setMusicPlaying(true)}
      />

      <div className={Style.petalLayer}>
        {fallingPetals.map((petal) => (
          <span
            key={petal.id}
            style={{
              left: petal.left,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
            }}
          />
        ))}
      </div>

      <section className={Style.hero}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
          className={Style.roseStage}
          aria-label="Animated rose blooming"
        >
          <div className={Style.glow} />
          <svg
            className={Style.roseSvg}
            viewBox="0 0 260 360"
            role="img"
            aria-label="A rose growing and blooming"
          >
            <defs>
              <linearGradient id="roseStem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#82ec98" />
                <stop offset="100%" stopColor="#197845" />
              </linearGradient>
              <linearGradient id="rosePetal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffc0d8" />
                <stop offset="42%" stopColor="#f64b91" />
                <stop offset="100%" stopColor="#a70f4f" />
              </linearGradient>
              <linearGradient id="roseDarkPetal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff8fbd" />
                <stop offset="100%" stopColor="#7d0d42" />
              </linearGradient>
              <radialGradient id="roseCenter" cx="45%" cy="35%" r="70%">
                <stop offset="0%" stopColor="#ffe0ec" />
                <stop offset="45%" stopColor="#e91f73" />
                <stop offset="100%" stopColor="#8b0d42" />
              </radialGradient>
              <filter
                id="softRoseShadow"
                x="-35%"
                y="-35%"
                width="170%"
                height="170%"
              >
                <feDropShadow
                  dx="0"
                  dy="16"
                  stdDeviation="12"
                  floodColor="#8b0d42"
                  floodOpacity="0.35"
                />
              </filter>
            </defs>
            <ellipse
              className={Style.roseShadow}
              cx="130"
              cy="333"
              rx="58"
              ry="12"
            />
            <path
              className={Style.roseStemPath}
              d="M130 324 C126 275 137 241 128 198 C122 166 126 139 133 110"
            />
            <path
              className={Style.roseLeafOne}
              d="M126 238 C79 211 59 228 38 268 C82 269 111 260 126 238Z"
            />
            <path
              className={Style.roseLeafLineOne}
              d="M48 262 C79 251 102 245 126 238"
            />
            <path
              className={Style.roseLeafTwo}
              d="M133 218 C177 183 206 198 222 235 C184 242 153 238 133 218Z"
            />
            <path
              className={Style.roseLeafLineTwo}
              d="M213 232 C182 224 156 220 133 218"
            />
            <g className={Style.roseBloom} filter="url(#softRoseShadow)">
              <path
                className={Style.outerPetalOne}
                d="M130 116 C82 70 50 101 52 153 C54 205 94 223 128 192 C101 180 95 144 130 116Z"
              />
              <path
                className={Style.outerPetalTwo}
                d="M130 116 C178 70 210 101 208 153 C206 205 166 223 132 192 C159 180 165 144 130 116Z"
              />
              <path
                className={Style.outerPetalThree}
                d="M130 105 C93 45 124 25 163 54 C198 80 198 137 149 157 C153 136 145 118 130 105Z"
              />
              <path
                className={Style.outerPetalFour}
                d="M130 105 C167 45 136 25 97 54 C62 80 62 137 111 157 C107 136 115 118 130 105Z"
              />
              <path
                className={Style.middlePetalOne}
                d="M129 109 C91 97 80 137 100 171 C116 198 151 195 160 159 C135 160 121 140 129 109Z"
              />
              <path
                className={Style.middlePetalTwo}
                d="M132 109 C169 96 182 137 160 171 C143 197 110 193 100 158 C125 160 140 139 132 109Z"
              />
              <path
                className={Style.innerPetalOne}
                d="M130 94 C108 109 107 143 128 160 C148 142 150 112 130 94Z"
              />
              <path
                className={Style.innerPetalTwo}
                d="M130 96 C116 82 96 88 89 110 C105 113 122 108 130 96Z"
              />
              <path
                className={Style.innerPetalThree}
                d="M130 96 C144 82 164 88 171 110 C155 113 138 108 130 96Z"
              />
              <path
                className={Style.roseCenter}
                d="M130 103 C113 114 116 138 130 148 C145 138 147 115 130 103Z"
              />
              <path
                className={Style.roseHighlight}
                d="M102 104 C88 122 88 151 103 171"
              />
              <path
                className={Style.roseHighlightTwo}
                d="M159 82 C177 100 181 130 170 153"
              />
            </g>
          </svg>
          <div className={Style.roseCaption}>
            a little rose blooming for you
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 1.4,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
          className={Style.heroCopy}
        >
          <Typography component="p" className={Style.eyebrow}>
            a birthday surprise
          </Typography>
          <Typography component="h1">Happy Birthday, Motu ❤️</Typography>
          <Typography component="p" className={Style.subtitle}>
            I made this small garden of wishes for you. Open it slowly, one
            smile at a time.
          </Typography>
          <Button
            variant="contained"
            startIcon={<FavoriteIcon />}
            onClick={() => setStarted(true)}
            className={Style.primaryButton}
          >
            Open Your Surprise
          </Button>
        </motion.div>
      </section>

      <AnimatePresence>
        {started && !surpriseStarted && (
          <motion.section
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ type: "spring", stiffness: 95, damping: 15 }}
            className={Style.passwordSection}
          >
            <div className={Style.passwordPanel}>
              <LockIcon className={Style.panelIcon} />
              <Typography component="h2">A tiny secret first</Typography>
              <Typography component="p">
                Only the birthday girl knows the key to this little garden.
              </Typography>
              <Box
                component="form"
                onSubmit={unlockSurprise}
                className={Style.passwordForm}
              >
                <TextField
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="enter the name"
                  autoComplete="off"
                  error={Boolean(passwordError)}
                  helperText={passwordError || " "}
                  fullWidth
                  className={Style.passwordInput}
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AutoAwesomeIcon />}
                  className={Style.primaryButton}
                >
                  Let it bloom
                </Button>
              </Box>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCakeScene && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BirthdayCake />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMessageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={Style.messageOverlay}
          >
            <motion.article
              initial={{ opacity: 0, y: 36, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 36, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              className={Style.messageModal}
            >
              <button type="button" onClick={closeMessageModal}>
                x
              </button>
              <Typography component="p" className={Style.messageEyebrow}>
                read this first, my love
              </Typography>
              <img
                src={birthdayMessageImage}
                alt="A handwritten birthday letter"
              />
              <Button
                variant="contained"
                onClick={closeMessageModal}
                className={Style.primaryButton}
              >
                Continue your surprise
              </Button>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {journeyReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={Style.unlockedArea}
          >
            <section id="wish-garden" className={Style.storySection}>
              <div className={Style.sectionHeader}>
                <FavoriteIcon />
                <Typography component="h2">
                  A garden of wishes for you
                </Typography>
              </div>
              <div className={Style.cardGrid}>
                {wishCards.map((card, index) => (
                  <motion.article
                    key={card.title}
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      delay: index * 0.08,
                      type: "spring",
                      stiffness: 100,
                      damping: 14,
                    }}
                    whileHover={{ y: -8, rotate: index % 2 === 0 ? -1 : 1 }}
                    className={Style.memoryCard}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </motion.article>
                ))}
              </div>
            </section>

            <section className={Style.togetherSection}>
              <div className={Style.sectionHeader}>
                <FavoriteIcon />
                <Typography component="h2">Us, in little frames</Typography>
              </div>
              <Typography component="p" className={Style.sectionSubtext}>
                Some moments are too special to stay hidden in the gallery.
              </Typography>
              <div className={Style.polaroidWall}>
                {togetherPhotos.map((photo, index) => (
                  <motion.button
                    type="button"
                    key={photo.id}
                    initial={{ opacity: 0, y: 34, rotate: 0 }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      rotate: ((index % 5) - 2) * 2.8,
                    }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      delay: index * 0.06,
                      type: "spring",
                      stiffness: 110,
                      damping: 15,
                    }}
                    whileHover={{ y: -10, scale: 1.04, rotate: 0 }}
                    onClick={() => setSelectedMemory(photo)}
                    className={Style.polaroid}
                  >
                    <img
                      src={photo.src}
                      alt="A memory together"
                      loading="lazy"
                    />
                    <span>{photo.tag}</span>
                  </motion.button>
                ))}
              </div>
            </section>

            <section className={Style.cutieSection}>
              <Typography component="h2">The cutest collection</Typography>
              <Typography component="p">
                Tap any card. Some smiles deserve a little flip.
              </Typography>
              <div className={Style.flipGrid}>
                {cutiePhotos.map((photo, index) => (
                  <motion.button
                    type="button"
                    key={photo.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-70px" }}
                    transition={{ delay: (index % 8) * 0.035 }}
                    onClick={() => setSelectedMemory(photo)}
                    className={Style.flipCard}
                  >
                    <span className={Style.flipInner}>
                      <span className={Style.flipFront}>
                        {photo.type === "video" ? (
                          <video
                            src={photo.src}
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={photo.src}
                            alt="A cute memory"
                            loading="lazy"
                          />
                        )}
                      </span>
                      <span className={Style.flipBack}>
                        <FavoriteIcon />
                        <strong>{photo.flipMessage?.strong}</strong>
                        <small>{photo.flipMessage?.small}</small>
                      </span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </section>

            <section className={Style.weirdSection}>
              <Typography component="h2">The funny evidence folder</Typography>
              <Typography component="p">
                A tiny archive of weird, cute, and very important proof.
              </Typography>
              <div className={Style.evidenceBoard}>
                {weirdPhotos.map((photo, index) => (
                  <motion.button
                    type="button"
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.92, rotate: 0 }}
                    whileInView={{
                      opacity: 1,
                      scale: 1,
                      rotate: index % 2 === 0 ? -2 : 2,
                    }}
                    viewport={{ once: true, margin: "-70px" }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{
                      rotate: index % 2 === 0 ? 2 : -2,
                      scale: 1.04,
                    }}
                    onClick={() => setSelectedMemory(photo)}
                    className={Style.evidenceCard}
                  >
                    <span>Evidence {String(index + 1).padStart(2, "0")}</span>
                    <img src={photo.src} alt="A funny memory" loading="lazy" />
                  </motion.button>
                ))}
              </div>
            </section>

            <section className={Style.petalSection}>
              <Typography component="h2">Pick a petal</Typography>
              <Typography component="p">
                Every petal has something I wanted to say to you.
              </Typography>
              <div className={Style.petalPicker}>
                {petalNotes.map((note, index) => (
                  <button
                    type="button"
                    key={note}
                    onClick={() => setActivePetal(index)}
                    className={activePetal === index ? Style.activePetal : ""}
                  >
                    <FavoriteIcon />
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                {activePetal !== null && (
                  <motion.div
                    key={activePetal}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className={Style.petalNote}
                  >
                    {petalNotes[activePetal]}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <section className={Style.heartSection}>
              <Typography component="h2">Watch my heart form</Typography>
              <Typography component="p">
                A small heartbeat, drawn slowly for you.
              </Typography>
              <svg
                className={Style.heartSvg}
                viewBox="0 0 320 290"
                role="img"
                aria-label="Animated heart forming"
              >
                <path
                  className={Style.heartPath}
                  d="M160 258 C58 184 24 128 42 78 C58 34 112 28 160 84 C208 28 262 34 278 78 C296 128 262 184 160 258Z"
                />
                <path
                  className={Style.heartGlowPath}
                  d="M160 258 C58 184 24 128 42 78 C58 34 112 28 160 84 C208 28 262 34 278 78 C296 128 262 184 160 258Z"
                />
                <circle className={Style.heartDotOne} cx="101" cy="80" r="5" />
                <circle className={Style.heartDotTwo} cx="218" cy="80" r="5" />
              </svg>
            </section>

            <section className={Style.letterFolderSection}>
              <Typography component="h2">A letter kept safely</Typography>
              <Typography component="p">
                Tap the folder to open the card I wrote for you.
              </Typography>
              <button
                type="button"
                className={Style.folderButton}
                onClick={() => setShowFolderLetter(true)}
              >
                <span className={Style.folderBack} />
                <span className={Style.folderPaper}>For You</span>
                <span className={Style.folderFront} />
              </button>
            </section>

            <section className={Style.trickySection}>
              <Typography component="h2">A little playful moment</Typography>
              <Typography component="p">
                One button is shy. One button is dramatic. Both are yours.
              </Typography>
              <div className={Style.buttonLab}>
                <Button
                  variant="outlined"
                  onMouseEnter={handleRunaway}
                  onClick={handleRunaway}
                  className={Style.runawayButton}
                  sx={{
                    transform: `translate(${runawayCount * 16}px, ${runawayCount % 2 === 0 ? runawayCount * -7 : runawayCount * 7}px)`,
                  }}
                >
                  Catch your gift
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setShowLetter(true)}
                  className={Style.dangerButton}
                >
                  Open my heart
                </Button>
              </div>

              <AnimatePresence>
                {showGift && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.86 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.86 }}
                    className={Style.giftMessage}
                  >
                    Gift unlocked: endless support, warm hugs, and a boyfriend
                    who is always cheering for you.
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showLetter && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={Style.letterModal}
                  >
                    <button type="button" onClick={() => setShowLetter(false)}>
                      x
                    </button>
                    <strong>My birthday letter</strong>
                    <span>
                      I am proud of the woman you are becoming. Your dedication,
                      your softness, your dreams, and your smile make you so
                      special to me. Happy Birthday, my love.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <section className={Style.finalReveal}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 90, damping: 14 }}
              >
                <Typography component="p" className={Style.finalLabel}>
                  14 August
                </Typography>
                <Typography component="h2">Happy Birthday to You</Typography>
                <Typography component="p">
                  May your day be filled with flowers, blessings, laughter, and
                  the quiet confidence that everything beautiful meant for you
                  is finding its way to you.
                </Typography>
              </motion.div>
              <div className={Style.memoryMosaic} aria-label="Memory mosaic">
                {allMemories.slice(0, 42).map((memory, index) => (
                  <button
                    type="button"
                    key={`${memory.id}-mosaic`}
                    onClick={() => setSelectedMemory(memory)}
                    style={{ "--delay": `${index * 0.08}s` }}
                  >
                    {memory.type === "video" ? (
                      <video
                        src={memory.src}
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={memory.src}
                        alt="Birthday memory"
                        loading="lazy"
                      />
                    )}
                  </button>
                ))}
              </div>
            </section>

            <AnimatePresence>
              {showFolderLetter && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={Style.letterOverlay}
                >
                  <motion.article
                    initial={{ opacity: 0, y: 36, rotateX: -10, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 36, rotateX: -10, scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 120, damping: 16 }}
                    className={Style.letterCard}
                  >
                    <button
                      type="button"
                      onClick={() => setShowFolderLetter(false)}
                    >
                      x
                    </button>
                    <span>Happy Birthday, motu ❤️🥹</span>
                    <p>
                      I honestly don&apos;t know how to put everything I feel into
                      words, but I just want you to know how grateful I am that
                      you&apos;re in my life. From all the random conversations,
                      silly fights, annoying each other, laughing over stupid
                      things, to being there for each other when things aren&apos;t
                      going great… somehow all of it has become such an important
                      part of my life. 🫶🏻
                    </p>
                    <p>
                      I really like what we have. The comfort of knowing that
                      there&apos;s someone I can talk to about literally anything,
                      someone I can share my happiest moments with and also the
                      days when I&apos;m not okay. Someone who knows my stupid side,
                      my serious side, my mood swings, and still chooses to stay.
                      🥹❤️
                    </p>
                    <p>
                      I know we&apos;re not perfect, and we&apos;ll have our ups and
                      downs, but I genuinely want us to keep growing together,
                      understanding each other better, supporting each other, and
                      being each other&apos;s safe place. No matter how crazy life
                      gets, I want us to always feel like we&apos;re on the same
                      team. 🤝🏻❤️
                    </p>
                    <p>
                      I hope this year brings you everything you&apos;re working for,
                      lots of happiness, peace, success and countless reasons to
                      smile. And I hope I get to be there beside you for as many
                      of those moments as possible. 🥰
                    </p>
                    <p>
                      Thank you for being you, and thank you for being a part of my
                      life. ❤️
                    </p>
                    <strong>Happy Birthday once again, motu. 🎂🫶🏻</strong>
                    <p className={Style.letterSignOff}>
                      Here&apos;s to us, to everything we&apos;ve already shared, and
                      to all the beautiful memories we&apos;re still going to make
                      together. ❤️✨
                    </p>
                  </motion.article>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {selectedMemory && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={Style.memoryOverlay}
                  onClick={() => setSelectedMemory(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 28 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 28 }}
                    transition={{ type: "spring", stiffness: 120, damping: 16 }}
                    className={Style.memoryViewer}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedMemory(null)}
                    >
                      x
                    </button>
                    {selectedMemory.type === "video" ? (
                      <video
                        src={selectedMemory.src}
                        controls
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <img src={selectedMemory.src} alt="Selected memory" />
                    )}
                    <span>
                      {selectedMemory.viewerNote ||
                        "one more reason this page is only yours"}
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className={Style.musicButton}
        onClick={toggleMusic}
        aria-label="Toggle birthday music"
      >
        <MusicNoteIcon />
        <span>{musicPlaying ? "pause" : "play"}</span>
      </button>
      {musicMessage && <div className={Style.musicMessage}>{musicMessage}</div>}
    </Box>
  );
}
