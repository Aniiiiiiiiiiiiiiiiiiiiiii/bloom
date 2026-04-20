import { r as reactExports, l as MotionConfigContext, j as jsxRuntimeExports, n as isHTMLElement, o as useConstant, P as PresenceContext, p as usePresence, q as useIsomorphicLayoutEffect, L as LayoutGroupContext } from "./index-Biqxei8G.js";
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const btsMembers = [
  {
    id: "rm",
    name: "RM",
    role: ["Leader", "Main Rapper"],
    birthday: "1994-09-12",
    birthYear: 1994,
    nationality: "Korean",
    position: "Leader / Main Rapper",
    bio: "Kim Nam-joon (RM) is BTS's leader and one of K-pop's most respected lyricists. Self-taught in English, he is also an avid art collector and museum enthusiast.",
    funFacts: [
      "Taught himself English by watching the TV show 'Friends'",
      "Has an IQ of 148",
      "Is an avid contemporary art collector",
      "Co-wrote BTS's very first song as a trainee at age 15"
    ]
  },
  {
    id: "jin",
    name: "Jin",
    role: ["Vocalist"],
    birthday: "1992-12-04",
    birthYear: 1992,
    nationality: "Korean",
    position: "Vocalist",
    bio: "Kim Seok-jin (Jin) is known as 'Worldwide Handsome' and brings charisma, humor, and a powerful vocal range to BTS. The eldest member and the heart of the group.",
    funFacts: [
      "Was street cast by a Big Hit scout on his way to university",
      "Earned his Master's degree in film at Hanyang University",
      "His 'worldwide handsome' nickname went viral globally",
      "Holds the BTS record for the highest note hit live on stage"
    ]
  },
  {
    id: "suga",
    name: "Suga",
    role: ["Lead Rapper", "Songwriter", "Producer"],
    birthday: "1993-03-09",
    birthYear: 1993,
    nationality: "Korean",
    position: "Lead Rapper / Producer",
    bio: "Min Yoon-gi (Suga / Agust D) is a prolific songwriter and producer known for his raw lyrics about mental health, society, and personal struggle.",
    funFacts: [
      "Produced his first full mixtape 'Agust D' for free release as a gift to fans",
      "Has a love for American basketball — particularly the Chicago Bulls",
      "Worked as a delivery driver to pay for music equipment as a teenager",
      "Has co-written over 130 songs for BTS and other artists"
    ]
  },
  {
    id: "jhope",
    name: "J-Hope",
    role: ["Main Dancer", "Rapper", "Vocalist"],
    birthday: "1994-02-18",
    birthYear: 1994,
    nationality: "Korean",
    position: "Main Dancer / Rapper",
    bio: "Jung Ho-seok (J-Hope) is BTS's ray of sunshine on stage and off. His energetic performances and bright personality earned him the title 'Hope' of BTS.",
    funFacts: [
      "Became the first Korean solo artist to headline Lollapalooza",
      "Was a street dancer before joining Big Hit as a trainee",
      "His first word spoken on stage internationally was 'hope' in English",
      "His solo album 'Jack in the Box' explored a darker, alternative hip-hop sound"
    ]
  },
  {
    id: "jimin",
    name: "Jimin",
    role: ["Main Vocalist", "Main Dancer"],
    birthday: "1995-10-13",
    birthYear: 1995,
    nationality: "Korean",
    position: "Main Vocalist / Main Dancer",
    bio: "Park Ji-min (Jimin) is known for his fluid, emotive dancing and honey-like vocal timbre. His solo hit 'Like Crazy' became BTS's first #1 on the Billboard Hot 100 as a solo effort.",
    funFacts: [
      "'Like Crazy' debuted at #1 on the Billboard Hot 100",
      "He trained in contemporary dance and learned popping and locking in middle school",
      "His 2023 Grammy nomination made him the first BTS solo act nominated",
      "Speaks Japanese fluently and gave a full speech in Japanese at a Tokyo fan event"
    ]
  },
  {
    id: "v",
    name: "V",
    role: ["Vocalist", "Visual"],
    birthday: "1995-12-30",
    birthYear: 1995,
    nationality: "Korean",
    position: "Vocalist / Visual",
    bio: "Kim Tae-hyung (V) is BTS's multi-talented visual, known for his deep baritone voice, unique fashion sense, and passion for photography and fine art.",
    funFacts: [
      "Was kept secret from the public until BTS's official debut",
      "Has won multiple 'Most Handsome Man' polls globally",
      "Plays the saxophone and has featured it in BTS performances",
      "His Gucci collaboration sold out globally within 2 hours"
    ]
  },
  {
    id: "jungkook",
    name: "Jungkook",
    role: ["Main Vocalist", "Lead Dancer", "Sub-Rapper"],
    birthday: "1997-09-01",
    birthYear: 1997,
    nationality: "Korean",
    position: "Main Vocalist / Golden Maknae",
    bio: "Jeon Jung-kook (Jungkook) is BTS's 'Golden Maknae' — the youngest member who excels at everything: singing, dancing, rapping, and even photography.",
    funFacts: [
      "Was scouted by multiple entertainment companies at a talent show at age 13",
      "His cover videos on YouTube regularly surpass 100 million views",
      "Holds a black belt in Taekwondo",
      "His song '3D' (ft. Jack Harlow) debuted in the top 5 globally"
    ]
  }
];
const btsSongs = [
  {
    id: "dynamite",
    title: "Dynamite",
    album: "BE",
    releaseYear: 2020,
    streams: 175e7,
    youtubeViews: 165e7,
    itunesRank: 1,
    appleMusicRank: 1,
    weeklyTrend: [180, 175, 182, 190, 178, 185, 192],
    isTitle: true
  },
  {
    id: "butter",
    title: "Butter",
    album: "Butter",
    releaseYear: 2021,
    streams: 162e7,
    youtubeViews: 88e7,
    itunesRank: 1,
    appleMusicRank: 1,
    weeklyTrend: [165, 160, 168, 172, 162, 170, 175],
    isTitle: true
  },
  {
    id: "boy-with-luv",
    title: "Boy With Luv (feat. Halsey)",
    album: "MAP OF THE SOUL: PERSONA",
    releaseYear: 2019,
    streams: 148e7,
    youtubeViews: 68e7,
    itunesRank: 2,
    appleMusicRank: 2,
    weeklyTrend: [148, 143, 150, 155, 146, 152, 158],
    isTitle: true
  },
  {
    id: "permission-to-dance",
    title: "Permission to Dance",
    album: "Butter",
    releaseYear: 2021,
    streams: 135e7,
    youtubeViews: 52e7,
    itunesRank: 1,
    appleMusicRank: 1,
    weeklyTrend: [138, 132, 140, 145, 135, 142, 148],
    isTitle: true
  },
  {
    id: "idol",
    title: "IDOL",
    album: "LOVE YOURSELF: Answer",
    releaseYear: 2018,
    streams: 12e8,
    youtubeViews: 75e7,
    itunesRank: 3,
    appleMusicRank: 2,
    weeklyTrend: [122, 118, 124, 129, 120, 126, 131],
    isTitle: true
  },
  {
    id: "dna",
    title: "DNA",
    album: "LOVE YOURSELF: Her",
    releaseYear: 2017,
    streams: 11e8,
    youtubeViews: 65e7,
    itunesRank: 4,
    appleMusicRank: 3,
    weeklyTrend: [112, 108, 114, 118, 110, 115, 120],
    isTitle: true
  },
  {
    id: "spring-day",
    title: "Spring Day",
    album: "You Never Walk Alone",
    releaseYear: 2017,
    streams: 98e7,
    youtubeViews: 58e7,
    itunesRank: 5,
    appleMusicRank: 4,
    weeklyTrend: [100, 96, 102, 106, 98, 103, 108],
    isTitle: true
  },
  {
    id: "fake-love",
    title: "FAKE LOVE",
    album: "LOVE YOURSELF: Tear",
    releaseYear: 2018,
    streams: 92e7,
    youtubeViews: 68e7,
    itunesRank: 4,
    appleMusicRank: 5,
    weeklyTrend: [94, 90, 95, 99, 92, 97, 102],
    isTitle: true
  },
  {
    id: "mic-drop",
    title: "MIC Drop (Steve Aoki Remix)",
    album: "MIC Drop / DNA / Crystal Snow",
    releaseYear: 2017,
    streams: 84e7,
    youtubeViews: 45e7,
    itunesRank: 6,
    appleMusicRank: 6,
    weeklyTrend: [86, 82, 87, 91, 84, 88, 93],
    isTitle: false
  },
  {
    id: "black-swan",
    title: "Black Swan",
    album: "MAP OF THE SOUL: 7",
    releaseYear: 2020,
    streams: 78e7,
    youtubeViews: 22e7,
    itunesRank: 8,
    appleMusicRank: 7,
    weeklyTrend: [80, 76, 81, 84, 78, 82, 87],
    isTitle: false
  },
  {
    id: "like-crazy",
    title: "Like Crazy",
    album: "FACE (Jimin)",
    releaseYear: 2023,
    streams: 72e7,
    youtubeViews: 18e7,
    itunesRank: 1,
    appleMusicRank: 1,
    weeklyTrend: [74, 70, 75, 78, 72, 76, 80],
    isTitle: true
  },
  {
    id: "on",
    title: "ON",
    album: "MAP OF THE SOUL: 7",
    releaseYear: 2020,
    streams: 65e7,
    youtubeViews: 31e7,
    itunesRank: 4,
    appleMusicRank: 4,
    weeklyTrend: [66, 63, 67, 70, 64, 68, 72],
    isTitle: true
  },
  {
    id: "yet-to-come",
    title: "Yet To Come (The Most Beautiful Moment)",
    album: "Proof",
    releaseYear: 2022,
    streams: 61e7,
    youtubeViews: 2e8,
    itunesRank: 2,
    appleMusicRank: 2,
    weeklyTrend: [62, 59, 63, 66, 60, 64, 68],
    isTitle: true
  },
  {
    id: "lights",
    title: "Lights",
    album: "Lights / Boy With Luv",
    releaseYear: 2019,
    streams: 54e7,
    youtubeViews: 16e7,
    itunesRank: 12,
    appleMusicRank: 10,
    weeklyTrend: [55, 52, 56, 59, 53, 57, 61],
    isTitle: false
  },
  {
    id: "euphoria",
    title: "Euphoria",
    album: "LOVE YOURSELF: Answer",
    releaseYear: 2018,
    streams: 52e7,
    youtubeViews: 15e7,
    itunesRank: 14,
    appleMusicRank: 12,
    weeklyTrend: [53, 50, 54, 57, 51, 55, 59],
    isTitle: false
  },
  {
    id: "fire",
    title: "Fire",
    album: "Young Forever",
    releaseYear: 2016,
    streams: 49e7,
    youtubeViews: 5e8,
    itunesRank: 18,
    appleMusicRank: 15,
    weeklyTrend: [50, 47, 51, 54, 48, 52, 55],
    isTitle: true
  },
  {
    id: "run",
    title: "Run",
    album: "HYYH Part 2",
    releaseYear: 2015,
    streams: 46e7,
    youtubeViews: 28e7,
    itunesRank: 20,
    appleMusicRank: 18,
    weeklyTrend: [47, 44, 48, 51, 45, 49, 52],
    isTitle: true
  },
  {
    id: "boy-in-luv",
    title: "Boy In Luv",
    album: "Skool Luv Affair",
    releaseYear: 2014,
    streams: 42e7,
    youtubeViews: 22e7,
    itunesRank: 25,
    appleMusicRank: 22,
    weeklyTrend: [43, 40, 44, 47, 41, 45, 48],
    isTitle: true
  },
  {
    id: "n-o",
    title: "N.O",
    album: "O!RUL8,2?",
    releaseYear: 2013,
    streams: 38e7,
    youtubeViews: 19e7,
    itunesRank: 30,
    appleMusicRank: 28,
    weeklyTrend: [39, 36, 40, 43, 37, 41, 44],
    isTitle: true
  },
  {
    id: "no-more-dream",
    title: "No More Dream",
    album: "2 Cool 4 Skool",
    releaseYear: 2013,
    streams: 35e7,
    youtubeViews: 17e7,
    itunesRank: 35,
    appleMusicRank: 32,
    weeklyTrend: [36, 33, 37, 40, 34, 38, 41],
    isTitle: true
  }
];
const btsDiscography = [
  {
    id: "2-cool-4-skool",
    title: "2 Cool 4 Skool",
    type: "single",
    releaseDate: "2013-06-12",
    tracks: [
      "No More Dream",
      "We Are Bulletproof Pt. 2",
      "Skit: Circle Room Talk",
      "I Like It"
    ],
    coverColor: "oklch(0.4 0.15 270)",
    description: "The debut single that started it all."
  },
  {
    id: "o-rul8-2",
    title: "O!RUL8,2?",
    type: "ep",
    releaseDate: "2013-09-11",
    tracks: [
      "N.O",
      "We On",
      "Skit: R U Happy Now?",
      "If I Ruled the World",
      "Coffee",
      "BTS Cypher Pt. 1"
    ],
    coverColor: "oklch(0.42 0.16 275)",
    description: "Bold and youthful second EP addressing societal pressures."
  },
  {
    id: "skool-luv-affair",
    title: "Skool Luv Affair",
    type: "mini-album",
    releaseDate: "2014-02-12",
    tracks: [
      "Intro: Skool Luv Affair",
      "Boy In Luv",
      "Skit: Soulmate",
      "Where Did You Come From",
      "Just One Day",
      "Tomorrow"
    ],
    coverColor: "oklch(0.44 0.17 278)",
    description: "Transition into heartfelt themes of love and youth."
  },
  {
    id: "hyyh-pt1",
    title: "The Most Beautiful Moment in Life, Pt. 1",
    type: "mini-album",
    releaseDate: "2015-04-29",
    tracks: [
      "I Need U",
      "Hold Me Tight",
      "Skit: Expectation!",
      "Run",
      "Butterfly",
      "Whalien 52"
    ],
    coverColor: "oklch(0.5 0.18 280)",
    description: "The beginning of the legendary HYYH era."
  },
  {
    id: "wings",
    title: "WINGS",
    type: "album",
    releaseDate: "2016-10-10",
    tracks: [
      "Intro: Boy Meets Evil",
      "Blood Sweat & Tears",
      "Begin",
      "Lie",
      "Stigma",
      "First Love",
      "Reflection",
      "MAMA",
      "Awake",
      "Lost",
      "BTS Cypher 4",
      "Am I Wrong",
      "21st Century Girl",
      "2! 3!",
      "Interlude: Wings"
    ],
    coverColor: "oklch(0.52 0.19 282)",
    description: "BTS's artistic coming-of-age — their first full-length masterpiece."
  },
  {
    id: "love-yourself-tear",
    title: "LOVE YOURSELF: Tear",
    type: "album",
    releaseDate: "2018-05-18",
    tracks: [
      "Intro: Singularity",
      "FAKE LOVE",
      "The Truth Untold",
      "134340",
      "Paradise",
      "Love Maze",
      "Magic Shop",
      "Airplane Pt. 2",
      "Anpanman",
      "So What",
      "Outro: Tear"
    ],
    coverColor: "oklch(0.55 0.18 285)",
    description: "BTS's first #1 album on the Billboard 200."
  },
  {
    id: "map-of-the-soul-7",
    title: "MAP OF THE SOUL: 7",
    type: "album",
    releaseDate: "2020-02-21",
    tracks: [
      "Intro: Persona",
      "Boy With Luv",
      "Mikrokosmos",
      "Make It Right",
      "HOME",
      "Jamais Vu",
      "Dionysus",
      "Interlude: Shadow",
      "Black Swan",
      "Filter",
      "My Time",
      "Louder Than Bombs",
      "ON",
      "Ugh!",
      "00:00",
      "Inner Child",
      "Friends",
      "Moon",
      "Respect",
      "We Are Bulletproof: the Eternal",
      "Outro: Ego"
    ],
    coverColor: "oklch(0.58 0.18 288)",
    description: "A sweeping exploration of self, shadow, and persona."
  },
  {
    id: "be",
    title: "BE",
    type: "album",
    releaseDate: "2020-11-20",
    tracks: [
      "Life Goes On",
      "Fly To My Room",
      "Blue & Grey",
      "Telepathy",
      "Dis-ease",
      "Stay",
      "Dynamite"
    ],
    coverColor: "oklch(0.6 0.17 290)",
    description: "A heartfelt album created entirely in quarantine — a message to ARMY."
  },
  {
    id: "proof",
    title: "Proof",
    type: "album",
    releaseDate: "2022-06-10",
    tracks: [
      "Born Singer",
      "No More Dream",
      "N.O",
      "Boy In Luv",
      "Danger",
      "I Need U",
      "Run",
      "Burning Up (Fire)",
      "DNA",
      "MIC Drop",
      "DNA (Japanese Version)",
      "Dynamite",
      "Life Goes On",
      "Butter",
      "Permission to Dance",
      "Yet To Come (The Most Beautiful Moment)"
    ],
    coverColor: "oklch(0.62 0.16 290)",
    description: "BTS's anthology celebrating 9 years of music and memories."
  }
];
const btsTriviaQuestions = [
  {
    id: "bts-q1",
    question: "Which BTS song was their first English-language single?",
    options: ["Butter", "Dynamite", "Permission to Dance", "DNA"],
    correctAnswer: 1,
    category: "songs",
    explanation: "'Dynamite' was BTS's first single recorded entirely in English, released in 2020.",
    difficulty: "easy"
  },
  {
    id: "bts-q2",
    question: "What does BTS stand for in Korean?",
    options: [
      "Best Team Superior",
      "Bangtan Sonyeondan",
      "Beautiful True Stars",
      "Beyond the Scene"
    ],
    correctAnswer: 1,
    category: "general",
    explanation: "BTS stands for 'Bangtan Sonyeondan' meaning 'Bulletproof Boy Scouts'.",
    difficulty: "easy"
  },
  {
    id: "bts-q3",
    question: "Who is the leader of BTS?",
    options: ["Jin", "Suga", "RM", "J-Hope"],
    correctAnswer: 2,
    category: "members",
    explanation: "RM (Kim Nam-joon) is the leader of BTS, recognized for his leadership and lyrical talents.",
    difficulty: "easy"
  },
  {
    id: "bts-q4",
    question: "In what year did BTS debut?",
    options: ["2011", "2012", "2013", "2014"],
    correctAnswer: 2,
    category: "history",
    explanation: "BTS debuted on June 13, 2013 under Big Hit Entertainment.",
    difficulty: "easy"
  },
  {
    id: "bts-q5",
    question: "Which BTS album was the first K-pop album to hit #1 on the Billboard 200?",
    options: [
      "Wings",
      "LOVE YOURSELF: Tear",
      "MAP OF THE SOUL: PERSONA",
      "MAP OF THE SOUL: 7"
    ],
    correctAnswer: 1,
    category: "awards",
    explanation: "'LOVE YOURSELF: Tear' made history as the first Korean-language album to top the Billboard 200.",
    difficulty: "medium"
  },
  {
    id: "bts-q6",
    question: "RM taught himself English by watching which TV show?",
    options: ["The Office", "Friends", "Breaking Bad", "How I Met Your Mother"],
    correctAnswer: 1,
    category: "members",
    explanation: "RM famously taught himself English primarily through watching 'Friends'.",
    difficulty: "medium"
  },
  {
    id: "bts-q7",
    question: "Which member was the first Korean solo artist to headline Lollapalooza?",
    options: ["Jungkook", "Suga", "J-Hope", "RM"],
    correctAnswer: 2,
    category: "awards",
    explanation: "J-Hope headlined Lollapalooza Chicago 2022, becoming the first Korean artist to do so.",
    difficulty: "medium"
  },
  {
    id: "bts-q8",
    question: "What is Jungkook's nickname within BTS?",
    options: ["Worldwide Handsome", "Genius", "Golden Maknae", "Hope"],
    correctAnswer: 2,
    category: "members",
    explanation: "Jungkook is called the 'Golden Maknae' because he excels at virtually everything.",
    difficulty: "easy"
  },
  {
    id: "bts-q9",
    question: "Which Jimin solo song debuted at #1 on the Billboard Hot 100?",
    options: ["Serendipity", "Promise", "Like Crazy", "Set Me Free Pt. 2"],
    correctAnswer: 2,
    category: "songs",
    explanation: "'Like Crazy' became BTS's first solo effort to debut at #1 on the Billboard Hot 100.",
    difficulty: "medium"
  },
  {
    id: "bts-q10",
    question: "How many members are in BTS?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2,
    category: "members",
    explanation: "BTS consists of 7 members: RM, Jin, Suga, J-Hope, Jimin, V, and Jungkook.",
    difficulty: "easy"
  },
  {
    id: "bts-q11",
    question: "What is the BTS fandom called?",
    options: ["BTS Babes", "Bangtanies", "ARMY", "BTS Stars"],
    correctAnswer: 2,
    category: "general",
    explanation: "BTS fans are called 'ARMY', which stands for Adorable Representative M.C. for Youth.",
    difficulty: "easy"
  },
  {
    id: "bts-q12",
    question: "Which BTS member has an IQ of 148?",
    options: ["Suga", "RM", "Jungkook", "V"],
    correctAnswer: 1,
    category: "members",
    explanation: "RM has an IQ of 148 and is considered a genius-level intellect within the group.",
    difficulty: "hard"
  },
  {
    id: "bts-q13",
    question: "Who was the eldest member of BTS?",
    options: ["RM", "Suga", "Jin", "J-Hope"],
    correctAnswer: 2,
    category: "members",
    explanation: "Jin (born December 4, 1992) is the oldest member of BTS.",
    difficulty: "easy"
  },
  {
    id: "bts-q14",
    question: "What is J-Hope's real name?",
    options: ["Park Jimin", "Jung Ho-seok", "Kim Tae-hyung", "Min Yoon-gi"],
    correctAnswer: 1,
    category: "members",
    explanation: "J-Hope's real name is Jung Ho-seok.",
    difficulty: "medium"
  },
  {
    id: "bts-q15",
    question: "Which BTS song has the most YouTube views?",
    options: ["DNA", "Fire", "Dynamite", "Boy With Luv"],
    correctAnswer: 2,
    category: "songs",
    explanation: "'Dynamite' has accumulated over 1.65 billion YouTube views, making it BTS's most viewed video.",
    difficulty: "medium"
  },
  {
    id: "bts-q16",
    question: "Suga's solo alter ego is named?",
    options: ["D-boy", "Agust D", "YOONGI", "Min Suga"],
    correctAnswer: 1,
    category: "members",
    explanation: "Suga releases music under the name 'Agust D', which is 'DT Suga' backwards.",
    difficulty: "medium"
  },
  {
    id: "bts-q17",
    question: "V plays which instrument?",
    options: ["Piano", "Guitar", "Saxophone", "Drums"],
    correctAnswer: 2,
    category: "members",
    explanation: "V plays the saxophone and has showcased this talent during BTS events.",
    difficulty: "medium"
  },
  {
    id: "bts-q18",
    question: "What was BTS's debut song?",
    options: ["N.O", "We Are Bulletproof Pt. 2", "No More Dream", "Danger"],
    correctAnswer: 2,
    category: "history",
    explanation: "'No More Dream' was BTS's official debut song from their first single '2 Cool 4 Skool'.",
    difficulty: "medium"
  },
  {
    id: "bts-q19",
    question: "Which BTS album contains 'Black Swan'?",
    options: ["WINGS", "BE", "MAP OF THE SOUL: 7", "LOVE YOURSELF: Answer"],
    correctAnswer: 2,
    category: "songs",
    explanation: "'Black Swan' appears on 'MAP OF THE SOUL: 7', released in February 2020.",
    difficulty: "medium"
  },
  {
    id: "bts-q20",
    question: "Jungkook holds a black belt in which martial art?",
    options: ["Judo", "Karate", "Taekwondo", "Hapkido"],
    correctAnswer: 2,
    category: "members",
    explanation: "Jungkook holds a black belt in Taekwondo, demonstrating his athletic excellence.",
    difficulty: "hard"
  },
  {
    id: "bts-q21",
    question: "Which agency founded by Big Hit became BTS's umbrella company?",
    options: [
      "SM Entertainment",
      "JYP Entertainment",
      "HYBE",
      "YG Entertainment"
    ],
    correctAnswer: 2,
    category: "history",
    explanation: "Big Hit Entertainment rebranded and expanded into HYBE Corporation in 2021.",
    difficulty: "medium"
  },
  {
    id: "bts-q22",
    question: "What was the name of BTS's anthology album released in 2022?",
    options: ["Proof", "Answer", "Map of the Soul", "Tear"],
    correctAnswer: 0,
    category: "songs",
    explanation: "'Proof' was released in 2022 as BTS's anthology celebrating their first 9 years.",
    difficulty: "medium"
  },
  {
    id: "bts-q23",
    question: "Jin's nickname is?",
    options: [
      "World Class Beauty",
      "Worldwide Handsome",
      "Korean Prince",
      "Pretty Vocalist"
    ],
    correctAnswer: 1,
    category: "members",
    explanation: "Jin's iconic self-given nickname is 'Worldwide Handsome', a phrase that went viral.",
    difficulty: "easy"
  },
  {
    id: "bts-q24",
    question: "What landmark speech did BTS give in 2018?",
    options: [
      "Grammy acceptance",
      "United Nations speech",
      "Oscar speech",
      "Billboard speech"
    ],
    correctAnswer: 1,
    category: "awards",
    explanation: "BTS delivered a landmark speech at the United Nations in 2018 as part of the 'UNICEF Love Myself' campaign.",
    difficulty: "medium"
  },
  {
    id: "bts-q25",
    question: "Which BTS song features Halsey?",
    options: ["Dynamite", "DNA", "Boy With Luv", "Permission to Dance"],
    correctAnswer: 2,
    category: "songs",
    explanation: "'Boy With Luv (feat. Halsey)' was a major international collab released in April 2019.",
    difficulty: "easy"
  },
  {
    id: "bts-q26",
    question: "What is BTS's all-time most streamed song?",
    options: ["Butter", "Spring Day", "DNA", "Dynamite"],
    correctAnswer: 3,
    category: "songs",
    explanation: "'Dynamite' tops BTS's stream count at approximately 1.75 billion Spotify streams.",
    difficulty: "medium"
  },
  {
    id: "bts-q27",
    question: "Suga worked as a delivery driver to fund what?",
    options: [
      "His education",
      "Music equipment",
      "A studio",
      "A debut showcase"
    ],
    correctAnswer: 1,
    category: "members",
    explanation: "As a teenager, Suga worked night delivery jobs to purchase music equipment for producing.",
    difficulty: "hard"
  },
  {
    id: "bts-q28",
    question: "What was BTS's first Billboard Hot 100 #1 song?",
    options: ["DNA", "Butter", "Dynamite", "Permission to Dance"],
    correctAnswer: 2,
    category: "awards",
    explanation: "'Dynamite' gave BTS their first #1 on the Billboard Hot 100 in August 2020.",
    difficulty: "medium"
  },
  {
    id: "bts-q29",
    question: "V's real name is?",
    options: ["Kim Seok-jin", "Kim Tae-hyung", "Jeon Jung-kook", "Park Ji-min"],
    correctAnswer: 1,
    category: "members",
    explanation: "V's full real name is Kim Tae-hyung.",
    difficulty: "medium"
  },
  {
    id: "bts-q30",
    question: "How many consecutive weeks did 'Butter' sit at #1 on the Billboard Hot 100?",
    options: ["5", "8", "10", "12"],
    correctAnswer: 2,
    category: "awards",
    explanation: "'Butter' spent 10 weeks at #1 on the Billboard Hot 100, setting a record for BTS.",
    difficulty: "hard"
  }
];
const btsFunFacts = [
  {
    id: "bts-f1",
    text: "BTS are the best-selling music artists in South Korean history.",
    category: "achievement",
    emoji: "🏆"
  },
  {
    id: "bts-f2",
    text: "RM has an IQ of 148 and taught himself English by watching 'Friends'.",
    category: "member",
    emoji: "🧠",
    memberName: "RM"
  },
  {
    id: "bts-f3",
    text: "'Dynamite' was BTS's first entirely English-language single and their first Billboard Hot 100 #1.",
    category: "achievement",
    emoji: "💥"
  },
  {
    id: "bts-f4",
    text: "BTS has been awarded the Order of Cultural Merit by the President of South Korea.",
    category: "achievement",
    emoji: "🎖️"
  },
  {
    id: "bts-f5",
    text: "J-Hope was a street dancer before becoming a Big Hit trainee.",
    category: "member",
    emoji: "🕺",
    memberName: "J-Hope"
  },
  {
    id: "bts-f6",
    text: "'Spring Day' has charted on South Korea's Melon for over 7 consecutive years without stopping.",
    category: "achievement",
    emoji: "🌸"
  },
  {
    id: "bts-f7",
    text: "Suga wrote over 130 songs for BTS and other artists.",
    category: "member",
    emoji: "✍️",
    memberName: "Suga"
  },
  {
    id: "bts-f8",
    text: "BTS delivered a speech at the United Nations General Assembly in 2018.",
    category: "achievement",
    emoji: "🌐"
  },
  {
    id: "bts-f9",
    text: "V was kept completely secret from the public until BTS's official debut day.",
    category: "member",
    emoji: "🤫",
    memberName: "V"
  },
  {
    id: "bts-f10",
    text: "Jungkook turned down multiple entertainment company offers to train at Big Hit at age 13.",
    category: "member",
    emoji: "⭐",
    memberName: "Jungkook"
  },
  {
    id: "bts-f11",
    text: "BTS's 'ARMY' fan club is recognized as the largest and most active fandom in the world.",
    category: "achievement",
    emoji: "💜"
  },
  {
    id: "bts-f12",
    text: "Jin earned his Master's degree from Hanyang University's graduate school of art.",
    category: "member",
    emoji: "🎓",
    memberName: "Jin"
  },
  {
    id: "bts-f13",
    text: "Jimin's 'Like Crazy' is the first BTS solo song to debut at #1 on the Billboard Hot 100.",
    category: "achievement",
    emoji: "🥇",
    memberName: "Jimin"
  },
  {
    id: "bts-f14",
    text: "BTS performed at the 2019 Grammy Awards and became the first K-pop act to present an award.",
    category: "achievement",
    emoji: "🎵"
  },
  {
    id: "bts-f15",
    text: "Suga's free mixtape 'Agust D' accumulated over 100M streams without any commercial promotion.",
    category: "member",
    emoji: "🎤",
    memberName: "Suga"
  },
  {
    id: "bts-f16",
    text: "BTS's global tour 'Love Yourself' grossed over $170 million, setting a K-pop record.",
    category: "achievement",
    emoji: "💰"
  },
  {
    id: "bts-f17",
    text: "J-Hope became the first Korean artist to headline a major US music festival (Lollapalooza 2022).",
    category: "achievement",
    emoji: "🎪",
    memberName: "J-Hope"
  },
  {
    id: "bts-f18",
    text: "RM is a serious art collector who regularly visits galleries worldwide during tours.",
    category: "member",
    emoji: "🖼️",
    memberName: "RM"
  },
  {
    id: "bts-f19",
    text: "BTS broke their own YouTube 24-hour viewing record three consecutive times.",
    category: "achievement",
    emoji: "📺"
  },
  {
    id: "bts-f20",
    text: "V's Gucci collaboration sold out globally within 2 hours of release.",
    category: "member",
    emoji: "👗",
    memberName: "V"
  },
  {
    id: "bts-f21",
    text: "BTS donated $1 million to the Black Lives Matter movement, which ARMY matched within 24 hours.",
    category: "achievement",
    emoji: "✊"
  },
  {
    id: "bts-f22",
    text: "Jungkook holds a black belt in Taekwondo and regularly trains in the martial art.",
    category: "member",
    emoji: "🥋",
    memberName: "Jungkook"
  }
];
const cortisMembers = [
  {
    id: "zion",
    name: "Zion",
    role: ["Leader", "Main Rapper", "Vocalist"],
    birthday: "1999-04-14",
    birthYear: 1999,
    nationality: "Korean",
    position: "Leader / Main Rapper",
    bio: "Zion is Cortis's visionary leader, known for razor-sharp rap delivery and the group's signature cyberpunk lyrical style. He conceptualized much of Cortis's sci-fi aesthetic.",
    funFacts: [
      "Holds a degree in electronic music production",
      "Designed Cortis's debut logo himself",
      "Collects antique circuit boards as decoration",
      "His stage name 'Zion' references the concept of a utopian digital city"
    ]
  },
  {
    id: "nova",
    name: "Nova",
    role: ["Main Vocalist", "Visual"],
    birthday: "2000-07-22",
    birthYear: 2e3,
    nationality: "Korean",
    position: "Main Vocalist / Visual",
    bio: "Nova's voice is otherworldly — capable of emotional ballads and futuristic electronic sound alike. The visual of Cortis with an androgynous, high-fashion aesthetic.",
    funFacts: [
      "Former fashion intern at a Seoul couture house",
      "Nova's voice range spans four octaves",
      "Has synesthesia — experiences music as vivid colors",
      "Inspired the concept for the 'NEON MATRIX' music video single-handedly"
    ]
  },
  {
    id: "ryx",
    name: "Ryx",
    role: ["Main Dancer", "Sub-Vocalist"],
    birthday: "2001-01-30",
    birthYear: 2001,
    nationality: "Chinese",
    position: "Main Dancer",
    bio: "Ryx trained in Beijing before moving to Seoul. His dance style combines contemporary, popping, and robotic movement, perfectly fitting Cortis's machine-meets-human concept.",
    funFacts: [
      "Studied dance at Beijing Dance Academy for 4 years",
      "Choreographed the iconic 'Glitch Protocol' dance break",
      "Speaks Mandarin, Korean, and English fluently",
      "Is a competitive chess player"
    ]
  },
  {
    id: "kael",
    name: "Kael",
    role: ["Lead Dancer", "Lead Vocalist"],
    birthday: "2001-09-05",
    birthYear: 2001,
    nationality: "Korean",
    position: "Lead Dancer / Lead Vocalist",
    bio: "Kael blends powerful vocal performance with precise choreography. His stage presence is electric, bringing warmth to Cortis's otherwise cold, mechanical aesthetic.",
    funFacts: [
      "Was a competitive swimmer before pivoting to performance arts",
      "His smile is voted by Cortex as the 'most infectious in K-pop'",
      "Plays bass guitar and features it on Cortis B-sides",
      "Created a popular 'Cortis dance challenge' that went viral on social media"
    ]
  },
  {
    id: "sol",
    name: "Sol",
    role: ["Lead Rapper", "Dancer"],
    birthday: "2002-03-17",
    birthYear: 2002,
    nationality: "Korean",
    position: "Lead Rapper",
    bio: "Sol's aggressive rap style and introspective lyrics add a raw, human dimension to Cortis's sci-fi narrative. Off-stage, he's known for his dry humor and love of ramen.",
    funFacts: [
      "Started writing rap lyrics at age 11",
      "Has a collection of over 200 baseball caps",
      "Sol's verse on 'Deep Code' is cited in K-pop rap analysis videos",
      "Speaks fluent English and does most group interviews in both Korean and English"
    ]
  },
  {
    id: "ten",
    name: "Ten",
    role: ["Vocalist", "Maknae"],
    birthday: "2003-11-28",
    birthYear: 2003,
    nationality: "Korean",
    position: "Vocalist / Maknae",
    bio: "The youngest and most mischievous of Cortis, Ten's sweet high-register vocals contrast perfectly with the group's darker concept. A fan favorite for his genuine off-stage personality.",
    funFacts: [
      "Youngest member of Cortis",
      "Has a talent for impressions — can mimic all 5 other members perfectly",
      "Loves cooking and posts regular recipe videos in Cortis's fan community",
      "His stage name 'Ten' was chosen because he always gives 10 out of 10"
    ]
  }
];
const cortisSongs = [
  {
    id: "glitch-protocol",
    title: "Glitch Protocol",
    album: "SYSTEM ERROR",
    releaseYear: 2023,
    streams: 38e7,
    youtubeViews: 26e7,
    itunesRank: 3,
    appleMusicRank: 4,
    weeklyTrend: [38, 35, 40, 42, 37, 41, 44],
    isTitle: true
  },
  {
    id: "neon-matrix",
    title: "NEON MATRIX",
    album: "SYSTEM ERROR",
    releaseYear: 2023,
    streams: 245e6,
    youtubeViews: 168e6,
    itunesRank: 6,
    appleMusicRank: 5,
    weeklyTrend: [25, 22, 26, 28, 24, 27, 30],
    isTitle: false
  },
  {
    id: "deep-code",
    title: "Deep Code",
    album: "SYSTEM ERROR",
    releaseYear: 2023,
    streams: 198e6,
    youtubeViews: 13e7,
    itunesRank: 9,
    appleMusicRank: 8,
    weeklyTrend: [20, 18, 21, 23, 19, 22, 24],
    isTitle: false
  },
  {
    id: "digital-ghost",
    title: "Digital Ghost",
    album: "CORTEX RISING",
    releaseYear: 2022,
    streams: 175e6,
    youtubeViews: 115e6,
    itunesRank: 11,
    appleMusicRank: 10,
    weeklyTrend: [18, 16, 19, 21, 17, 20, 22],
    isTitle: true
  },
  {
    id: "override",
    title: "Override",
    album: "CORTEX RISING",
    releaseYear: 2022,
    streams: 152e6,
    youtubeViews: 98e6,
    itunesRank: 14,
    appleMusicRank: 13,
    weeklyTrend: [15, 13, 16, 18, 14, 17, 19],
    isTitle: false
  },
  {
    id: "synthwave",
    title: "Synthwave",
    album: "SYSTEM ERROR",
    releaseYear: 2023,
    streams: 134e6,
    youtubeViews: 85e6,
    itunesRank: 17,
    appleMusicRank: 15,
    weeklyTrend: [13, 11, 14, 16, 12, 15, 17],
    isTitle: false
  },
  {
    id: "phantom-data",
    title: "Phantom Data",
    album: "CORTEX RISING",
    releaseYear: 2022,
    streams: 118e6,
    youtubeViews: 72e6,
    itunesRank: 20,
    appleMusicRank: 18,
    weeklyTrend: [12, 10, 13, 14, 11, 13, 15],
    isTitle: false
  },
  {
    id: "electric-pulse",
    title: "Electric Pulse",
    album: "ZERO DAY",
    releaseYear: 2024,
    streams: 105e6,
    youtubeViews: 64e6,
    itunesRank: 22,
    appleMusicRank: 20,
    weeklyTrend: [10, 9, 11, 13, 10, 12, 13],
    isTitle: true
  },
  {
    id: "corrupted-dream",
    title: "Corrupted Dream",
    album: "ZERO DAY",
    releaseYear: 2024,
    streams: 96e6,
    youtubeViews: 58e6,
    itunesRank: 25,
    appleMusicRank: 22,
    weeklyTrend: [9, 8, 10, 11, 9, 10, 12],
    isTitle: false
  },
  {
    id: "hack-the-world",
    title: "Hack The World",
    album: "SYSTEM ERROR",
    releaseYear: 2023,
    streams: 88e6,
    youtubeViews: 52e6,
    itunesRank: 28,
    appleMusicRank: 26,
    weeklyTrend: [9, 8, 9, 10, 8, 9, 11],
    isTitle: false
  },
  {
    id: "binary-heart",
    title: "Binary Heart",
    album: "CORTEX RISING",
    releaseYear: 2022,
    streams: 79e6,
    youtubeViews: 48e6,
    itunesRank: 32,
    appleMusicRank: 30,
    weeklyTrend: [8, 7, 8, 9, 7, 8, 9],
    isTitle: false
  },
  {
    id: "frequency",
    title: "Frequency",
    album: "ZERO DAY",
    releaseYear: 2024,
    streams: 72e6,
    youtubeViews: 44e6,
    itunesRank: 35,
    appleMusicRank: 33,
    weeklyTrend: [7, 6, 7, 8, 7, 7, 8],
    isTitle: false
  },
  {
    id: "circuit-breaker",
    title: "Circuit Breaker",
    album: "SYSTEM ERROR",
    releaseYear: 2023,
    streams: 65e6,
    youtubeViews: 4e7,
    itunesRank: null,
    appleMusicRank: 38,
    weeklyTrend: [6, 6, 7, 7, 6, 7, 7],
    isTitle: false
  },
  {
    id: "pixel-love",
    title: "Pixel Love",
    album: "ZERO DAY",
    releaseYear: 2024,
    streams: 59e6,
    youtubeViews: 36e6,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [6, 5, 6, 7, 6, 6, 7],
    isTitle: false
  },
  {
    id: "static-emotion",
    title: "Static Emotion",
    album: "CORTEX RISING",
    releaseYear: 2022,
    streams: 54e6,
    youtubeViews: 33e6,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [5, 5, 6, 6, 5, 6, 6],
    isTitle: false
  },
  {
    id: "reboot",
    title: "Reboot",
    album: "ZERO DAY",
    releaseYear: 2024,
    streams: 49e6,
    youtubeViews: 3e7,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [5, 4, 5, 6, 5, 5, 6],
    isTitle: false
  },
  {
    id: "quantum-leap",
    title: "Quantum Leap",
    album: "SYSTEM ERROR",
    releaseYear: 2023,
    streams: 44e6,
    youtubeViews: 27e6,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [4, 4, 5, 5, 4, 5, 5],
    isTitle: false
  },
  {
    id: "data-storm",
    title: "Data Storm",
    album: "CORTEX RISING",
    releaseYear: 2022,
    streams: 4e7,
    youtubeViews: 24e6,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [4, 4, 4, 5, 4, 4, 5],
    isTitle: false
  },
  {
    id: "signal-noise",
    title: "Signal Noise",
    album: "ZERO DAY",
    releaseYear: 2024,
    streams: 36e6,
    youtubeViews: 21e6,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [3, 4, 4, 4, 3, 4, 4],
    isTitle: false
  },
  {
    id: "dark-server",
    title: "Dark Server",
    album: "CORTEX RISING",
    releaseYear: 2022,
    streams: 32e6,
    youtubeViews: 19e6,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [3, 3, 4, 4, 3, 3, 4],
    isTitle: false
  }
];
const cortisDiscography = [
  {
    id: "cortex-rising",
    title: "CORTEX RISING",
    type: "mini-album",
    releaseDate: "2022-07-19",
    tracks: [
      "Digital Ghost",
      "Override",
      "Phantom Data",
      "Binary Heart",
      "Static Emotion",
      "Data Storm",
      "Dark Server"
    ],
    coverColor: "oklch(0.5 0.18 200)",
    description: "Cortis's debut EP that introduced their cyberpunk world to K-pop audiences."
  },
  {
    id: "system-error",
    title: "SYSTEM ERROR",
    type: "album",
    releaseDate: "2023-04-05",
    tracks: [
      "Glitch Protocol",
      "NEON MATRIX",
      "Deep Code",
      "Synthwave",
      "Hack The World",
      "Circuit Breaker",
      "Quantum Leap",
      "Frequency (Bonus)"
    ],
    coverColor: "oklch(0.55 0.18 195)",
    description: "Their debut full-length album, a sci-fi concept album exploring digital consciousness."
  },
  {
    id: "zero-day",
    title: "ZERO DAY",
    type: "mini-album",
    releaseDate: "2024-02-14",
    tracks: [
      "Electric Pulse",
      "Corrupted Dream",
      "Frequency",
      "Pixel Love",
      "Reboot",
      "Signal Noise"
    ],
    coverColor: "oklch(0.6 0.18 190)",
    description: "Dark Valentine concept EP, exploring emotion in a digital void."
  }
];
const cortisTriviaQuestions = [
  {
    id: "cortis-q1",
    question: "What is Cortis's signature aesthetic concept?",
    options: [
      "Retro Disco",
      "Cyberpunk / Tech-noir",
      "Tropical Fantasy",
      "Medieval Fantasy"
    ],
    correctAnswer: 1,
    category: "general",
    explanation: "Cortis is known for their futuristic cyberpunk, tech-noir concept and aesthetic.",
    difficulty: "easy"
  },
  {
    id: "cortis-q2",
    question: "How many members are in Cortis?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 2,
    category: "members",
    explanation: "Cortis consists of 6 members: Zion, Nova, Ryx, Kael, Sol, and Ten.",
    difficulty: "easy"
  },
  {
    id: "cortis-q3",
    question: "What is the name of Cortis's fandom?",
    options: ["Stars", "Cortex", "Circuit", "Nova"],
    correctAnswer: 1,
    category: "general",
    explanation: "Cortis's fandom is called 'Cortex'.",
    difficulty: "easy"
  },
  {
    id: "cortis-q4",
    question: "Which member choreographed the iconic 'Glitch Protocol' dance break?",
    options: ["Zion", "Nova", "Ryx", "Kael"],
    correctAnswer: 2,
    category: "members",
    explanation: "Ryx choreographed the signature 'Glitch Protocol' dance break.",
    difficulty: "medium"
  },
  {
    id: "cortis-q5",
    question: "In what year did Cortis debut?",
    options: ["2020", "2021", "2022", "2023"],
    correctAnswer: 2,
    category: "history",
    explanation: "Cortis debuted in July 2022 with the mini-album 'CORTEX RISING'.",
    difficulty: "easy"
  },
  {
    id: "cortis-q6",
    question: "Which Cortis song has the most streams?",
    options: ["Digital Ghost", "NEON MATRIX", "Glitch Protocol", "Deep Code"],
    correctAnswer: 2,
    category: "songs",
    explanation: "'Glitch Protocol' is Cortis's most streamed song with approximately 380M streams.",
    difficulty: "medium"
  },
  {
    id: "cortis-q7",
    question: "Which Cortis member has synesthesia?",
    options: ["Zion", "Nova", "Kael", "Sol"],
    correctAnswer: 1,
    category: "members",
    explanation: "Nova has synesthesia, meaning they experience music as vivid colors.",
    difficulty: "hard"
  },
  {
    id: "cortis-q8",
    question: "What nationality is Ryx?",
    options: ["Korean", "Japanese", "Chinese", "Thai"],
    correctAnswer: 2,
    category: "members",
    explanation: "Ryx is from China and studied dance at the Beijing Dance Academy.",
    difficulty: "medium"
  },
  {
    id: "cortis-q9",
    question: "Which member designed Cortis's debut logo?",
    options: ["Nova", "Sol", "Kael", "Zion"],
    correctAnswer: 3,
    category: "members",
    explanation: "Zion, the leader, personally designed Cortis's debut logo.",
    difficulty: "hard"
  },
  {
    id: "cortis-q10",
    question: "Kael plays which instrument?",
    options: ["Guitar", "Piano", "Bass guitar", "Violin"],
    correctAnswer: 2,
    category: "members",
    explanation: "Kael plays bass guitar, which features on various Cortis B-sides.",
    difficulty: "medium"
  },
  {
    id: "cortis-q11",
    question: "What is the theme of Cortis's album 'ZERO DAY'?",
    options: [
      "Sunrise",
      "Dark Valentine in a digital void",
      "Summer love",
      "Revenge"
    ],
    correctAnswer: 1,
    category: "songs",
    explanation: "'ZERO DAY' is a dark Valentine concept EP exploring emotion in a digital void.",
    difficulty: "medium"
  },
  {
    id: "cortis-q12",
    question: "Nova's voice can span how many octaves?",
    options: ["Two", "Three", "Four", "Five"],
    correctAnswer: 2,
    category: "members",
    explanation: "Nova's extraordinary voice spans four octaves.",
    difficulty: "hard"
  },
  {
    id: "cortis-q13",
    question: "Sol's verse on which song is famous in K-pop rap analysis?",
    options: ["Override", "Deep Code", "Glitch Protocol", "Hack The World"],
    correctAnswer: 1,
    category: "songs",
    explanation: "Sol's verse on 'Deep Code' is widely cited in K-pop rap analysis content.",
    difficulty: "hard"
  },
  {
    id: "cortis-q14",
    question: "What is Ten's talent that fans love?",
    options: ["Cooking", "Impressions of members", "Magic tricks", "Drawing"],
    correctAnswer: 1,
    category: "members",
    explanation: "Ten can perfectly mimic all five other Cortis members, a beloved fan-appreciated talent.",
    difficulty: "medium"
  },
  {
    id: "cortis-q15",
    question: "Where did Ryx train in dance?",
    options: [
      "Seoul Arts Center",
      "Tokyo Dance Institute",
      "Beijing Dance Academy",
      "Royal Ballet School"
    ],
    correctAnswer: 2,
    category: "members",
    explanation: "Ryx studied dance at the Beijing Dance Academy for 4 years.",
    difficulty: "medium"
  },
  {
    id: "cortis-q16",
    question: "What does Zion collect as decoration?",
    options: [
      "Vintage posters",
      "Antique circuit boards",
      "Neon signs",
      "Vinyl records"
    ],
    correctAnswer: 1,
    category: "members",
    explanation: "Zion collects antique circuit boards as unique decorative pieces.",
    difficulty: "hard"
  },
  {
    id: "cortis-q17",
    question: "Which Cortis album is described as a full sci-fi concept album?",
    options: ["CORTEX RISING", "ZERO DAY", "SYSTEM ERROR", "DEEP CODE"],
    correctAnswer: 2,
    category: "songs",
    explanation: "'SYSTEM ERROR' is Cortis's first full-length album, exploring digital consciousness.",
    difficulty: "medium"
  },
  {
    id: "cortis-q18",
    question: "Cortis is signed to which agency?",
    options: [
      "SM Entertainment",
      "HYBE",
      "NOVA Entertainment",
      "JYP Entertainment"
    ],
    correctAnswer: 2,
    category: "history",
    explanation: "Cortis is signed to NOVA Entertainment, a boutique agency known for bold concepts.",
    difficulty: "medium"
  },
  {
    id: "cortis-q19",
    question: "What board game is Ryx competitive at?",
    options: ["Go", "Checkers", "Chess", "Shogi"],
    correctAnswer: 2,
    category: "members",
    explanation: "Ryx is a competitive chess player, combining analytical thinking with artistic performance.",
    difficulty: "hard"
  },
  {
    id: "cortis-q20",
    question: "Which sport did Kael practice before performing arts?",
    options: ["Football", "Basketball", "Swimming", "Taekwondo"],
    correctAnswer: 2,
    category: "members",
    explanation: "Kael was a competitive swimmer before transitioning to performance arts.",
    difficulty: "medium"
  },
  {
    id: "cortis-q21",
    question: "Sol's rap verse appears on which Cortis debut EP?",
    options: ["ZERO DAY", "CORTEX RISING", "SYSTEM ERROR", "DEEP CODE"],
    correctAnswer: 1,
    category: "songs",
    explanation: "Sol debuted rapping on 'CORTEX RISING', the group's debut mini-album.",
    difficulty: "easy"
  },
  {
    id: "cortis-q22",
    question: "What color is associated with Cortis in BLOOM?",
    options: ["Pink", "Purple", "Teal/Cyan", "Gold"],
    correctAnswer: 2,
    category: "general",
    explanation: "Cortis is represented by teal/cyan tones reflecting their tech and futuristic concept.",
    difficulty: "easy"
  },
  {
    id: "cortis-q23",
    question: "Which Cortis song launched a viral dance challenge?",
    options: ["Override", "Glitch Protocol", "Electric Pulse", "Neon Matrix"],
    correctAnswer: 1,
    category: "songs",
    explanation: "Kael created a viral dance challenge based on the 'Glitch Protocol' choreography.",
    difficulty: "medium"
  },
  {
    id: "cortis-q24",
    question: "Ten's stage name was chosen because?",
    options: [
      "He's the 10th trainee signed",
      "He always gives 10 out of 10",
      "His birthday is on the 10th",
      "He has 10 talents"
    ],
    correctAnswer: 1,
    category: "members",
    explanation: "Ten's stage name was chosen because he always gives 100% — 10 out of 10.",
    difficulty: "medium"
  },
  {
    id: "cortis-q25",
    question: "How many languages does Ryx speak?",
    options: ["Two", "Three", "Four", "Five"],
    correctAnswer: 1,
    category: "members",
    explanation: "Ryx speaks three languages fluently: Mandarin, Korean, and English.",
    difficulty: "medium"
  },
  {
    id: "cortis-q26",
    question: "What does Ten enjoy posting in Cortis's fan community?",
    options: [
      "Fashion tips",
      "Recipe videos",
      "Dance tutorials",
      "Travel diaries"
    ],
    correctAnswer: 1,
    category: "members",
    explanation: "Ten loves cooking and regularly posts recipe videos to the Cortex fan community.",
    difficulty: "hard"
  },
  {
    id: "cortis-q27",
    question: "Nova's stage name references what concept?",
    options: [
      "Supernova star explosion",
      "A new beginning",
      "North star",
      "Neon light"
    ],
    correctAnswer: 0,
    category: "members",
    explanation: "Nova refers to a stellar explosion — symbolizing brilliance and transformation.",
    difficulty: "hard"
  },
  {
    id: "cortis-q28",
    question: "What Cortis B-side features Kael on bass?",
    options: ["Frequency", "Binary Heart", "Static Emotion", "Pixel Love"],
    correctAnswer: 1,
    category: "songs",
    explanation: "Kael plays bass guitar on 'Binary Heart', a fan-favorite Cortis B-side.",
    difficulty: "hard"
  },
  {
    id: "cortis-q29",
    question: "Zion's stage name references what?",
    options: [
      "Mountain peak",
      "Utopian digital city",
      "Mythological figure",
      "Stars"
    ],
    correctAnswer: 1,
    category: "members",
    explanation: "Zion's name references the concept of a utopian digital city from cyberpunk lore.",
    difficulty: "medium"
  },
  {
    id: "cortis-q30",
    question: "How many songs are on Cortis's 'SYSTEM ERROR' album?",
    options: ["6", "7", "8", "9"],
    correctAnswer: 2,
    category: "songs",
    explanation: "'SYSTEM ERROR' contains 8 tracks including a bonus song 'Frequency'.",
    difficulty: "medium"
  }
];
const cortisFunFacts = [
  {
    id: "cortis-f1",
    text: "Cortis's debut MV for 'Digital Ghost' was shot over 5 days with a fully custom-built cyberpunk set.",
    category: "history",
    emoji: "🎬"
  },
  {
    id: "cortis-f2",
    text: "Ryx choreographed the 'Glitch Protocol' dance break in just 48 hours.",
    category: "member",
    emoji: "💃",
    memberName: "Ryx"
  },
  {
    id: "cortis-f3",
    text: "Nova experiences music as colors due to synesthesia — and uses this to inform Cortis's MV color palettes.",
    category: "member",
    emoji: "🎨",
    memberName: "Nova"
  },
  {
    id: "cortis-f4",
    text: "Zion holds a degree in electronic music production and produced 4 tracks on 'SYSTEM ERROR'.",
    category: "member",
    emoji: "🎹",
    memberName: "Zion"
  },
  {
    id: "cortis-f5",
    text: "'Glitch Protocol' charted in 24 countries, making Cortis one of the fastest-rising K-pop groups of 2023.",
    category: "achievement",
    emoji: "📈"
  },
  {
    id: "cortis-f6",
    text: "The group's concept was entirely developed before their first audition — Zion pitched it as a full universe.",
    category: "history",
    emoji: "🌐"
  },
  {
    id: "cortis-f7",
    text: "Cortis's lightstick is shaped like a circuit board and glows in teal — fans call it the 'Cortex chip'.",
    category: "fun",
    emoji: "💡"
  },
  {
    id: "cortis-f8",
    text: "Ten's recipe for 'Cortis kimchi-jjigae' went so viral that a Seoul restaurant put it on their menu.",
    category: "member",
    emoji: "🍲",
    memberName: "Ten"
  },
  {
    id: "cortis-f9",
    text: "The word 'Cortis' is derived from 'cortex' — the outer layer of the brain, symbolizing intelligence and creativity.",
    category: "history",
    emoji: "🧠"
  },
  {
    id: "cortis-f10",
    text: "Sol started writing rap lyrics at age 11 and filled 15 notebooks before debuting.",
    category: "member",
    emoji: "✍️",
    memberName: "Sol"
  },
  {
    id: "cortis-f11",
    text: "Kael's bass guitar line on 'Binary Heart' has been praised by professional musicians online.",
    category: "member",
    emoji: "🎸",
    memberName: "Kael"
  },
  {
    id: "cortis-f12",
    text: "'SYSTEM ERROR' broke the record for most streamed K-pop debut album from a new label.",
    category: "achievement",
    emoji: "🏆"
  },
  {
    id: "cortis-f13",
    text: "Cortis performed with holographic avatars at their debut showcase — a first in K-pop.",
    category: "achievement",
    emoji: "👾"
  },
  {
    id: "cortis-f14",
    text: "Ryx competed in an international chess tournament and reached the quarterfinals.",
    category: "member",
    emoji: "♟️",
    memberName: "Ryx"
  },
  {
    id: "cortis-f15",
    text: "Cortex fans coordinate global streaming parties using a custom app built by a fan developer.",
    category: "fun",
    emoji: "📱"
  },
  {
    id: "cortis-f16",
    text: "Cortis collaborated with a tech company to create an AR experience that launched alongside 'ZERO DAY'.",
    category: "achievement",
    emoji: "🥽"
  },
  {
    id: "cortis-f17",
    text: "The group's official colors — teal and black — were chosen to represent technology meeting darkness.",
    category: "history",
    emoji: "🌊"
  },
  {
    id: "cortis-f18",
    text: "Nova's vocal warm-up routine takes 45 minutes and includes humming classical pieces.",
    category: "member",
    emoji: "🎵",
    memberName: "Nova"
  },
  {
    id: "cortis-f19",
    text: "'Electric Pulse' was used as the theme song for a major esports tournament in 2024.",
    category: "achievement",
    emoji: "🎮"
  },
  {
    id: "cortis-f20",
    text: "All 6 members have spoken at tech conferences about the intersection of music and technology.",
    category: "achievement",
    emoji: "💬"
  },
  {
    id: "cortis-f21",
    text: "Zion's antique circuit board collection includes pieces dating back to the 1970s.",
    category: "member",
    emoji: "🔌",
    memberName: "Zion"
  },
  {
    id: "cortis-f22",
    text: "Cortis has a 'no spoilers' pact — members never reveal upcoming concepts to each other until shoot day.",
    category: "fun",
    emoji: "🤐"
  }
];
const illitMembers = [
  {
    id: "yunah",
    name: "Yunah",
    role: ["Main Vocalist", "Center"],
    birthday: "2004-01-28",
    birthYear: 2004,
    nationality: "Korean",
    position: "Main Vocalist",
    bio: "Kim Yu-na, known as Yunah, is the main vocalist of ILLIT. With her ethereal voice and captivating stage presence, she quickly became one of ILLIT's standout performers.",
    funFacts: [
      "Was a YG trainee before joining ADOR",
      "Her debut showcase stage garnered viral attention for her emotional delivery",
      "Loves collecting vintage clothing",
      "Speaks three languages: Korean, English, and basic Japanese"
    ]
  },
  {
    id: "minju",
    name: "Minju",
    role: ["Lead Vocalist", "Rapper"],
    birthday: "2004-05-07",
    birthYear: 2004,
    nationality: "Korean",
    position: "Lead Vocalist",
    bio: "Kim Min-ju brings both vocal power and rap charisma to ILLIT. Known for her bright personality off-stage and fierce transformation when performing.",
    funFacts: [
      "Trained for 3 years before debuting",
      "Named her pet rabbit 'Bubble'",
      "Has a passion for oil painting",
      "Her favorite genre to listen to is indie pop"
    ]
  },
  {
    id: "moka",
    name: "Moka",
    role: ["Main Dancer", "Vocalist"],
    birthday: "2004-12-10",
    birthYear: 2004,
    nationality: "Japanese",
    position: "Main Dancer",
    bio: "Moka is ILLIT's main dancer, known for her precise and expressive choreography. She moved from Japan to Korea to pursue her K-pop dream.",
    funFacts: [
      "Started dance training at age 7",
      "Can solve a Rubik's cube in under 2 minutes",
      "Loves matcha everything — lattes, cakes, ice cream",
      "Was scouted at a dance competition in Osaka"
    ]
  },
  {
    id: "wonhee",
    name: "Wonhee",
    role: ["Lead Dancer", "Vocalist", "Visual"],
    birthday: "2005-08-15",
    birthYear: 2005,
    nationality: "Korean",
    position: "Visual",
    bio: "Wonhee's visual impact is undeniable — effortlessly ethereal, she also brings strong dancing and vocal skills making her a true all-rounder.",
    funFacts: [
      "Was a child model before becoming a trainee",
      "Her smile has been called 'healing' by Korean media",
      "Practices yoga every morning",
      "Owns over 50 plush toys"
    ]
  },
  {
    id: "iroha",
    name: "Iroha",
    role: ["Lead Vocalist", "Lead Dancer"],
    birthday: "2006-02-27",
    birthYear: 2006,
    nationality: "Japanese",
    position: "Lead Vocalist",
    bio: "The youngest member from Japan, Iroha's pure vocal tone and graceful stage presence bring a unique energy to ILLIT's performances.",
    funFacts: [
      "Youngest member of ILLIT",
      "Was accepted to a prestigious arts high school but chose to debut instead",
      "Plays classical piano",
      "Her favorite color is lilac"
    ]
  }
];
const illitSongs = [
  {
    id: "magnetic",
    title: "Magnetic",
    album: "SUPER REAL ME",
    releaseYear: 2024,
    streams: 412e6,
    youtubeViews: 285e6,
    itunesRank: 2,
    appleMusicRank: 3,
    weeklyTrend: [42, 38, 41, 45, 44, 47, 50],
    isTitle: true
  },
  {
    id: "lucky-girl-syndrome",
    title: "Lucky Girl Syndrome",
    album: "SUPER REAL ME",
    releaseYear: 2024,
    streams: 198e6,
    youtubeViews: 12e7,
    itunesRank: 8,
    appleMusicRank: 7,
    weeklyTrend: [20, 22, 19, 24, 21, 23, 25],
    isTitle: false
  },
  {
    id: "tick-tack",
    title: "Tick-Tack",
    album: "SUPER REAL ME",
    releaseYear: 2024,
    streams: 156e6,
    youtubeViews: 95e6,
    itunesRank: 12,
    appleMusicRank: 10,
    weeklyTrend: [15, 16, 18, 15, 17, 19, 20],
    isTitle: false
  },
  {
    id: "one-kiss",
    title: "One Kiss",
    album: "SUPER REAL ME",
    releaseYear: 2024,
    streams: 132e6,
    youtubeViews: 78e6,
    itunesRank: 15,
    appleMusicRank: 14,
    weeklyTrend: [13, 14, 12, 15, 16, 14, 17],
    isTitle: false
  },
  {
    id: "i-ll-be-there",
    title: "I'll Be There",
    album: "SUPER REAL ME",
    releaseYear: 2024,
    streams: 11e7,
    youtubeViews: 62e6,
    itunesRank: 18,
    appleMusicRank: 19,
    weeklyTrend: [11, 12, 10, 13, 11, 14, 12],
    isTitle: false
  },
  {
    id: "midnight-mirage",
    title: "Midnight Mirage",
    album: "Miss Chik!t",
    releaseYear: 2024,
    streams: 89e6,
    youtubeViews: 55e6,
    itunesRank: 22,
    appleMusicRank: 20,
    weeklyTrend: [9, 10, 8, 11, 9, 10, 12],
    isTitle: false
  },
  {
    id: "rabbit-heart",
    title: "Rabbit Heart",
    album: "Miss Chik!t",
    releaseYear: 2024,
    streams: 76e6,
    youtubeViews: 45e6,
    itunesRank: 25,
    appleMusicRank: 24,
    weeklyTrend: [7, 8, 9, 7, 10, 8, 9],
    isTitle: false
  },
  {
    id: "sparkling-day",
    title: "Sparkling Day",
    album: "Miss Chik!t",
    releaseYear: 2024,
    streams: 68e6,
    youtubeViews: 4e7,
    itunesRank: 28,
    appleMusicRank: 27,
    weeklyTrend: [7, 6, 8, 7, 6, 8, 7],
    isTitle: false
  },
  {
    id: "chik-chika",
    title: "Chik Chika",
    album: "Miss Chik!t",
    releaseYear: 2024,
    streams: 62e6,
    youtubeViews: 38e6,
    itunesRank: 31,
    appleMusicRank: 30,
    weeklyTrend: [6, 7, 6, 8, 6, 7, 8],
    isTitle: true
  },
  {
    id: "eternity",
    title: "Eternity",
    album: "Miss Chik!t",
    releaseYear: 2024,
    streams: 57e6,
    youtubeViews: 33e6,
    itunesRank: 35,
    appleMusicRank: 33,
    weeklyTrend: [5, 6, 6, 5, 7, 6, 7],
    isTitle: false
  },
  {
    id: "super-real",
    title: "Super Real",
    album: "SUPER REAL ME",
    releaseYear: 2024,
    streams: 52e6,
    youtubeViews: 3e7,
    itunesRank: 38,
    appleMusicRank: 36,
    weeklyTrend: [5, 5, 6, 4, 5, 6, 5],
    isTitle: false
  },
  {
    id: "bloom-bloom",
    title: "Bloom Bloom",
    album: "Miss Chik!t",
    releaseYear: 2024,
    streams: 48e6,
    youtubeViews: 28e6,
    itunesRank: null,
    appleMusicRank: 40,
    weeklyTrend: [4, 5, 4, 5, 5, 4, 5],
    isTitle: false
  },
  {
    id: "daydream",
    title: "Daydream",
    album: "SUPER REAL ME",
    releaseYear: 2024,
    streams: 44e6,
    youtubeViews: 25e6,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [4, 4, 5, 4, 4, 5, 4],
    isTitle: false
  },
  {
    id: "pink-energy",
    title: "Pink Energy",
    album: "Miss Chik!t",
    releaseYear: 2024,
    streams: 4e7,
    youtubeViews: 22e6,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [3, 4, 4, 3, 4, 4, 4],
    isTitle: false
  },
  {
    id: "star-in-my-eye",
    title: "Star in My Eye",
    album: "SUPER REAL ME",
    releaseYear: 2024,
    streams: 37e6,
    youtubeViews: 2e7,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [3, 4, 3, 4, 3, 3, 4],
    isTitle: false
  },
  {
    id: "confetti",
    title: "Confetti",
    album: "Miss Chik!t",
    releaseYear: 2024,
    streams: 34e6,
    youtubeViews: 18e6,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [3, 3, 4, 3, 3, 4, 3],
    isTitle: false
  },
  {
    id: "sweet-chaos",
    title: "Sweet Chaos",
    album: "SUPER REAL ME",
    releaseYear: 2024,
    streams: 31e6,
    youtubeViews: 16e6,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [3, 3, 3, 3, 3, 3, 4],
    isTitle: false
  },
  {
    id: "glow-up",
    title: "Glow Up",
    album: "Miss Chik!t",
    releaseYear: 2024,
    streams: 28e6,
    youtubeViews: 14e6,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [2, 3, 3, 2, 3, 3, 3],
    isTitle: false
  },
  {
    id: "cotton-candy",
    title: "Cotton Candy",
    album: "SUPER REAL ME",
    releaseYear: 2024,
    streams: 25e6,
    youtubeViews: 12e6,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [2, 2, 3, 2, 2, 3, 2],
    isTitle: false
  },
  {
    id: "forever-young",
    title: "Forever Young",
    album: "Miss Chik!t",
    releaseYear: 2024,
    streams: 22e6,
    youtubeViews: 11e6,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [2, 2, 2, 2, 2, 2, 3],
    isTitle: false
  }
];
const illitDiscography = [
  {
    id: "super-real-me",
    title: "SUPER REAL ME",
    type: "mini-album",
    releaseDate: "2024-03-25",
    tracks: [
      "Magnetic",
      "Lucky Girl Syndrome",
      "Tick-Tack",
      "One Kiss",
      "I'll Be There",
      "Super Real",
      "Daydream",
      "Star in My Eye",
      "Cotton Candy",
      "Sweet Chaos"
    ],
    coverColor: "oklch(0.7 0.15 350)",
    description: "Debut mini-album featuring the global hit 'Magnetic' — the song that introduced ILLIT to the world."
  },
  {
    id: "miss-chikit",
    title: "Miss Chik!t",
    type: "mini-album",
    releaseDate: "2024-08-14",
    tracks: [
      "Chik Chika",
      "Midnight Mirage",
      "Rabbit Heart",
      "Sparkling Day",
      "Eternity",
      "Bloom Bloom",
      "Pink Energy",
      "Confetti",
      "Glow Up",
      "Forever Young"
    ],
    coverColor: "oklch(0.65 0.18 340)",
    description: "Second mini-album showcasing ILLIT's range with a playful yet polished aesthetic."
  }
];
const illitTriviaQuestions = [
  {
    id: "illit-q1",
    question: "Which ILLIT song became a viral hit on TikTok and reached global charts?",
    options: ["Lucky Girl Syndrome", "Magnetic", "Tick-Tack", "One Kiss"],
    correctAnswer: 1,
    category: "songs",
    explanation: "'Magnetic' was ILLIT's debut title track that went viral worldwide.",
    difficulty: "easy"
  },
  {
    id: "illit-q2",
    question: "How many members does ILLIT have?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 1,
    category: "members",
    explanation: "ILLIT consists of 5 members: Yunah, Minju, Moka, Wonhee, and Iroha.",
    difficulty: "easy"
  },
  {
    id: "illit-q3",
    question: "Which label under HYBE did ILLIT debut under?",
    options: ["Big Hit Music", "Source Music", "ADOR", "Belift Lab"],
    correctAnswer: 2,
    category: "history",
    explanation: "ILLIT debuted under ADOR, a sub-label of HYBE established for new artist development.",
    difficulty: "medium"
  },
  {
    id: "illit-q4",
    question: "In what year did ILLIT make their debut?",
    options: ["2022", "2023", "2024", "2025"],
    correctAnswer: 2,
    category: "history",
    explanation: "ILLIT officially debuted on March 25, 2024.",
    difficulty: "easy"
  },
  {
    id: "illit-q5",
    question: "Which ILLIT member is from Japan and is the youngest?",
    options: ["Moka", "Iroha", "Yunah", "Wonhee"],
    correctAnswer: 1,
    category: "members",
    explanation: "Iroha (born 2006) is the youngest member and is from Japan.",
    difficulty: "medium"
  },
  {
    id: "illit-q6",
    question: "What is ILLIT's fandom name?",
    options: ["Melody", "Llit", "Bloom", "Starlight"],
    correctAnswer: 1,
    category: "general",
    explanation: "ILLIT's fandom is officially named 'Llit'.",
    difficulty: "medium"
  },
  {
    id: "illit-q7",
    question: "Which ILLIT member is the main dancer known for precision choreography?",
    options: ["Yunah", "Minju", "Moka", "Iroha"],
    correctAnswer: 2,
    category: "members",
    explanation: "Moka is ILLIT's main dancer who started training at age 7.",
    difficulty: "medium"
  },
  {
    id: "illit-q8",
    question: "What type of release was 'SUPER REAL ME'?",
    options: ["Full Album", "Single", "Mini-album", "EP"],
    correctAnswer: 2,
    category: "songs",
    explanation: "'SUPER REAL ME' was ILLIT's debut mini-album released in March 2024.",
    difficulty: "easy"
  },
  {
    id: "illit-q9",
    question: "Which member was previously a YG trainee before joining ADOR?",
    options: ["Minju", "Wonhee", "Yunah", "Iroha"],
    correctAnswer: 2,
    category: "members",
    explanation: "Yunah trained under YG Entertainment before becoming an ADOR trainee.",
    difficulty: "hard"
  },
  {
    id: "illit-q10",
    question: "What is Wonhee's primary position in ILLIT?",
    options: ["Main Vocalist", "Main Dancer", "Visual", "Main Rapper"],
    correctAnswer: 2,
    category: "members",
    explanation: "Wonhee is the Visual of ILLIT, recognized for her ethereal beauty.",
    difficulty: "medium"
  },
  {
    id: "illit-q11",
    question: "ILLIT's debut album 'SUPER REAL ME' was released on which date?",
    options: [
      "January 15, 2024",
      "March 25, 2024",
      "June 10, 2024",
      "August 14, 2024"
    ],
    correctAnswer: 1,
    category: "history",
    explanation: "ILLIT's debut mini-album 'SUPER REAL ME' was released on March 25, 2024.",
    difficulty: "hard"
  },
  {
    id: "illit-q12",
    question: "How many streams did 'Magnetic' accumulate according to BLOOM's data?",
    options: ["200M", "300M", "412M", "500M"],
    correctAnswer: 2,
    category: "songs",
    explanation: "'Magnetic' became a massive global hit amassing over 412 million streams.",
    difficulty: "medium"
  },
  {
    id: "illit-q13",
    question: "Which ILLIT member speaks Korean, English, and Japanese?",
    options: ["Minju", "Moka", "Iroha", "Yunah"],
    correctAnswer: 3,
    category: "members",
    explanation: "Yunah is noted for speaking three languages: Korean, English, and basic Japanese.",
    difficulty: "hard"
  },
  {
    id: "illit-q14",
    question: "What is Moka's nationality?",
    options: ["Korean", "Chinese", "Japanese", "American"],
    correctAnswer: 2,
    category: "members",
    explanation: "Moka is Japanese and moved to Korea to pursue her K-pop career.",
    difficulty: "easy"
  },
  {
    id: "illit-q15",
    question: "Which album contains ILLIT's song 'Chik Chika'?",
    options: ["SUPER REAL ME", "Miss Chik!t", "Lucky Star", "Bloom"],
    correctAnswer: 1,
    category: "songs",
    explanation: "'Chik Chika' is the title track of ILLIT's second mini-album 'Miss Chik!t'.",
    difficulty: "medium"
  },
  {
    id: "illit-q16",
    question: "Minju's pet is named what?",
    options: ["Fluffy", "Cookie", "Bubble", "Mochi"],
    correctAnswer: 2,
    category: "members",
    explanation: "Minju named her pet rabbit 'Bubble'.",
    difficulty: "hard"
  },
  {
    id: "illit-q17",
    question: "Which ILLIT song features a dreamy, wistful sound?",
    options: ["Magnetic", "Daydream", "Tick-Tack", "Glow Up"],
    correctAnswer: 1,
    category: "songs",
    explanation: "'Daydream' is known for its soft, ethereal soundscape within the 'SUPER REAL ME' album.",
    difficulty: "medium"
  },
  {
    id: "illit-q18",
    question: "Moka was scouted at a competition in which city?",
    options: ["Tokyo", "Seoul", "Osaka", "Kyoto"],
    correctAnswer: 2,
    category: "members",
    explanation: "Moka was discovered at a dance competition held in Osaka.",
    difficulty: "hard"
  },
  {
    id: "illit-q19",
    question: "What instrument does Iroha play?",
    options: ["Guitar", "Violin", "Piano", "Flute"],
    correctAnswer: 2,
    category: "members",
    explanation: "Iroha plays classical piano, having trained in music from a young age.",
    difficulty: "medium"
  },
  {
    id: "illit-q20",
    question: "How many songs are on ILLIT's debut mini-album 'SUPER REAL ME'?",
    options: ["6", "8", "10", "12"],
    correctAnswer: 2,
    category: "songs",
    explanation: "'SUPER REAL ME' contains 10 tracks including the hit 'Magnetic'.",
    difficulty: "medium"
  },
  {
    id: "illit-q21",
    question: "Which ILLIT member is known for practicing yoga every morning?",
    options: ["Moka", "Yunah", "Iroha", "Wonhee"],
    correctAnswer: 3,
    category: "members",
    explanation: "Wonhee practices yoga every morning as part of her wellness routine.",
    difficulty: "hard"
  },
  {
    id: "illit-q22",
    question: "What type of art does Minju practice as a hobby?",
    options: ["Watercolor", "Oil Painting", "Sculpture", "Photography"],
    correctAnswer: 1,
    category: "members",
    explanation: "Minju has a passion for oil painting.",
    difficulty: "hard"
  },
  {
    id: "illit-q23",
    question: "What is the color associated with ILLIT in the BLOOM app?",
    options: ["Teal", "Purple", "Pink/Pastel", "Gold"],
    correctAnswer: 2,
    category: "general",
    explanation: "ILLIT is represented by pink/pastel tones reflecting their bubbly, youthful image.",
    difficulty: "easy"
  },
  {
    id: "illit-q24",
    question: "Which ILLIT song has the second-highest stream count?",
    options: ["Tick-Tack", "Lucky Girl Syndrome", "One Kiss", "I'll Be There"],
    correctAnswer: 1,
    category: "songs",
    explanation: "'Lucky Girl Syndrome' has approximately 198M streams, making it the second most streamed.",
    difficulty: "medium"
  },
  {
    id: "illit-q25",
    question: "What concept was ILLIT's debut linked to?",
    options: [
      "Dark and fierce",
      "Cute and bubbly with powerful performance",
      "Retro 80s style",
      "Futuristic sci-fi"
    ],
    correctAnswer: 1,
    category: "general",
    explanation: "ILLIT debuted with a fresh, bubbly concept blending cute charm with powerful performance.",
    difficulty: "easy"
  },
  {
    id: "illit-q26",
    question: "Iroha's favorite color is?",
    options: ["Pink", "Sky blue", "Lilac", "Mint green"],
    correctAnswer: 2,
    category: "members",
    explanation: "Iroha's favorite color is lilac.",
    difficulty: "hard"
  },
  {
    id: "illit-q27",
    question: "Which ILLIT member owns over 50 plush toys?",
    options: ["Yunah", "Minju", "Moka", "Wonhee"],
    correctAnswer: 3,
    category: "members",
    explanation: "Wonhee is known for her love of plush toys, owning over 50.",
    difficulty: "hard"
  },
  {
    id: "illit-q28",
    question: "What does Yunah enjoy collecting?",
    options: ["Sneakers", "Vintage clothing", "Books", "Albums"],
    correctAnswer: 1,
    category: "members",
    explanation: "Yunah loves collecting vintage clothing.",
    difficulty: "medium"
  },
  {
    id: "illit-q29",
    question: "How long did Moka train in dance before joining ADOR?",
    options: ["Since age 5", "Since age 7", "Since age 10", "Since age 12"],
    correctAnswer: 1,
    category: "members",
    explanation: "Moka started dance training at age 7, giving her years of professional preparation.",
    difficulty: "medium"
  },
  {
    id: "illit-q30",
    question: "What is Minju's favorite music genre to listen to?",
    options: ["R&B", "Hip hop", "Indie pop", "Classical"],
    correctAnswer: 2,
    category: "members",
    explanation: "Minju prefers listening to indie pop in her free time.",
    difficulty: "hard"
  }
];
const illitFunFacts = [
  {
    id: "illit-f1",
    text: "ILLIT's debut song 'Magnetic' charted in over 30 countries simultaneously.",
    category: "achievement",
    emoji: "🌍"
  },
  {
    id: "illit-f2",
    text: "The name 'ILLIT' is a combination of 'I' (identity) and 'lit' (brilliant/bright).",
    category: "history",
    emoji: "💡"
  },
  {
    id: "illit-f3",
    text: "Moka can solve a Rubik's cube in under 2 minutes.",
    category: "member",
    emoji: "🎲",
    memberName: "Moka"
  },
  {
    id: "illit-f4",
    text: "Yunah trained under YG Entertainment before making the switch to ADOR.",
    category: "member",
    emoji: "🎤",
    memberName: "Yunah"
  },
  {
    id: "illit-f5",
    text: "Both Moka and Iroha are Japanese, giving ILLIT a strong international fanbase in Japan.",
    category: "fun",
    emoji: "🇯🇵"
  },
  {
    id: "illit-f6",
    text: "'Magnetic' became one of the fastest K-pop debut songs to reach 400M streams.",
    category: "achievement",
    emoji: "⚡"
  },
  {
    id: "illit-f7",
    text: "ILLIT's choreography for 'Magnetic' was choreographed in collaboration with K-pop's top dance crews.",
    category: "music",
    emoji: "💃"
  },
  {
    id: "illit-f8",
    text: "Wonhee was a child model before becoming a K-pop trainee.",
    category: "member",
    emoji: "📸",
    memberName: "Wonhee"
  },
  {
    id: "illit-f9",
    text: "The group completed over 200 hours of performance training before their debut showcase.",
    category: "history",
    emoji: "🏆"
  },
  {
    id: "illit-f10",
    text: "Iroha plays classical piano and was accepted to a prestigious arts high school.",
    category: "member",
    emoji: "🎹",
    memberName: "Iroha"
  },
  {
    id: "illit-f11",
    text: "'SUPER REAL ME' debuted at #1 on South Korea's Gaon chart.",
    category: "achievement",
    emoji: "🥇"
  },
  {
    id: "illit-f12",
    text: "ILLIT's fan club name 'Llit' was chosen through a global fan vote.",
    category: "history",
    emoji: "❤️"
  },
  {
    id: "illit-f13",
    text: "Minju's oil paintings were showcased in ILLIT's official fan magazine.",
    category: "member",
    emoji: "🎨",
    memberName: "Minju"
  },
  {
    id: "illit-f14",
    text: "'Lucky Girl Syndrome' was inspired by a viral social media trend of the same name.",
    category: "music",
    emoji: "🍀"
  },
  {
    id: "illit-f15",
    text: "All 5 members participated in writing the lyrics for at least one track on 'Miss Chik!t'.",
    category: "music",
    emoji: "✍️"
  },
  {
    id: "illit-f16",
    text: "ILLIT's debut was the most-watched K-pop debut livestream of 2024.",
    category: "achievement",
    emoji: "📺"
  },
  {
    id: "illit-f17",
    text: "Wonhee practices yoga every morning and has been doing so since age 13.",
    category: "member",
    emoji: "🧘",
    memberName: "Wonhee"
  },
  {
    id: "illit-f18",
    text: "ILLIT performed at the 2024 MAMA Awards just 9 months after debuting.",
    category: "achievement",
    emoji: "🎊"
  },
  {
    id: "illit-f19",
    text: "The ILLIT dorm has a 'no phones at mealtimes' rule — the members came up with it themselves.",
    category: "fun",
    emoji: "📵"
  },
  {
    id: "illit-f20",
    text: "Yunah's stage name references the Korean word 'yuna' meaning 'gentle and graceful'.",
    category: "member",
    emoji: "🌸",
    memberName: "Yunah"
  },
  {
    id: "illit-f21",
    text: "'Magnetic' hit #1 trending on YouTube in 18 countries within 24 hours of release.",
    category: "achievement",
    emoji: "🎬"
  },
  {
    id: "illit-f22",
    text: "ILLIT are known for doing cute fan signs lasting up to 4 hours — no member ever skips signing.",
    category: "fun",
    emoji: "✍️"
  }
];
const lesserafimMembers = [
  {
    id: "sakura",
    name: "Sakura",
    role: ["Vocalist", "Visual"],
    birthday: "1998-03-19",
    birthYear: 1998,
    nationality: "Japanese",
    position: "Vocalist / Visual",
    bio: "Miyawaki Sakura is a veteran K-pop idol who gained fame with IZ*ONE and AKB48 before joining LE SSERAFIM. Her decade of experience shows in every assured performance.",
    funFacts: [
      "Competed in AKB48 Senbatsu elections for over 7 years",
      "Was a top-ranked IZ*ONE member during their 2018-2021 run",
      "Has over 5 million Instagram followers from her solo fanbase",
      "Stated LE SSERAFIM was her dream group concept from day one"
    ]
  },
  {
    id: "chaewon",
    name: "Chaewon",
    role: ["Leader", "Main Vocalist"],
    birthday: "2000-08-08",
    birthYear: 2e3,
    nationality: "Korean",
    position: "Leader / Main Vocalist",
    bio: "Kim Chaewon, known for leading with calm confidence, was also an IZ*ONE member. She stepped into the leader role for LE SSERAFIM with grace and has grown exponentially as a performer.",
    funFacts: [
      "Was one of the final IZ*ONE members selected in Produce 48",
      "She has written lyrics for several LE SSERAFIM b-sides",
      "Known among members for being the best at Korean trivia games",
      "Her birthday, 8/8, is nicknamed 'Chaewon Day' by FEARNOT"
    ]
  },
  {
    id: "yunjin",
    name: "Yunjin",
    role: ["Main Vocalist", "Rapper"],
    birthday: "2001-10-08",
    birthYear: 2001,
    nationality: "Korean-American",
    position: "Main Vocalist",
    bio: "Huh Yun-jin grew up in New York and brings a distinct American pop sensibility to LE SSERAFIM. A powerful vocalist with a sharp pen — she wrote 'Sour Grapes' at age 20.",
    funFacts: [
      "Grew up in New York City and is fluent in English",
      "Self-produced and wrote 'Sour Grapes' which became fan-favorite",
      "Was in the Broadway production of 'Spring Awakening' as a student",
      "Her stage outfits are regularly featured in global fashion blogs"
    ]
  },
  {
    id: "kazuha",
    name: "Kazuha",
    role: ["Vocalist", "Lead Dancer"],
    birthday: "2003-08-09",
    birthYear: 2003,
    nationality: "Japanese",
    position: "Lead Dancer / Vocalist",
    bio: "Nakamura Kazuha brings a classical elegance to LE SSERAFIM — a trained ballet dancer whose grace redefines K-pop movement. Her ethereal visuals and stage presence are unmatched.",
    funFacts: [
      "Trained as a classical ballet dancer from age 5",
      "Was accepted to the Dutch National Ballet Academy",
      "Her 'Fearless' ballet dance cover went viral with 40M views",
      "Speaks Japanese, Korean, and conversational English"
    ]
  },
  {
    id: "eunchae",
    name: "Eunchae",
    role: ["Vocalist", "Maknae"],
    birthday: "2006-11-10",
    birthYear: 2006,
    nationality: "Korean",
    position: "Vocalist / Maknae",
    bio: "Hong Eun-chae is the youngest and brightest energy in LE SSERAFIM. Despite being the maknae, her stage presence rivals seasoned performers, and her candid personality wins hearts everywhere.",
    funFacts: [
      "Is the youngest member at debut among all LE SSERAFIM members",
      "Became close friends with IVE's Leeseo due to being born the same year",
      "Her 'honestly, I'm scared but let's go' attitude during FEARLESS promotions became a viral moment",
      "Loves collecting limited-edition sneakers — owns over 40 pairs"
    ]
  }
];
const lesserafimSongs = [
  {
    id: "fearless",
    title: "FEARLESS",
    album: "FEARLESS",
    releaseYear: 2022,
    streams: 82e7,
    youtubeViews: 32e7,
    itunesRank: 1,
    appleMusicRank: 1,
    weeklyTrend: [84, 80, 86, 90, 82, 87, 92],
    isTitle: true
  },
  {
    id: "antifragile",
    title: "ANTIFRAGILE",
    album: "ANTIFRAGILE",
    releaseYear: 2022,
    streams: 75e7,
    youtubeViews: 29e7,
    itunesRank: 1,
    appleMusicRank: 1,
    weeklyTrend: [77, 73, 78, 82, 75, 80, 84],
    isTitle: true
  },
  {
    id: "unforgiven",
    title: "UNFORGIVEN (feat. Nile Rodgers)",
    album: "UNFORGIVEN",
    releaseYear: 2023,
    streams: 68e7,
    youtubeViews: 26e7,
    itunesRank: 2,
    appleMusicRank: 2,
    weeklyTrend: [70, 66, 71, 75, 68, 73, 77],
    isTitle: true
  },
  {
    id: "perfect-night",
    title: "PERFECT NIGHT",
    album: "EASY",
    releaseYear: 2023,
    streams: 61e7,
    youtubeViews: 23e7,
    itunesRank: 3,
    appleMusicRank: 3,
    weeklyTrend: [63, 59, 64, 68, 61, 66, 70],
    isTitle: true
  },
  {
    id: "easy",
    title: "EASY",
    album: "EASY",
    releaseYear: 2024,
    streams: 545e6,
    youtubeViews: 205e6,
    itunesRank: 2,
    appleMusicRank: 2,
    weeklyTrend: [56, 52, 57, 61, 54, 59, 63],
    isTitle: true
  },
  {
    id: "eve-psyche",
    title: "Eve, Psyche & The Bluebeard's wife",
    album: "ANTIFRAGILE",
    releaseYear: 2022,
    streams: 48e7,
    youtubeViews: 18e7,
    itunesRank: 4,
    appleMusicRank: 4,
    weeklyTrend: [49, 46, 50, 54, 47, 52, 56],
    isTitle: false
  },
  {
    id: "sour-grapes",
    title: "Sour Grapes",
    album: "UNFORGIVEN",
    releaseYear: 2023,
    streams: 395e6,
    youtubeViews: 145e6,
    itunesRank: 6,
    appleMusicRank: 6,
    weeklyTrend: [40, 37, 41, 45, 38, 43, 46],
    isTitle: false
  },
  {
    id: "impurities",
    title: "Impurities",
    album: "FEARLESS",
    releaseYear: 2022,
    streams: 345e6,
    youtubeViews: 12e7,
    itunesRank: 8,
    appleMusicRank: 8,
    weeklyTrend: [35, 33, 36, 39, 34, 37, 41],
    isTitle: false
  },
  {
    id: "no-celestial",
    title: "No Celestial",
    album: "UNFORGIVEN",
    releaseYear: 2023,
    streams: 31e7,
    youtubeViews: 108e6,
    itunesRank: 10,
    appleMusicRank: 9,
    weeklyTrend: [32, 29, 33, 36, 30, 34, 37],
    isTitle: false
  },
  {
    id: "smart",
    title: "SMART",
    album: "EASY",
    releaseYear: 2024,
    streams: 278e6,
    youtubeViews: 94e6,
    itunesRank: 12,
    appleMusicRank: 11,
    weeklyTrend: [28, 26, 29, 32, 27, 30, 33],
    isTitle: false
  },
  {
    id: "swan-song",
    title: "Swan Song",
    album: "ANTIFRAGILE",
    releaseYear: 2022,
    streams: 248e6,
    youtubeViews: 82e6,
    itunesRank: 14,
    appleMusicRank: 13,
    weeklyTrend: [25, 23, 26, 29, 24, 27, 30],
    isTitle: false
  },
  {
    id: "lightning",
    title: "Lightning",
    album: "EASY",
    releaseYear: 2024,
    streams: 222e6,
    youtubeViews: 72e6,
    itunesRank: 16,
    appleMusicRank: 15,
    weeklyTrend: [22, 20, 23, 26, 21, 24, 27],
    isTitle: false
  },
  {
    id: "blue-flame",
    title: "Blue Flame",
    album: "FEARLESS",
    releaseYear: 2022,
    streams: 198e6,
    youtubeViews: 64e6,
    itunesRank: 18,
    appleMusicRank: 17,
    weeklyTrend: [20, 18, 21, 23, 19, 21, 24],
    isTitle: false
  },
  {
    id: "burn-the-bridge",
    title: "Burn the Bridge",
    album: "UNFORGIVEN",
    releaseYear: 2023,
    streams: 176e6,
    youtubeViews: 58e6,
    itunesRank: 20,
    appleMusicRank: 19,
    weeklyTrend: [18, 16, 19, 21, 17, 19, 22],
    isTitle: false
  },
  {
    id: "we-got-so-much",
    title: "We Got So Much",
    album: "EASY",
    releaseYear: 2024,
    streams: 158e6,
    youtubeViews: 52e6,
    itunesRank: 22,
    appleMusicRank: 21,
    weeklyTrend: [16, 14, 17, 19, 15, 17, 20],
    isTitle: false
  },
  {
    id: "good-bones",
    title: "Good Bones",
    album: "ANTIFRAGILE",
    releaseYear: 2022,
    streams: 14e7,
    youtubeViews: 46e6,
    itunesRank: 25,
    appleMusicRank: 24,
    weeklyTrend: [14, 12, 15, 17, 13, 15, 18],
    isTitle: false
  },
  {
    id: "revving",
    title: "Revving",
    album: "FEARLESS",
    releaseYear: 2022,
    streams: 124e6,
    youtubeViews: 4e7,
    itunesRank: 28,
    appleMusicRank: 26,
    weeklyTrend: [12, 11, 13, 15, 11, 13, 16],
    isTitle: false
  },
  {
    id: "raise-your-glass",
    title: "Raise Your Glass",
    album: "EASY",
    releaseYear: 2024,
    streams: 11e7,
    youtubeViews: 35e6,
    itunesRank: 32,
    appleMusicRank: 30,
    weeklyTrend: [11, 9, 12, 13, 10, 12, 14],
    isTitle: false
  },
  {
    id: "the-hydrangea",
    title: "The Hydrangea",
    album: "UNFORGIVEN",
    releaseYear: 2023,
    streams: 96e6,
    youtubeViews: 3e7,
    itunesRank: null,
    appleMusicRank: 35,
    weeklyTrend: [9, 8, 10, 11, 9, 10, 12],
    isTitle: false
  },
  {
    id: "violets",
    title: "Violets",
    album: "FEARLESS",
    releaseYear: 2022,
    streams: 84e6,
    youtubeViews: 26e6,
    itunesRank: null,
    appleMusicRank: null,
    weeklyTrend: [8, 7, 9, 10, 8, 9, 10],
    isTitle: false
  }
];
const lesserafimDiscography = [
  {
    id: "fearless-ep",
    title: "FEARLESS",
    type: "ep",
    releaseDate: "2022-05-02",
    tracks: ["FEARLESS", "Impurities", "Blue Flame", "Revving", "Violets"],
    coverColor: "oklch(0.6 0.16 30)",
    description: "The debut EP that announced LE SSERAFIM to the world — unapologetic and powerful."
  },
  {
    id: "antifragile-ep",
    title: "ANTIFRAGILE",
    type: "mini-album",
    releaseDate: "2022-10-17",
    tracks: [
      "ANTIFRAGILE",
      "Eve, Psyche & The Bluebeard's wife",
      "Swan Song",
      "Good Bones",
      "Stellar"
    ],
    coverColor: "oklch(0.62 0.17 25)",
    description: "Their second release proving they were not a one-hit wonder. ANTIFRAGILE became a cultural phenomenon."
  },
  {
    id: "unforgiven-album",
    title: "UNFORGIVEN",
    type: "album",
    releaseDate: "2023-05-01",
    tracks: [
      "UNFORGIVEN (feat. Nile Rodgers)",
      "Eve, Psyche & The Bluebeard's wife",
      "Sour Grapes",
      "No Celestial",
      "Burn the Bridge",
      "The Hydrangea"
    ],
    coverColor: "oklch(0.64 0.18 20)",
    description: "First full album and a Grammy-consideration work — a statement of fearlessness."
  },
  {
    id: "easy-album",
    title: "EASY",
    type: "album",
    releaseDate: "2024-02-19",
    tracks: [
      "EASY",
      "SMART",
      "Perfect Night",
      "Lightning",
      "We Got So Much",
      "Raise Your Glass"
    ],
    coverColor: "oklch(0.66 0.16 15)",
    description: "Their most polished album — showcasing vocal maturity and chart domination."
  }
];
const lesserafimTriviaQuestions = [
  {
    id: "lsf-q1",
    question: "What is LE SSERAFIM's debut title track?",
    options: ["ANTIFRAGILE", "FEARLESS", "UNFORGIVEN", "EASY"],
    correctAnswer: 1,
    category: "songs",
    explanation: "LE SSERAFIM debuted in May 2022 with the title track 'FEARLESS'.",
    difficulty: "easy"
  },
  {
    id: "lsf-q2",
    question: "How many members are in LE SSERAFIM?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 1,
    category: "members",
    explanation: "LE SSERAFIM consists of 5 members: Sakura, Chaewon, Yunjin, Kazuha, and Eunchae.",
    difficulty: "easy"
  },
  {
    id: "lsf-q3",
    question: "What does 'LE SSERAFIM' anagram to?",
    options: ["I Am Fearless", "IM FEARLESS", "BE FEARLESS", "FEARLESS ME"],
    correctAnswer: 1,
    category: "general",
    explanation: "'LE SSERAFIM' is an anagram of 'IM FEARLESS' — their mantra and identity.",
    difficulty: "medium"
  },
  {
    id: "lsf-q4",
    question: "Which group were Sakura and Chaewon members of before LE SSERAFIM?",
    options: ["GFRIEND", "IZ*ONE", "LOONA", "Weki Meki"],
    correctAnswer: 1,
    category: "history",
    explanation: "Both Sakura and Chaewon were members of IZ*ONE (2018-2021) before joining LE SSERAFIM.",
    difficulty: "medium"
  },
  {
    id: "lsf-q5",
    question: "Kazuha trained in which discipline before K-pop?",
    options: ["Jazz dance", "Hip-hop", "Classical ballet", "Contemporary"],
    correctAnswer: 2,
    category: "members",
    explanation: "Kazuha trained as a classical ballet dancer from age 5 and was accepted to the Dutch National Ballet.",
    difficulty: "medium"
  },
  {
    id: "lsf-q6",
    question: "Which LE SSERAFIM song features Nile Rodgers?",
    options: ["FEARLESS", "ANTIFRAGILE", "UNFORGIVEN", "EASY"],
    correctAnswer: 2,
    category: "songs",
    explanation: "'UNFORGIVEN' features guitar by legendary Chic/Daft Punk collaborator Nile Rodgers.",
    difficulty: "medium"
  },
  {
    id: "lsf-q7",
    question: "Where did Yunjin grow up?",
    options: ["Seoul", "Los Angeles", "New York City", "London"],
    correctAnswer: 2,
    category: "members",
    explanation: "Yunjin grew up in New York City, which influences her American pop sensibility.",
    difficulty: "medium"
  },
  {
    id: "lsf-q8",
    question: "What is LE SSERAFIM's fandom called?",
    options: ["ARMY", "BLINK", "FEARNOT", "ONCE"],
    correctAnswer: 2,
    category: "general",
    explanation: "LE SSERAFIM's fandom is officially named 'FEARNOT'.",
    difficulty: "easy"
  },
  {
    id: "lsf-q9",
    question: "Who wrote the song 'Sour Grapes' on the UNFORGIVEN album?",
    options: ["Kazuha", "Sakura", "Chaewon", "Yunjin"],
    correctAnswer: 3,
    category: "songs",
    explanation: "Yunjin wrote 'Sour Grapes' herself — a fan-favorite that showcased her lyrical talent.",
    difficulty: "hard"
  },
  {
    id: "lsf-q10",
    question: "Kazuha's viral ballet cover reached how many views?",
    options: ["10M", "20M", "40M", "80M"],
    correctAnswer: 2,
    category: "members",
    explanation: "Kazuha's ballet cover of 'Fearless' went viral with approximately 40 million views.",
    difficulty: "hard"
  },
  {
    id: "lsf-q11",
    question: "What agency is LE SSERAFIM under?",
    options: [
      "ADOR",
      "Source Music (HYBE)",
      "SM Entertainment",
      "JYP Entertainment"
    ],
    correctAnswer: 1,
    category: "history",
    explanation: "LE SSERAFIM is signed to Source Music, a HYBE sub-label.",
    difficulty: "easy"
  },
  {
    id: "lsf-q12",
    question: "Which Coachella did LE SSERAFIM perform at?",
    options: ["2022", "2023", "2024", "2025"],
    correctAnswer: 2,
    category: "awards",
    explanation: "LE SSERAFIM made their historic Coachella debut in April 2024.",
    difficulty: "medium"
  },
  {
    id: "lsf-q13",
    question: "Eunchae became friends with which IVE member?",
    options: ["Wonyoung", "Rei", "Leeseo", "Gaeul"],
    correctAnswer: 2,
    category: "members",
    explanation: "Eunchae and IVE's Leeseo bonded over being born the same year.",
    difficulty: "hard"
  },
  {
    id: "lsf-q14",
    question: "How many pairs of sneakers does Eunchae own?",
    options: ["20+", "30+", "40+", "50+"],
    correctAnswer: 2,
    category: "members",
    explanation: "Eunchae is a sneakerhead who owns over 40 pairs of limited-edition sneakers.",
    difficulty: "hard"
  },
  {
    id: "lsf-q15",
    question: "Who is the leader of LE SSERAFIM?",
    options: ["Sakura", "Chaewon", "Yunjin", "Kazuha"],
    correctAnswer: 1,
    category: "members",
    explanation: "Kim Chaewon is the leader of LE SSERAFIM.",
    difficulty: "easy"
  },
  {
    id: "lsf-q16",
    question: "What is the color associated with LE SSERAFIM in BLOOM?",
    options: ["Pink", "Purple", "Teal", "Gold/Red"],
    correctAnswer: 3,
    category: "general",
    explanation: "LE SSERAFIM is represented by gold and red tones in BLOOM.",
    difficulty: "easy"
  },
  {
    id: "lsf-q17",
    question: "Which ballet academy was Kazuha accepted to before debuting?",
    options: [
      "Royal Ballet School",
      "Dutch National Ballet Academy",
      "Paris Opera Ballet",
      "Bolshoi Ballet Academy"
    ],
    correctAnswer: 1,
    category: "members",
    explanation: "Kazuha was accepted to the Dutch National Ballet Academy but chose to pursue K-pop.",
    difficulty: "hard"
  },
  {
    id: "lsf-q18",
    question: "What production style does LE SSERAFIM's music incorporate?",
    options: [
      "Traditional ballads",
      "House and electronic pop",
      "Classical orchestral",
      "Folk music"
    ],
    correctAnswer: 1,
    category: "general",
    explanation: "LE SSERAFIM's discography is heavily influenced by house music and electronic pop.",
    difficulty: "medium"
  },
  {
    id: "lsf-q19",
    question: "Which LE SSERAFIM album debuted at #1 on Gaon?",
    options: ["FEARLESS", "ANTIFRAGILE", "UNFORGIVEN", "All of them"],
    correctAnswer: 3,
    category: "awards",
    explanation: "Every LE SSERAFIM release has debuted at #1 on South Korea's Gaon Album Chart.",
    difficulty: "hard"
  },
  {
    id: "lsf-q20",
    question: "Chaewon's birthday is often celebrated as what by fans?",
    options: ["Golden Day", "Chaewon Day", "Leader Day", "88 Day"],
    correctAnswer: 1,
    category: "members",
    explanation: "FEARNOT calls Chaewon's birthday (8/8) 'Chaewon Day' because of her beloved double-eight birthday.",
    difficulty: "hard"
  },
  {
    id: "lsf-q21",
    question: "Sakura competed in which idol survival show before K-pop?",
    options: ["NiziU", "Produce 48", "Girls Planet 999", "AKB Idol Senbatsu"],
    correctAnswer: 1,
    category: "history",
    explanation: "Sakura appeared on Produce 48, where she joined IZ*ONE.",
    difficulty: "medium"
  },
  {
    id: "lsf-q22",
    question: "Yunjin appeared in which Broadway production?",
    options: ["Mamma Mia!", "Hamilton", "Spring Awakening", "Les Misérables"],
    correctAnswer: 2,
    category: "members",
    explanation: "Yunjin participated in a school production of 'Spring Awakening' during her studies.",
    difficulty: "hard"
  },
  {
    id: "lsf-q23",
    question: "Which song from LE SSERAFIM's discography has the most streams?",
    options: ["ANTIFRAGILE", "FEARLESS", "EASY", "UNFORGIVEN"],
    correctAnswer: 0,
    category: "songs",
    explanation: "'ANTIFRAGILE' has approximately 750M streams, making it a massive breakout hit.",
    difficulty: "medium"
  },
  {
    id: "lsf-q24",
    question: "Sakura previously competed in AKB48's Senbatsu elections for how long?",
    options: ["3 years", "5 years", "7 years", "10 years"],
    correctAnswer: 2,
    category: "members",
    explanation: "Sakura competed in the AKB48 Senbatsu elections for over 7 years.",
    difficulty: "hard"
  },
  {
    id: "lsf-q25",
    question: "What concept does LE SSERAFIM embody?",
    options: [
      "Pure innocence",
      "Unapologetic attitude and fearlessness",
      "Cute and bubbly",
      "Dark and mysterious"
    ],
    correctAnswer: 1,
    category: "general",
    explanation: "LE SSERAFIM's brand identity is built on fearlessness and unapologetic self-expression.",
    difficulty: "easy"
  },
  {
    id: "lsf-q26",
    question: "'Eve, Psyche & The Bluebeard's wife' is on which album?",
    options: ["FEARLESS", "ANTIFRAGILE", "UNFORGIVEN", "EASY"],
    correctAnswer: 1,
    category: "songs",
    explanation: "'Eve, Psyche & The Bluebeard's wife' is a b-side track on the ANTIFRAGILE mini-album.",
    difficulty: "medium"
  },
  {
    id: "lsf-q27",
    question: "Kazuha speaks how many languages?",
    options: ["One", "Two", "Three", "Four"],
    correctAnswer: 2,
    category: "members",
    explanation: "Kazuha speaks Japanese, Korean, and conversational English.",
    difficulty: "medium"
  },
  {
    id: "lsf-q28",
    question: "Who among LE SSERAFIM was born in the US?",
    options: ["Eunchae", "Sakura", "Yunjin", "Kazuha"],
    correctAnswer: 2,
    category: "members",
    explanation: "Yunjin was born in South Korea but grew up in New York City.",
    difficulty: "medium"
  },
  {
    id: "lsf-q29",
    question: "What year did LE SSERAFIM debut?",
    options: ["2021", "2022", "2023", "2024"],
    correctAnswer: 1,
    category: "history",
    explanation: "LE SSERAFIM officially debuted on May 2, 2022 under Source Music.",
    difficulty: "easy"
  },
  {
    id: "lsf-q30",
    question: "Which Eunchae quote became a viral moment during FEARLESS promotions?",
    options: [
      "'I'm the best dancer'",
      "'honestly, I'm scared but let's go'",
      "'I love being maknae'",
      "'let's be fearless together'"
    ],
    correctAnswer: 1,
    category: "members",
    explanation: "Eunchae's candid 'honestly, I'm scared but let's go' became a beloved viral moment.",
    difficulty: "medium"
  }
];
const lesserafimFunFacts = [
  {
    id: "lsf-f1",
    text: "'LE SSERAFIM' is an anagram of 'IM FEARLESS' — their entire identity in one word rearranged.",
    category: "history",
    emoji: "🔤"
  },
  {
    id: "lsf-f2",
    text: "Kazuha was accepted to the Dutch National Ballet Academy but chose K-pop — the world's gain.",
    category: "member",
    emoji: "🩰",
    memberName: "Kazuha"
  },
  {
    id: "lsf-f3",
    text: "'ANTIFRAGILE' became the first LE SSERAFIM song to top the Billboard Global 200.",
    category: "achievement",
    emoji: "🌍"
  },
  {
    id: "lsf-f4",
    text: "Sakura appeared in AKB48 Senbatsu elections for 7+ years before joining IZ*ONE, then LE SSERAFIM.",
    category: "member",
    emoji: "🌸",
    memberName: "Sakura"
  },
  {
    id: "lsf-f5",
    text: "Yunjin wrote 'Sour Grapes' at age 20 — it became one of LE SSERAFIM's most beloved b-sides.",
    category: "member",
    emoji: "✍️",
    memberName: "Yunjin"
  },
  {
    id: "lsf-f6",
    text: "LE SSERAFIM were the first 4th-gen girl group to perform at Coachella.",
    category: "achievement",
    emoji: "🎪"
  },
  {
    id: "lsf-f7",
    text: "Every LE SSERAFIM album has debuted at #1 on South Korea's Gaon Album Chart.",
    category: "achievement",
    emoji: "🏆"
  },
  {
    id: "lsf-f8",
    text: "'UNFORGIVEN' featured legendary producer Nile Rodgers on guitar — a K-pop first.",
    category: "achievement",
    emoji: "🎸"
  },
  {
    id: "lsf-f9",
    text: "Eunchae owns over 40 pairs of limited-edition sneakers at just 17 years old.",
    category: "member",
    emoji: "👟",
    memberName: "Eunchae"
  },
  {
    id: "lsf-f10",
    text: "Chaewon wrote lyrics for several b-sides across LE SSERAFIM's discography.",
    category: "member",
    emoji: "📝",
    memberName: "Chaewon"
  },
  {
    id: "lsf-f11",
    text: "LE SSERAFIM's light stick is shaped like a flaming gem — nicknamed the 'Serafim Stone'.",
    category: "fun",
    emoji: "💎"
  },
  {
    id: "lsf-f12",
    text: "Kazuha's ballet cover of 'Fearless' reached 40 million views and introduced her to global fans.",
    category: "member",
    emoji: "🎬",
    memberName: "Kazuha"
  },
  {
    id: "lsf-f13",
    text: "LE SSERAFIM recorded the 'EASY' album while simultaneously preparing for their Coachella debut.",
    category: "history",
    emoji: "💪"
  },
  {
    id: "lsf-f14",
    text: "Sakura has over 5 million Instagram followers from her decade-long solo fanbase outside LE SSERAFIM.",
    category: "member",
    emoji: "📱",
    memberName: "Sakura"
  },
  {
    id: "lsf-f15",
    text: "The group's debut concept emphasized that 'I'm fearless' means admitting fears but facing them anyway.",
    category: "history",
    emoji: "❤️‍🔥"
  },
  {
    id: "lsf-f16",
    text: "FEARNOT fans organized a surprise 1000-person flash mob dancing to ANTIFRAGILE in Seoul.",
    category: "fun",
    emoji: "💃"
  },
  {
    id: "lsf-f17",
    text: "'EASY' debuted at #1 in 24 countries on Apple Music charts simultaneously.",
    category: "achievement",
    emoji: "🎵"
  },
  {
    id: "lsf-f18",
    text: "Yunjin participates in songwriting workshops and has co-written content with global producers.",
    category: "member",
    emoji: "🎙️",
    memberName: "Yunjin"
  },
  {
    id: "lsf-f19",
    text: "LE SSERAFIM became the fastest Source Music group to reach 1 billion total streams.",
    category: "achievement",
    emoji: "⚡"
  },
  {
    id: "lsf-f20",
    text: "Eunchae's 'honestly scared but let's go' became a philosophy fans tattooed on their arms.",
    category: "member",
    emoji: "🦁",
    memberName: "Eunchae"
  },
  {
    id: "lsf-f21",
    text: "The group donated proceeds from FEARNOT fandom anniversary goods to ballet education charities.",
    category: "achievement",
    emoji: "🌟"
  },
  {
    id: "lsf-f22",
    text: "Kazuha still practices classical ballet daily to maintain her signature fluid movement vocabulary.",
    category: "member",
    emoji: "✨",
    memberName: "Kazuha"
  }
];
export {
  AnimatePresence as A,
  lesserafimMembers as a,
  btsSongs as b,
  cortisSongs as c,
  cortisMembers as d,
  btsMembers as e,
  illitMembers as f,
  lesserafimTriviaQuestions as g,
  cortisTriviaQuestions as h,
  illitSongs as i,
  btsTriviaQuestions as j,
  illitTriviaQuestions as k,
  lesserafimSongs as l,
  lesserafimFunFacts as m,
  cortisFunFacts as n,
  btsFunFacts as o,
  illitFunFacts as p,
  lesserafimDiscography as q,
  cortisDiscography as r,
  btsDiscography as s,
  illitDiscography as t
};
