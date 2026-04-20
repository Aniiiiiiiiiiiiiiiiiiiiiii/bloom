export interface Group {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    gradient: string;
    glow: string;
    text: string;
  };
  glowClass: string;
  description: string;
  memberCount: number;
  debutYear: number;
  fandomName: string;
  agency: string;
}

export interface Member {
  id: string;
  name: string;
  role: string[];
  birthday: string;
  birthYear: number;
  nationality: string;
  position: string;
  bio: string;
  funFacts: string[];
  color?: string;
}

export interface Song {
  id: string;
  title: string;
  album: string;
  releaseYear: number;
  streams: number;
  youtubeViews: number;
  itunesRank: number | null;
  appleMusicRank: number | null;
  weeklyTrend: number[];
  isTitle: boolean;
}

export interface DiscographyEntry {
  id: string;
  title: string;
  type: "album" | "mini-album" | "single" | "ep";
  releaseDate: string;
  tracks: string[];
  coverColor: string;
  description: string;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
  category: "members" | "songs" | "awards" | "history" | "general";
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface FunFact {
  id: string;
  text: string;
  category: "member" | "achievement" | "history" | "music" | "fun";
  emoji: string;
  memberName?: string;
}

export interface GroupData {
  group: Group;
  members: Member[];
  songs: Song[];
  discography: DiscographyEntry[];
  triviaQuestions: TriviaQuestion[];
  funFacts: FunFact[];
}

export type GroupId = "illit" | "bts" | "cortis" | "lesserafim";
export type SectionId = "charts" | "members" | "games" | "facts";
