import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  orderBy,
  limit,
} from 'firebase/firestore';
import { auth, googleAuthProvider, db } from '../lib/firebase';
import {
  TabType,
  UserProfile,
  ActivityHistoryItem,
  DiamondRequest,
  WinnerRecord,
  WeeklyRoundConfig,
  AppNotification,
  RewardRequestStatus,
  EligibleUser,
  ActiveWinnerClaim,
} from '../types';
import {
  DEFAULT_USER,
  INITIAL_ROUND,
  SAMPLE_ACTIVITY_HISTORY,
  SAMPLE_PREVIOUS_WINNERS,
  INITIAL_DIAMOND_REQUESTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

export const maskName = (name: string): string => {
  if (!name) return 'Player***';
  if (name.length <= 3) return name.slice(0, 1) + '***';
  return name.slice(0, 3) + '***';
};

export const maskUid = (uid: string): string => {
  if (!uid) return '876****123';
  if (uid.length <= 6) return uid.slice(0, 2) + '****';
  return uid.slice(0, 3) + '****' + uid.slice(-3);
};

export const maskEmail = (email: string): string => {
  if (!email) return '***@***.com';
  const parts = email.split('@');
  const name = parts[0];
  const domain = parts[1] || 'gmail.com';
  if (name.length <= 2) return name[0] + '***@' + domain;
  return name.slice(0, 3) + '***' + name.slice(-1) + '@' + domain;
};

interface AppContextType {
  // Navigation
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Firebase Auth State
  user: UserProfile;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  loginWithMock: (email?: string, username?: string) => void;

  // Daily Check-in & Quiz
  canCheckInToday: boolean;
  canPlayQuizToday: boolean;
  claimDailyCheckIn: () => Promise<{ success: boolean; message: string; ticketsEarned: number; is7DayBonus?: boolean }>;
  submitQuizScore: (score: number, totalQuestions: number, questionIds?: number[]) => Promise<{ success: boolean; ticketsEarned: number; message: string; alreadyClaimed?: boolean }>;
  saveTodayQuizQuestions?: (questionIds: number[]) => Promise<void>;

  // Tickets & History
  activityHistory: ActivityHistoryItem[];

  // Weekly Rewards & Winners
  weeklyRound: WeeklyRoundConfig;
  previousWinners: WinnerRecord[];
  winnerClaim: ActiveWinnerClaim | null;
  updateWeeklyRoundConfig: (config: Partial<WeeklyRoundConfig>) => Promise<void>;
  resetWeeklyRound: () => void;
  selectWeeklyWinners: () => Promise<{ success: boolean; message: string; winners?: any[] }>;
  startNewWeeklyRound: () => Promise<{ success: boolean; message: string }>;

  // Diamond Requests (Redemptions)
  diamondRequests: DiamondRequest[];
  submitDiamondRequest: (data: { freeFireUid: string; inGameName: string; region: string }) => Promise<{ success: boolean; requestId: string; message: string }>;
  updateRequestStatus: (id: string, status: RewardRequestStatus, adminNote?: string, transactionRef?: string) => Promise<void>;
  getRequestById: (reqId: string) => DiamondRequest | undefined;

  // Admin Data
  eligibleUsers: EligibleUser[];
  adminStats: {
    totalUsers: number;
    activeUsers: number;
    eligibleUsers: number;
    pendingRequests: number;
    deliveredRewards: number;
  };

  // Modals & UI
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  notificationsModalOpen: boolean;
  setNotificationsModalOpen: (open: boolean) => void;
  notifications: AppNotification[];
  markAllNotificationsAsRead: () => void;
  searchedRequestId: string;
  setSearchedRequestId: (id: string) => void;
  triggerConfetti: () => void;
  activeToast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'diamonddrop_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Tab State
  const [activeTab, setActiveTabState] = useState<TabType>('home');

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  // Weekly Round State
  const [weeklyRound, setWeeklyRound] = useState<WeeklyRoundConfig>(INITIAL_ROUND);
  const [currentRoundWinners, setCurrentRoundWinners] = useState<any[]>([]);
  const [winnerClaim, setWinnerClaim] = useState<ActiveWinnerClaim | null>(null);

  // Previous Winners State
  const [previousWinners, setPreviousWinners] = useState<WinnerRecord[]>(SAMPLE_PREVIOUS_WINNERS);

  // Diamond Requests State
  const [diamondRequests, setDiamondRequests] = useState<DiamondRequest[]>(INITIAL_DIAMOND_REQUESTS);

  // Admin Eligible Users & Live Stats State
  const [eligibleUsers, setEligibleUsers] = useState<EligibleUser[]>([]);
  const [allUsersList, setAllUsersList] = useState<any[]>([]);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Activity History State
  const [activityHistory, setActivityHistory] = useState<ActivityHistoryItem[]>(SAMPLE_ACTIVITY_HISTORY);

  // Modals & UI helpers
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [searchedRequestId, setSearchedRequestId] = useState('');
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => {
      setActiveToast((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const setActiveTab = (tab: TabType) => {
    if (tab === 'admin' && user.role !== 'admin') {
      setActiveTabState('home');
      showToast('Access Denied: Admin authorization required');
      return;
    }
    setActiveTabState(tab);
  };

  // Route protection guard: if user role is not admin, redirect to home
  useEffect(() => {
    if (activeTab === 'admin' && user.role !== 'admin') {
      setActiveTabState('home');
      showToast('Access Denied');
    }
  }, [activeTab, user.role]);

  // Helper to map Firestore user data to UserProfile object
  const mapFirestoreUserToProfile = (data: any, fbUser: FirebaseUser): UserProfile => {
    let createdDateStr = new Date().toISOString().split('T')[0];
    if (data?.createdAt?.toDate) {
      createdDateStr = data.createdAt.toDate().toISOString().split('T')[0];
    } else if (typeof data?.createdAt === 'string') {
      createdDateStr = data.createdAt.split('T')[0];
    }

    return {
      id: fbUser.uid,
      firebaseUid: fbUser.uid,
      username: data?.displayName || fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Survivor_' + fbUser.uid.slice(0, 6)),
      email: data?.email || fbUser.email || '',
      avatarUrl: data?.photoURL || fbUser.photoURL || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
      freeFireUid: data?.freeFireUid || '',
      inGameName: data?.inGameName || '',
      region: data?.region || 'India & South Asia',
      totalTickets: typeof data?.tickets === 'number' ? data.tickets : (typeof data?.totalTickets === 'number' ? data.totalTickets : 0),
      weeklyTickets: typeof data?.weeklyTickets === 'number' ? data.weeklyTickets : 0,
      currentStreak: typeof data?.currentStreak === 'number' ? data.currentStreak : 0,
      longestStreak: typeof data?.longestStreak === 'number' ? data.longestStreak : 0,
      lastCheckInDate: data?.lastCheckInDate || null,
      lastQuizDate: data?.lastQuizDate || null,
      lastQuizRewardDate: data?.lastQuizRewardDate || data?.lastQuizDate || null,
      recentQuizQuestionIds: Array.isArray(data?.recentQuizQuestionIds) ? data.recentQuizQuestionIds : [],
      dailyQuizQuestionIds: Array.isArray(data?.dailyQuizQuestionIds) ? data.dailyQuizQuestionIds : [],
      dailyQuizDate: data?.dailyQuizDate || null,
      lastQuizScore: typeof data?.lastQuizScore === 'number' ? data.lastQuizScore : undefined,
      isWinnerThisWeek: false,
      role: data?.role === 'admin' ? 'admin' : 'user', // strictly from Firestore users/{uid}.role
      createdAt: createdDateStr,
    };
  };

  // 1. Listen to Firebase Auth state changes & Sync with Cloud Firestore users/{firebaseUid}
  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (fbUser) => {
        if (unsubscribeDoc) {
          unsubscribeDoc();
          unsubscribeDoc = null;
        }

        if (fbUser) {
          setFirebaseUser(fbUser);
          setIsAuthenticated(true);
          setAuthLoading(true);
          setWinnerClaim(null);

          // Clear previous user profile state immediately when switching accounts
          setUser({
            id: fbUser.uid,
            firebaseUid: fbUser.uid,
            username: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Survivor_' + fbUser.uid.slice(0, 6)),
            email: fbUser.email || '',
            avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
            freeFireUid: '',
            inGameName: '',
            region: 'India & South Asia',
            totalTickets: 0,
            weeklyTickets: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastCheckInDate: null,
            lastQuizDate: null,
            lastQuizRewardDate: null,
            isWinnerThisWeek: false,
            role: 'user', // default role until loaded from users/{fbUser.uid} document
            createdAt: new Date().toISOString().split('T')[0],
          });

          try {
            const userDocRef = doc(db, 'users', fbUser.uid);
            const docSnap = await getDoc(userDocRef);

            if (!docSnap.exists()) {
              // Newly registered Firebase user - ALWAYS created with role: 'user'
              const initialUserData = {
                uid: fbUser.uid,
                displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Survivor_' + fbUser.uid.slice(0, 6)),
                email: fbUser.email || '',
                photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
                tickets: 0,
                weeklyTickets: 0,
                currentStreak: 0,
                longestStreak: 0,
                lastCheckInDate: null,
                lastQuizDate: null,
                lastQuizRewardDate: null,
                freeFireUid: '',
                inGameName: '',
                region: 'India & South Asia',
                role: 'user', // CRITICAL: every new user is created with role: 'user'
              };
              await setDoc(userDocRef, initialUserData);
            } else {
              // Existing user document - NEVER overwrite or modify existing role
              const existingData = docSnap.data();
              const updates: Record<string, any> = {
                lastLoginAt: serverTimestamp(),
              };

              if (fbUser.displayName && fbUser.displayName !== existingData?.displayName) {
                updates.displayName = fbUser.displayName;
              }
              if (fbUser.email && fbUser.email !== existingData?.email) {
                updates.email = fbUser.email;
              }
              if (fbUser.photoURL && fbUser.photoURL !== existingData?.photoURL) {
                updates.photoURL = fbUser.photoURL;
              }

              await updateDoc(userDocRef, updates);
            }

            // Real-time listener to load and synchronize user profile strictly from users/{fbUser.uid}
            unsubscribeDoc = onSnapshot(
              userDocRef,
              (snap) => {
                if (snap.exists()) {
                  const profile = mapFirestoreUserToProfile(snap.data(), fbUser);
                  setUser(profile);
                }
                setAuthLoading(false);
              },
              (snapErr) => {
                console.error('Firestore user snapshot error:', snapErr);
                setAuthLoading(false);
              }
            );
          } catch (err: any) {
            console.error('Firestore user sync error:', err);
            setUser({
              id: fbUser.uid,
              firebaseUid: fbUser.uid,
              username: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Survivor_' + fbUser.uid.slice(0, 6)),
              email: fbUser.email || '',
              avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
              freeFireUid: '',
              inGameName: '',
              region: 'India & South Asia',
              totalTickets: 0,
              weeklyTickets: 0,
              currentStreak: 0,
              longestStreak: 0,
              lastCheckInDate: null,
              lastQuizDate: null,
              lastQuizRewardDate: null,
              isWinnerThisWeek: false,
              role: 'user',
              createdAt: new Date().toISOString().split('T')[0],
            });
            setAuthLoading(false);
          }
        } else {
          setFirebaseUser(null);
          setIsAuthenticated(false);
          setWinnerClaim(null);
          setUser({
            id: 'guest',
            firebaseUid: '',
            username: 'Guest_User',
            email: '',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            freeFireUid: '',
            inGameName: '',
            region: 'India & South Asia',
            totalTickets: 0,
            weeklyTickets: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastCheckInDate: null,
            lastQuizDate: null,
            lastQuizRewardDate: null,
            isWinnerThisWeek: false,
            role: 'user',
            createdAt: new Date().toISOString().split('T')[0],
          });
          setAuthLoading(false);
        }
      },
      (error) => {
        console.error('Firebase Auth state error:', error);
        setAuthLoading(false);
      }
    );

    return () => {
      if (unsubscribeDoc) unsubscribeDoc();
      unsubscribeAuth();
    };
  }, []);

  // 2. Real-time Listener for Active Weekly Round in Firestore (weeklyRounds)
  useEffect(() => {
    const weeklyRoundsCol = collection(db, 'weeklyRounds');
    const q = query(weeklyRoundsCol, orderBy('createdAt', 'desc'), limit(1));

    const unsubscribeRound = onSnapshot(
      q,
      async (snapshot) => {
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data();
          const docId = snapshot.docs[0].id;
          const config: WeeklyRoundConfig = {
            roundId: docData.roundId || docId,
            title: docData.title || `Weekly Diamond Drop #${docData.roundId || '48'}`,
            prizeDiamonds: typeof docData.prizeDiamonds === 'number' ? docData.prizeDiamonds : 100,
            maxWinners: typeof docData.maxWinners === 'number' ? Math.max(1, Math.min(10, docData.maxWinners)) : 2,
            startDate: docData.startAt || docData.startDate || '2026-08-31',
            endDate: docData.endAt || docData.endDate || '2026-09-06',
            status: docData.status || 'open',
            winnersCount: typeof docData.winnersCount === 'number' ? docData.winnersCount : 0,
            deliveredCount: typeof docData.deliveredCount === 'number' ? docData.deliveredCount : 0,
            totalDeliveredTarget: typeof docData.maxWinners === 'number' ? Math.max(1, Math.min(10, docData.maxWinners)) : 2,
            entriesOpen: docData.status === 'open',
            totalEntriesCount: typeof docData.totalEntriesCount === 'number' ? docData.totalEntriesCount : 0,
            createdAt: docData.createdAt?.toDate ? docData.createdAt.toDate().toISOString() : undefined,
            createdBy: docData.createdBy,
          };
          setWeeklyRound(config);
        } else {
          // If no weekly rounds exist yet in Firestore, seed the initial round
          try {
            const initialRoundDoc = doc(weeklyRoundsCol, 'round_48');
            const now = new Date();
            const nextSunday = new Date(now);
            const dayOfWeek = now.getDay();
            const distanceToSunday = (7 - dayOfWeek) % 7 || 7;
            nextSunday.setDate(now.getDate() + distanceToSunday);
            nextSunday.setHours(23, 59, 59, 999);

            await setDoc(initialRoundDoc, {
              roundId: 'round_48',
              title: 'Weekly Diamond Drop #48',
              startAt: now.toISOString().split('T')[0],
              endAt: nextSunday.toISOString().split('T')[0],
              status: 'open',
              prizeDiamonds: 100,
              maxWinners: 2,
              winnersCount: 0,
              deliveredCount: 0,
              createdAt: serverTimestamp(),
            });
          } catch (seedErr) {
            console.warn('Could not auto-seed weekly round:', seedErr);
          }
        }
      },
      (err) => {
        console.error('Firestore weeklyRounds listener error:', err);
      }
    );

    return () => unsubscribeRound();
  }, []);

  // 3. Real-time Listener for Current Round's Winners: weeklyRounds/{roundId}/winners
  useEffect(() => {
    if (!weeklyRound?.roundId) return;

    const winnersCol = collection(db, 'weeklyRounds', weeklyRound.roundId, 'winners');
    const unsubscribeWinners = onSnapshot(
      winnersCol,
      (snapshot) => {
        const winnersList: any[] = [];
        snapshot.forEach((d) => {
          winnersList.push({ id: d.id, ...d.data() });
        });
        setCurrentRoundWinners(winnersList);

        // Update delivered count from winners
        const delivered = winnersList.filter((w) => w.rewardStatus === 'delivered').length;
        setWeeklyRound((prev) => ({
          ...prev,
          winnersCount: winnersList.length,
          deliveredCount: delivered,
        }));

        // Check if current user is one of the winners
        if (firebaseUser) {
          const userWinner = winnersList.find((w) => w.uid === firebaseUser.uid || w.id === firebaseUser.uid);
          if (userWinner) {
            setWinnerClaim({
              roundId: weeklyRound.roundId,
              roundTitle: weeklyRound.title,
              prizeDiamonds: userWinner.prizeDiamonds || weeklyRound.prizeDiamonds,
              rewardStatus: userWinner.rewardStatus || 'awaiting_request',
              hasSubmittedRequest: userWinner.rewardStatus !== 'awaiting_request',
            });
            setUser((prev) => ({ ...prev, isWinnerThisWeek: true }));
          } else {
            setWinnerClaim(null);
            setUser((prev) => ({ ...prev, isWinnerThisWeek: false }));
          }
        }

        // Merge winners into previous winners list for public ledger
        const formattedWinners: WinnerRecord[] = winnersList.map((w) => ({
          id: w.id || w.uid,
          uid: w.uid,
          roundId: weeklyRound.roundId,
          maskedName: maskName(w.displayName || 'Gamer'),
          maskedUid: maskUid(w.freeFireUid || w.uid || '123456789'),
          inGameName: w.inGameName || 'Survivor',
          region: w.region || 'India & South Asia',
          prizeAmount: w.prizeDiamonds || weeklyRound.prizeDiamonds,
          roundTitle: weeklyRound.title,
          date: w.selectedAt?.toDate ? w.selectedAt.toDate().toISOString().split('T')[0] : 'This Week',
          status: w.rewardStatus === 'delivered' ? 'Delivered' : (w.rewardStatus === 'approved' ? 'Approved' : 'Pending'),
        }));

        setPreviousWinners((prev) => {
          const others = prev.filter((p) => p.roundTitle !== weeklyRound.title);
          return [...formattedWinners, ...others];
        });
      },
      (err) => {
        console.error('Firestore winners listener error:', err);
      }
    );

    return () => unsubscribeWinners();
  }, [weeklyRound?.roundId, firebaseUser]);

  // 4. Real-time Listener for Reward Requests (rewardRequests)
  useEffect(() => {
    // If not authenticated, do not listen to reward requests
    if (!firebaseUser) {
      setDiamondRequests([]);
      return;
    }

    const rewardRequestsCol = collection(db, 'rewardRequests');
    let q;

    // If admin, listen to all recent requests; if regular user, listen only to own requests
    if (user.role === 'admin') {
      q = query(rewardRequestsCol, orderBy('createdAt', 'desc'), limit(50));
    } else {
      q = query(rewardRequestsCol, where('uid', '==', firebaseUser.uid), limit(20));
    }

    const unsubscribeRequests = onSnapshot(
      q,
      (snapshot) => {
        const reqList: DiamondRequest[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          let submittedStr = 'Recently';
          if (data.createdAt?.toDate) {
            submittedStr = data.createdAt.toDate().toISOString().replace('T', ' ').slice(0, 16);
          } else if (typeof data.createdAt === 'string') {
            submittedStr = data.createdAt;
          }

          let updatedStr = submittedStr;
          if (data.updatedAt?.toDate) {
            updatedStr = data.updatedAt.toDate().toISOString().replace('T', ' ').slice(0, 16);
          }

          let deliveredStr = undefined;
          if (data.deliveredAt?.toDate) {
            deliveredStr = data.deliveredAt.toDate().toISOString().replace('T', ' ').slice(0, 16);
          }

          reqList.push({
            id: d.id,
            requestId: data.requestId || d.id,
            userId: data.uid || data.userId,
            username: data.username || data.displayName || 'Gamer',
            roundId: data.roundId || weeklyRound.roundId,
            freeFireUid: data.freeFireUid || '',
            inGameName: data.inGameName || '',
            region: data.region || 'India & South Asia',
            rewardAmount: data.prizeDiamonds || data.rewardAmount || 100,
            weeklyTickets: data.weeklyTickets || 0,
            status: data.status || 'pending',
            submittedAt: submittedStr,
            updatedAt: updatedStr,
            deliveredAt: deliveredStr,
            adminNote: data.adminNote,
            transactionRef: data.transactionRef,
          });
        });
        setDiamondRequests(reqList);

        // Update winner claim if current user has submitted request
        if (firebaseUser) {
          const myRequest = reqList.find((r) => r.userId === firebaseUser.uid);
          if (myRequest) {
            setWinnerClaim((prev) =>
              prev
                ? {
                    ...prev,
                    hasSubmittedRequest: true,
                    requestId: myRequest.requestId,
                    rewardStatus: myRequest.status as any,
                  }
                : null
            );
          }
        }
      },
      (err) => {
        console.error('Firestore rewardRequests listener error:', err);
      }
    );

    return () => unsubscribeRequests();
  }, [user.role, firebaseUser, weeklyRound.roundId]);

  // 5. Real-time Listener for All Users (Admin View & Eligible Users Table)
  useEffect(() => {
    if (user.role !== 'admin') return;

    const usersCol = collection(db, 'users');
    const unsubscribeUsers = onSnapshot(
      usersCol,
      (snapshot) => {
        const usersArr: any[] = [];
        const eligibleArr: EligibleUser[] = [];

        snapshot.forEach((d) => {
          const data = d.data();
          const u = { uid: d.id, ...data };
          usersArr.push(u);

          const wTickets = typeof data.weeklyTickets === 'number' ? data.weeklyTickets : 0;
          if (wTickets > 0) {
            eligibleArr.push({
              uid: d.id,
              displayName: data.displayName || 'Survivor_' + d.id.slice(0, 5),
              maskedEmail: maskEmail(data.email || ''),
              weeklyTickets: wTickets,
              freeFireUid: data.freeFireUid || undefined,
              inGameName: data.inGameName || undefined,
              status: 'Eligible',
            });
          }
        });

        // Sort eligible users by weeklyTickets descending
        eligibleArr.sort((a, b) => b.weeklyTickets - a.weeklyTickets);

        setAllUsersList(usersArr);
        setEligibleUsers(eligibleArr);
      },
      (err) => {
        console.error('Firestore all users listener error:', err);
      }
    );

    return () => unsubscribeUsers();
  }, [user.role]);

  // Derived Admin Dashboard Stats
  const adminStats = {
    totalUsers: allUsersList.length || 3482,
    activeUsers: allUsersList.filter((u) => (u.weeklyTickets || 0) > 0 || u.lastCheckInDate).length || 842,
    eligibleUsers: eligibleUsers.length,
    pendingRequests: diamondRequests.filter((r) => r.status.toLowerCase() === 'pending').length,
    deliveredRewards: diamondRequests.filter((r) => r.status.toLowerCase() === 'delivered').length,
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#8b5cf6', '#f59e0b', '#3b82f6', '#ec4899'],
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }
  };

  const getTodayDateString = (): string => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getYesterdayDateString = (): string => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const canCheckInToday = user.lastCheckInDate !== getTodayDateString();
  const canPlayQuizToday = (user.lastQuizRewardDate || user.lastQuizDate) !== getTodayDateString();

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    const { role: _ignoredRole, ...safeData } = data;
    setUser((prev) => ({ ...prev, ...safeData }));

    if (firebaseUser) {
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const updates: Record<string, any> = {};

        if (safeData.username !== undefined) updates.displayName = safeData.username;
        if (safeData.freeFireUid !== undefined) updates.freeFireUid = safeData.freeFireUid;
        if (safeData.inGameName !== undefined) updates.inGameName = safeData.inGameName;
        if (safeData.region !== undefined) updates.region = safeData.region;

        if (Object.keys(updates).length > 0) {
          await updateDoc(userDocRef, updates);
        }
        showToast('Profile saved to Cloud Firestore!');
      } catch (err: any) {
        console.error('Error updating user profile in Firestore:', err);
        showToast('Profile updated locally.');
      }
    } else {
      showToast('Profile updated successfully!');
    }
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      if (result.user) {
        showToast(`Welcome, ${result.user.displayName || 'Gamer'}!`);
        setAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, error: 'No user data received' };
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        showToast('Google sign-in was cancelled');
        return { success: false, error: 'Sign-in cancelled' };
      }
      if (error?.code === 'auth/popup-blocked') {
        showToast('Popup was blocked by browser. Please enable popups.');
        return { success: false, error: 'Popup blocked by browser' };
      }
      showToast('Authentication error. Please retry.');
      return { success: false, error: error?.message || 'Authentication error' };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    setIsAuthenticated(false);
    setFirebaseUser(null);
    setWinnerClaim(null);
    setUser(DEFAULT_USER);
    if (activeTab === 'admin') {
      setActiveTabState('home');
    }
    showToast('Logged out successfully');
  };

  const loginWithMock = (email?: string, username?: string) => {
    setIsAuthenticated(true);
    setUser((prev) => ({
      ...prev,
      email: email || 'gamer@diamonddrop.io',
      username: username || 'DiamondMaster_99',
      role: 'user',
    }));
    setAuthModalOpen(false);
    showToast('Logged in successfully');
  };

  const claimDailyCheckIn = async (): Promise<{
    success: boolean;
    message: string;
    ticketsEarned: number;
    is7DayBonus?: boolean;
  }> => {
    if (!isAuthenticated || !firebaseUser) {
      setAuthModalOpen(true);
      showToast('Please log in with Google to claim daily tickets.');
      return { success: false, message: 'Please log in to claim daily tickets.', ticketsEarned: 0 };
    }

    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const activityDocRef = doc(collection(db, 'users', firebaseUser.uid, 'activity'));

      const result = await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);

        if (!userDoc.exists()) {
          throw new Error('User document does not exist. Please re-login.');
        }

        const data = userDoc.data();

        // Check if user already claimed today
        if (data.lastCheckInDate === today) {
          throw new Error('ALREADY_CLAIMED_TODAY');
        }

        // Streak calculation
        let newStreak = 1;
        const prevCheckIn = data.lastCheckInDate;
        const prevStreak = typeof data.currentStreak === 'number' ? Math.max(0, data.currentStreak) : 0;

        if (prevCheckIn === yesterday) {
          newStreak = prevStreak + 1;
        } else {
          newStreak = 1;
        }

        const newLongestStreak = Math.max(typeof data.longestStreak === 'number' ? data.longestStreak : 0, newStreak);

        // 7-day bonus calculation
        const is7DayBonus = newStreak === 7 && data.lastStreakBonusStreak !== 7;
        const bonusTickets = is7DayBonus ? 5 : 0;
        const totalTicketsEarned = 1 + bonusTickets;

        const currentTickets = Math.max(0, typeof data.tickets === 'number' ? data.tickets : 0);
        const currentWeekly = Math.max(0, typeof data.weeklyTickets === 'number' ? data.weeklyTickets : 0);

        const newTotalTickets = currentTickets + totalTicketsEarned;
        const newWeeklyTickets = currentWeekly + totalTicketsEarned;

        const userUpdates: Record<string, any> = {
          tickets: newTotalTickets,
          weeklyTickets: newWeeklyTickets,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastCheckInDate: today,
          lastCheckInAt: serverTimestamp(),
        };

        if (is7DayBonus) {
          userUpdates.lastStreakBonusStreak = newStreak;
          userUpdates.lastStreakBonusAt = serverTimestamp();
        }

        transaction.update(userDocRef, userUpdates);

        transaction.set(activityDocRef, {
          type: 'daily_checkin',
          ticketsEarned: totalTicketsEarned,
          timestamp: serverTimestamp(),
        });

        return {
          totalTicketsEarned,
          newStreak,
          is7DayBonus,
          newTotalTickets,
          newWeeklyTickets,
        };
      });

      setUser((prev) => ({
        ...prev,
        totalTickets: result.newTotalTickets,
        weeklyTickets: result.newWeeklyTickets,
        currentStreak: result.newStreak,
        longestStreak: Math.max(prev.longestStreak, result.newStreak),
        lastCheckInDate: today,
      }));

      const newActivity: ActivityHistoryItem = {
        id: 'act_' + Date.now(),
        date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        activity: result.is7DayBonus ? '7 Day Bonus' : 'Daily Check-in',
        tickets: result.totalTicketsEarned,
        description: result.is7DayBonus
          ? '7 Day Streak! +5 bonus tickets'
          : `Day ${result.newStreak} daily streak check-in completed`,
      };
      setActivityHistory((prev) => [newActivity, ...prev]);

      const newNotif: AppNotification = {
        id: 'notif_' + Date.now(),
        title: result.is7DayBonus ? '🔥 7-Day Streak Complete!' : '✨ Ticket Collected!',
        message: result.is7DayBonus
          ? '7 Day Streak! +5 bonus tickets awarded.'
          : 'You earned +1 ticket from your daily check-in.',
        time: 'Just now',
        read: false,
        type: 'ticket',
      };
      setNotifications((prev) => [newNotif, ...prev]);

      triggerConfetti();

      const successMsg = result.is7DayBonus ? '7 Day Streak! +5 bonus tickets' : '+1 ticket added';
      showToast(successMsg);

      return {
        success: true,
        message: successMsg,
        ticketsEarned: result.totalTicketsEarned,
        is7DayBonus: result.is7DayBonus,
      };
    } catch (error: any) {
      console.error('Daily check-in transaction error:', error);
      if (error?.message === 'ALREADY_CLAIMED_TODAY' || error?.message?.includes('ALREADY_CLAIMED')) {
        showToast("You've already claimed your ticket today! Resets at midnight.");
        return {
          success: false,
          message: "You've already claimed your ticket today!",
          ticketsEarned: 0,
        };
      }
      const errMsg = error?.message || 'Check-in failed. Please try again.';
      showToast(errMsg);
      return {
        success: false,
        message: errMsg,
        ticketsEarned: 0,
      };
    }
  };

  const saveTodayQuizQuestions = async (questionIds: number[]) => {
    if (!firebaseUser || !isAuthenticated || !questionIds?.length) return;
    const today = getTodayDateString();
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userDocRef, {
        dailyQuizDate: today,
        dailyQuizQuestionIds: questionIds,
      });
      setUser((prev) => ({
        ...prev,
        dailyQuizDate: today,
        dailyQuizQuestionIds: questionIds,
      }));
    } catch (err) {
      console.warn('Could not sync dailyQuizQuestionIds to Firestore:', err);
    }
  };

  const submitQuizScore = async (
    score: number,
    totalQuestions: number,
    questionIds?: number[]
  ): Promise<{ success: boolean; ticketsEarned: number; message: string; alreadyClaimed?: boolean }> => {
    if (!isAuthenticated || !firebaseUser) {
      setAuthModalOpen(true);
      showToast('Please log in with Google to claim quiz tickets.');
      return { success: false, ticketsEarned: 0, message: 'Please log in to submit your quiz.' };
    }

    const today = getTodayDateString();

    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const activityDocRef = doc(collection(db, 'users', firebaseUser.uid, 'activity'));

      const result = await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);

        if (!userDoc.exists()) {
          throw new Error('User document does not exist. Please re-login.');
        }

        const data = userDoc.data();

        if (data.lastQuizRewardDate === today || data.lastQuizDate === today) {
          return {
            alreadyClaimed: true,
            ticketsEarned: 0,
            newTotalTickets: typeof data.tickets === 'number' ? Math.max(0, data.tickets) : 0,
            newWeeklyTickets: typeof data.weeklyTickets === 'number' ? Math.max(0, data.weeklyTickets) : 0,
            updatedRecent: Array.isArray(data.recentQuizQuestionIds) ? data.recentQuizQuestionIds : [],
          };
        }

        const ticketsEarned = 2;
        const currentTickets = Math.max(0, typeof data.tickets === 'number' ? data.tickets : 0);
        const currentWeekly = Math.max(0, typeof data.weeklyTickets === 'number' ? data.weeklyTickets : 0);

        const newTotalTickets = currentTickets + ticketsEarned;
        const newWeeklyTickets = currentWeekly + ticketsEarned;

        const currentRecent: number[] = Array.isArray(data.recentQuizQuestionIds) ? data.recentQuizQuestionIds : [];
        const newIdsToAdd: number[] = Array.isArray(questionIds) ? questionIds : [];
        // Keep up to latest 20 unique question IDs
        const updatedRecent = Array.from(new Set([...currentRecent, ...newIdsToAdd])).slice(-20);

        const userUpdates: Record<string, any> = {
          tickets: newTotalTickets,
          weeklyTickets: newWeeklyTickets,
          lastQuizRewardDate: today,
          lastQuizDate: today,
          lastQuizRewardAt: serverTimestamp(),
          recentQuizQuestionIds: updatedRecent,
          dailyQuizDate: today,
          dailyQuizQuestionIds: newIdsToAdd,
          lastQuizScore: score,
        };

        transaction.update(userDocRef, userUpdates);

        transaction.set(activityDocRef, {
          type: 'daily_quiz',
          ticketsEarned: 2,
          score: score,
          totalQuestions: totalQuestions,
          timestamp: serverTimestamp(),
        });

        return {
          alreadyClaimed: false,
          ticketsEarned: 2,
          newTotalTickets,
          newWeeklyTickets,
          updatedRecent,
        };
      });

      if (result.alreadyClaimed) {
        showToast("Today's quiz reward already claimed.");
        return {
          success: true,
          ticketsEarned: 0,
          message: "Today's quiz reward already claimed.",
          alreadyClaimed: true,
        };
      }

      setUser((prev) => ({
        ...prev,
        totalTickets: result.newTotalTickets,
        weeklyTickets: result.newWeeklyTickets,
        lastQuizDate: today,
        lastQuizRewardDate: today,
        recentQuizQuestionIds: result.updatedRecent,
        dailyQuizDate: today,
        dailyQuizQuestionIds: questionIds || [],
        lastQuizScore: score,
      }));

      const newActivity: ActivityHistoryItem = {
        id: 'act_quiz_' + Date.now(),
        date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        activity: 'Daily Quiz',
        tickets: 2,
        description: `Completed trivia challenge (${score}/${totalQuestions} correct)`,
      };
      setActivityHistory((prev) => [newActivity, ...prev]);

      const newNotif: AppNotification = {
        id: 'notif_' + Date.now(),
        title: '🧠 Daily Quiz Completed',
        message: `You scored ${score}/${totalQuestions} and collected +2 tickets!`,
        time: 'Just now',
        read: false,
        type: 'ticket',
      };
      setNotifications((prev) => [newNotif, ...prev]);

      triggerConfetti();
      showToast('Daily Quiz Completed — +2 Tickets');

      return {
        success: true,
        ticketsEarned: 2,
        message: 'Daily Quiz Completed — +2 Tickets',
        alreadyClaimed: false,
      };
    } catch (error: any) {
      console.error('Daily quiz transaction error:', error);
      const errMsg = error?.message || 'Quiz submission failed. Please try again.';
      showToast(errMsg);
      return {
        success: false,
        ticketsEarned: 0,
        message: errMsg,
      };
    }
  };

  // 6. Submit Diamond Reward Request to Firestore rewardRequests/{requestId}
  const submitDiamondRequest = async (data: {
    freeFireUid: string;
    inGameName: string;
    region: string;
  }): Promise<{ success: boolean; requestId: string; message: string }> => {
    if (!isAuthenticated || !firebaseUser) {
      setAuthModalOpen(true);
      showToast('Please log in with Google to submit reward requests.');
      return {
        success: false,
        requestId: '',
        message: 'Please log in to submit your Free Fire reward claim.',
      };
    }

    const currentRoundId = weeklyRound.roundId;

    try {
      // 1. Verify user is in weeklyRounds/{roundId}/winners/{uid}
      const winnerDocRef = doc(db, 'weeklyRounds', currentRoundId, 'winners', firebaseUser.uid);
      const winnerSnap = await getDoc(winnerDocRef);

      if (!winnerSnap.exists() && !user.isWinnerThisWeek && !winnerClaim) {
        showToast('You have not been selected as a winner for this round.');
        return {
          success: false,
          requestId: '',
          message: 'You have not been selected as a winner for this round.',
        };
      }

      const winnerData = winnerSnap.exists() ? winnerSnap.data() : null;
      const prize = winnerData?.prizeDiamonds || weeklyRound.prizeDiamonds || 100;

      // 2. Prevent duplicate requests: check if a reward request already exists for that uid + roundId
      const rewardRequestsCol = collection(db, 'rewardRequests');
      const existingQuery = query(
        rewardRequestsCol,
        where('uid', '==', firebaseUser.uid),
        where('roundId', '==', currentRoundId)
      );
      const existingSnap = await getDocs(existingQuery);

      if (!existingSnap.empty) {
        const existingDoc = existingSnap.docs[0];
        const existingData = existingDoc.data();
        const existingReqId = existingData.requestId || existingDoc.id;

        // Update state to reflect existing request
        setWinnerClaim({
          roundId: currentRoundId,
          roundTitle: weeklyRound.title,
          prizeDiamonds: prize,
          rewardStatus: (existingData.status || 'pending') as any,
          hasSubmittedRequest: true,
          requestId: existingReqId,
          freeFireUid: existingData.freeFireUid,
          inGameName: existingData.inGameName,
          region: existingData.region,
        });

        showToast(`A reward request (${existingReqId}) already exists for this round.`);
        return {
          success: true,
          requestId: existingReqId,
          message: `A reward request already exists with Request ID: ${existingReqId}.`,
        };
      }

      // 3. Create document in rewardRequests/{requestId}
      const randomCode = Math.floor(10000 + Math.random() * 90000);
      const reqId = `DD-${randomCode}`;
      const rewardRequestRef = doc(db, 'rewardRequests', reqId);

      const requestPayload = {
        requestId: reqId,
        uid: firebaseUser.uid,
        roundId: currentRoundId,
        freeFireUid: data.freeFireUid.trim(),
        inGameName: data.inGameName.trim(),
        region: data.region,
        prizeDiamonds: prize, // Read-only from winner/weekly round doc
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(rewardRequestRef, requestPayload);

      // 4. Update weeklyRounds/{roundId}/winners/{uid} rewardStatus: "request_submitted"
      if (winnerSnap.exists()) {
        try {
          await updateDoc(winnerDocRef, {
            rewardStatus: 'request_submitted',
            freeFireUid: data.freeFireUid.trim(),
            inGameName: data.inGameName.trim(),
            region: data.region,
            requestId: reqId,
            updatedAt: serverTimestamp(),
          });
        } catch (wErr) {
          console.log('Winner doc update note:', wErr);
        }
      }

      // Also update user profile with latest Free Fire UID & in-game name
      await updateUserProfile({
        freeFireUid: data.freeFireUid.trim(),
        inGameName: data.inGameName.trim(),
        region: data.region,
      });

      // Update local winnerClaim state
      setWinnerClaim({
        roundId: currentRoundId,
        roundTitle: weeklyRound.title,
        prizeDiamonds: prize,
        rewardStatus: 'request_submitted',
        hasSubmittedRequest: true,
        requestId: reqId,
        freeFireUid: data.freeFireUid.trim(),
        inGameName: data.inGameName.trim(),
        region: data.region,
      });

      triggerConfetti();
      showToast('Reward request submitted successfully.');

      return {
        success: true,
        requestId: reqId,
        message: 'Reward request submitted successfully.',
      };
    } catch (err: any) {
      console.error('Submit reward request error:', err);
      const errorMsg = err?.message || 'Failed to submit reward request.';
      showToast(errorMsg);
      return {
        success: false,
        requestId: '',
        message: errorMsg,
      };
    }
  };

  // 7. Admin: Update Reward Request Status in Firestore
  const updateRequestStatus = async (
    id: string,
    status: RewardRequestStatus,
    adminNote?: string,
    transactionRef?: string
  ) => {
    if (user.role !== 'admin') {
      showToast('Unauthorized: Admin access required.');
      return;
    }

    try {
      const normalizedStatus = status.toLowerCase();
      const reqDocRef = doc(db, 'rewardRequests', id);
      const updates: Record<string, any> = {
        status: normalizedStatus,
        updatedAt: serverTimestamp(),
      };

      if (adminNote !== undefined) updates.adminNote = adminNote;
      if (transactionRef !== undefined) updates.transactionRef = transactionRef;
      if (normalizedStatus === 'delivered') {
        updates.deliveredAt = serverTimestamp();
      }

      await updateDoc(reqDocRef, updates);

      // Find the request to update the winner record in weeklyRounds
      const targetReq = diamondRequests.find((r) => r.id === id || r.requestId === id);
      if (targetReq && targetReq.userId) {
        try {
          const winnerDocRef = doc(
            db,
            'weeklyRounds',
            targetReq.roundId || weeklyRound.roundId,
            'winners',
            targetReq.userId
          );
          const winnerUpdates: Record<string, any> = {
            rewardStatus: normalizedStatus,
          };
          if (normalizedStatus === 'delivered') {
            winnerUpdates.deliveredAt = serverTimestamp();
          }
          await updateDoc(winnerDocRef, winnerUpdates);
        } catch (wErr) {
          console.log('Update winner rewardStatus note:', wErr);
        }
      }

      showToast(`Request status updated to "${status}"`);
    } catch (err: any) {
      console.error('Update request status error:', err);
      showToast('Error updating status in Firestore.');
    }
  };

  const getRequestById = (reqId: string) => {
    const cleanId = reqId.trim().toUpperCase();
    return diamondRequests.find(
      (r) => r.requestId.toUpperCase() === cleanId || r.id === reqId || r.freeFireUid === reqId
    );
  };

  const updateWeeklyRoundConfig = async (config: Partial<WeeklyRoundConfig>) => {
    if (user.role !== 'admin') {
      showToast('Unauthorized: Admin access required.');
      return;
    }

    try {
      const roundDocRef = doc(db, 'weeklyRounds', weeklyRound.roundId);
      const updates: Record<string, any> = {};

      if (config.prizeDiamonds !== undefined) updates.prizeDiamonds = Number(config.prizeDiamonds);
      if (config.maxWinners !== undefined) {
        updates.maxWinners = Math.max(1, Math.min(10, Math.floor(Number(config.maxWinners))));
      }
      if (config.startDate !== undefined) updates.startAt = config.startDate;
      if (config.endDate !== undefined) updates.endAt = config.endDate;
      if (config.status !== undefined) updates.status = config.status;

      await updateDoc(roundDocRef, updates);
      showToast('Weekly round settings updated in Firestore!');
    } catch (err: any) {
      console.error('Update weekly round error:', err);
      showToast('Error updating weekly round configuration.');
    }
  };

  // 8. Admin: Select Weekly Winners (Randomly draw up to maxWinners unique eligible users)
  const selectWeeklyWinners = async (): Promise<{
    success: boolean;
    message: string;
    winners?: any[];
  }> => {
    if (user.role !== 'admin') {
      showToast('Unauthorized: Admin access required.');
      return { success: false, message: 'Unauthorized: Admin access required.' };
    }

    try {
      // 1. Fetch all eligible users with weeklyTickets > 0
      const usersCol = collection(db, 'users');
      const eligibleQuery = query(usersCol, where('weeklyTickets', '>', 0));
      const snapshot = await getDocs(eligibleQuery);

      const eligibleList: any[] = [];
      snapshot.forEach((d) => {
        eligibleList.push({ uid: d.id, ...d.data() });
      });

      if (eligibleList.length === 0) {
        showToast('No eligible users with tickets found for this round.');
        return { success: false, message: 'No eligible users with tickets found for this round.' };
      }

      // Shuffle using Fisher-Yates algorithm for fair pseudo-random draw
      const shuffled = [...eligibleList];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Pick maxWinners unique eligible winners (or all available if fewer)
      const targetMaxWinners = Math.max(1, Math.min(10, typeof weeklyRound.maxWinners === 'number' ? weeklyRound.maxWinners : 2));
      const selected = shuffled.slice(0, targetMaxWinners);

      // Write winners permanently to weeklyRounds/{roundId}/winners/{uid}
      const batch = writeBatch(db);
      const roundDocRef = doc(db, 'weeklyRounds', weeklyRound.roundId);

      for (const winner of selected) {
        const winnerDocRef = doc(db, 'weeklyRounds', weeklyRound.roundId, 'winners', winner.uid);
        batch.set(winnerDocRef, {
          uid: winner.uid,
          displayName: winner.displayName || 'Survivor',
          email: winner.email || '',
          weeklyTickets: winner.weeklyTickets,
          prizeDiamonds: weeklyRound.prizeDiamonds,
          selectedAt: serverTimestamp(),
          rewardStatus: 'awaiting_request',
        });
      }

      // Update round status to completed and record winnersCount
      batch.update(roundDocRef, {
        status: 'completed',
        winnersCount: selected.length,
      });

      await batch.commit();

      triggerConfetti();
      const msg = `Selected ${selected.length} winner(s) successfully for ${weeklyRound.title}!`;
      showToast(msg);

      return {
        success: true,
        message: msg,
        winners: selected,
      };
    } catch (err: any) {
      console.error('Select winners error:', err);
      const errMsg = err?.message || 'Error selecting weekly winners.';
      showToast(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // 9. Admin: Start New Weekly Round & Reset Users' weeklyTickets in Firestore
  const startNewWeeklyRound = async (): Promise<{ success: boolean; message: string }> => {
    if (user.role !== 'admin') {
      showToast('Unauthorized: Admin access required.');
      return { success: false, message: 'Unauthorized: Admin access required.' };
    }

    try {
      const currentNumber = parseInt(weeklyRound.roundId.replace(/\D/g, '')) || 48;
      const nextNumber = currentNumber + 1;
      const nextRoundId = `round_${nextNumber}`;

      const now = new Date();
      const nextSunday = new Date(now);
      const dayOfWeek = now.getDay();
      const distanceToSunday = (7 - dayOfWeek) % 7 || 7;
      nextSunday.setDate(now.getDate() + distanceToSunday);
      nextSunday.setHours(23, 59, 59, 999);

      // Create new round document in weeklyRounds/{newRoundId}
      const newRoundDocRef = doc(db, 'weeklyRounds', nextRoundId);
      await setDoc(newRoundDocRef, {
        roundId: nextRoundId,
        title: `Weekly Diamond Drop #${nextNumber}`,
        startAt: now.toISOString().split('T')[0],
        endAt: nextSunday.toISOString().split('T')[0],
        status: 'open',
        prizeDiamonds: weeklyRound.prizeDiamonds || 100,
        maxWinners: weeklyRound.maxWinners || 2,
        winnersCount: 0,
        deliveredCount: 0,
        createdAt: serverTimestamp(),
        createdBy: firebaseUser?.uid || 'admin',
      });

      // Reset users' weeklyTickets to 0 (preserving lifetime tickets, streak, and profile)
      const usersCol = collection(db, 'users');
      const activeTicketsQuery = query(usersCol, where('weeklyTickets', '>', 0));
      const usersWithTicketsSnap = await getDocs(activeTicketsQuery);

      if (!usersWithTicketsSnap.empty) {
        const batch = writeBatch(db);
        usersWithTicketsSnap.forEach((userDocSnap) => {
          batch.update(userDocSnap.ref, {
            weeklyTickets: 0,
          });
        });
        await batch.commit();
      }

      // Optimistically update local user state
      setUser((prev) => ({
        ...prev,
        weeklyTickets: 0,
        isWinnerThisWeek: false,
      }));
      setWinnerClaim(null);

      const successMsg = `Started new campaign: Weekly Diamond Drop #${nextNumber}!`;
      showToast(successMsg);
      return { success: true, message: successMsg };
    } catch (err: any) {
      console.error('Start new round error:', err);
      const errMsg = err?.message || 'Failed to start new weekly round.';
      showToast(errMsg);
      return { success: false, message: errMsg };
    }
  };

  const resetWeeklyRound = () => {
    startNewWeeklyRound();
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        firebaseUser,
        isAuthenticated,
        authLoading,
        signInWithGoogle,
        updateUserProfile,
        logout,
        loginWithMock,
        canCheckInToday,
        canPlayQuizToday,
        claimDailyCheckIn,
        submitQuizScore,
        saveTodayQuizQuestions,
        activityHistory,
        weeklyRound,
        previousWinners,
        winnerClaim,
        updateWeeklyRoundConfig,
        resetWeeklyRound,
        selectWeeklyWinners,
        startNewWeeklyRound,
        diamondRequests,
        submitDiamondRequest,
        updateRequestStatus,
        getRequestById,
        eligibleUsers,
        adminStats,
        authModalOpen,
        setAuthModalOpen,
        notificationsModalOpen,
        setNotificationsModalOpen,
        notifications,
        markAllNotificationsAsRead,
        searchedRequestId,
        setSearchedRequestId,
        triggerConfetti,
        activeToast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
