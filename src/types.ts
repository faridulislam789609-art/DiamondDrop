export type TabType = 
  | 'home'
  | 'checkin'
  | 'quiz'
  | 'tickets'
  | 'rewards'
  | 'rules'
  | 'profile'
  | 'admin';

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  firebaseUid?: string;
  username: string;
  email: string;
  avatarUrl: string;
  freeFireUid: string;
  inGameName: string;
  region: string;
  totalTickets: number;
  weeklyTickets: number;
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string | null; // YYYY-MM-DD
  lastQuizDate: string | null;     // YYYY-MM-DD
  lastQuizRewardDate?: string | null; // YYYY-MM-DD
  recentQuizQuestionIds?: number[]; // Latest up to 20 question IDs
  dailyQuizQuestionIds?: number[]; // Today's 5 selected question IDs
  dailyQuizDate?: string | null;    // Date for dailyQuizQuestionIds
  lastQuizScore?: number;          // Today's or latest quiz score
  isWinnerThisWeek: boolean;
  role: UserRole;
  createdAt: string;
}

export type ActivityType = 
  | 'Daily Check-in' 
  | 'Daily Quiz' 
  | '7 Day Bonus' 
  | 'Referral Bonus'
  | 'Welcome Gift'
  | 'Weekly Entry Entry';

export interface ActivityHistoryItem {
  id: string;
  date: string; // ISO or readable
  activity: ActivityType;
  tickets: number; // e.g. +1, +2, +5
  description?: string;
}

export type RewardRequestStatus = 'Pending' | 'Approved' | 'Delivered' | 'Rejected' | 'pending' | 'approved' | 'delivered' | 'rejected';

export interface DiamondRequest {
  id: string;
  requestId: string; // e.g. "DD-89421" or "REQ-XXXX"
  userId: string;
  username: string;
  roundId?: string;
  freeFireUid: string;
  inGameName: string;
  region: string;
  rewardAmount: number; // Diamonds e.g. 100
  weeklyTickets?: number;
  status: 'pending' | 'approved' | 'delivered' | 'rejected' | 'Pending' | 'Approved' | 'Delivered' | 'Rejected';
  submittedAt: string;
  updatedAt?: string;
  deliveredAt?: string;
  adminNote?: string;
  transactionRef?: string;
}

export interface WinnerRecord {
  id: string;
  uid?: string;
  roundId?: string;
  maskedName: string; // e.g. "Far***"
  maskedUid: string;  // e.g. "195****4321"
  inGameName?: string;
  region?: string;
  prizeAmount: number;
  roundTitle: string; // e.g. "Week #47 Drop"
  date: string;
  status: 'Delivered' | 'Approved' | 'Pending' | 'awaiting_request' | 'delivered' | 'pending' | 'approved';
}

export interface WeeklyRoundConfig {
  roundId: string; // e.g. "round_48" or "ROUND-48"
  title: string;
  prizeDiamonds: number; // e.g. 100
  maxWinners: number;    // 1 to 10 winners
  startDate: string;     // e.g. "2026-08-31"
  endDate: string;       // e.g. "2026-09-06"
  status: 'open' | 'closed' | 'completed';
  winnersCount: number;  // 0, 1, 2
  deliveredCount: number;// e.g. 0
  totalDeliveredTarget: number; // e.g. 2
  entriesOpen: boolean;
  totalEntriesCount: number;
  createdAt?: string;
  createdBy?: string;
}

export interface EligibleUser {
  uid: string;
  displayName: string;
  maskedEmail: string;
  weeklyTickets: number;
  freeFireUid?: string;
  inGameName?: string;
  status: 'Eligible' | 'Not Eligible';
}

export interface ActiveWinnerClaim {
  roundId: string;
  roundTitle: string;
  prizeDiamonds: number;
  rewardStatus: 'awaiting_request' | 'request_submitted' | 'pending' | 'approved' | 'delivered' | 'rejected';
  hasSubmittedRequest: boolean;
  requestId?: string;
  freeFireUid?: string;
  inGameName?: string;
  region?: string;
  submittedAt?: string;
  status?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
  explanation: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'ticket' | 'reward' | 'system' | 'streak';
}
