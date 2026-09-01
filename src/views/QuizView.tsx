import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Ticket,
  HelpCircle,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DAILY_QUIZ_QUESTIONS } from '../data/mockData';

export const QuizView: React.FC = () => {
  const { user, canPlayQuizToday, submitQuizScore, setActiveTab } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [rewardStatus, setRewardStatus] = useState<{
    message: string;
    ticketsEarned: number;
    alreadyClaimed?: boolean;
  } | null>(null);

  const currentQ = DAILY_QUIZ_QUESTIONS[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / DAILY_QUIZ_QUESTIONS.length) * 100;

  const handleSelectOption = (index: number) => {
    if (showExplanation || isSubmitting) return;
    setSelectedOption(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || isSubmitting) return;
    setShowExplanation(true);
  };

  const handleNextQuestion = async () => {
    if (selectedOption === null || isSubmitting) return;

    const newAnswers = [...userAnswers, selectedOption];
    setUserAnswers(newAnswers);
    setSelectedOption(null);
    setShowExplanation(false);

    if (currentQuestionIndex + 1 < DAILY_QUIZ_QUESTIONS.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // User has completed all 5 questions
      let calculatedScore = 0;
      DAILY_QUIZ_QUESTIONS.forEach((q, idx) => {
        if (newAnswers[idx] === q.correctIndex) {
          calculatedScore++;
        }
      });

      setQuizScore(calculatedScore);
      setIsSubmitting(true);

      try {
        const res = await submitQuizScore(calculatedScore, DAILY_QUIZ_QUESTIONS.length);
        setRewardStatus({
          message: res.message,
          ticketsEarned: res.ticketsEarned,
          alreadyClaimed: res.alreadyClaimed,
        });
      } finally {
        setIsSubmitting(false);
        setIsQuizCompleted(true);
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setShowExplanation(false);
    setIsQuizCompleted(false);
    setQuizScore(0);
    setRewardStatus(null);
  };

  return (
    <div id="daily-quiz-page" className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
          <Brain className="w-4 h-4 text-purple-400" />
          <span>Daily Gaming Trivia Challenge</span>
        </div>
        <h1 className="font-gaming text-3xl sm:text-4xl font-black text-white tracking-wide">
          Daily Free Fire & Tactics Quiz
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Answer 5 tactical questions to earn <strong className="text-cyan-300">+2 Tickets</strong> for this Sunday's diamond giveaway!
        </p>
        {!canPlayQuizToday && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Today's quiz reward already claimed. You can still practice!</span>
          </div>
        )}
      </div>

      {/* Main Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 bg-gradient-to-b from-[#0d122f]/95 to-[#080b1e]/98 shadow-2xl space-y-6">
        {!isQuizCompleted ? (
          <div className="space-y-6">
            {/* Progress Bar & Question Counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="text-purple-300 uppercase tracking-wider font-gaming text-sm">
                  Question {currentQuestionIndex + 1} of {DAILY_QUIZ_QUESTIONS.length}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/30 text-purple-300 text-[11px]">
                  Category: {currentQ.category}
                </span>
              </div>

              {/* Bar */}
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Box */}
            <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/20">
              <h3 className="font-gaming text-xl sm:text-2xl font-bold text-white leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let optionStyle =
                  'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-purple-500/50 hover:bg-slate-800/80';

                if (showExplanation) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                  } else {
                    optionStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle =
                    'bg-purple-900/60 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20';
                }

                return (
                  <button
                    key={idx}
                    id={`quiz-option-${idx}`}
                    onClick={() => handleSelectOption(idx)}
                    disabled={showExplanation || isSubmitting}
                    className={`w-full p-4 rounded-xl border text-left text-sm font-semibold transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg font-gaming text-sm font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{option}</span>
                    </div>

                    {showExplanation && (
                      <div>
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box when revealed */}
            {showExplanation && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 text-xs space-y-1 animate-in fade-in duration-200">
                <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  Tactical Insight:
                </div>
                <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Reward: <strong className="text-cyan-400">+2 Tickets</strong> on completion
              </div>

              {!showExplanation ? (
                <button
                  id="quiz-confirm-btn"
                  onClick={handleConfirmAnswer}
                  disabled={selectedOption === null || isSubmitting}
                  className={`px-6 py-3 rounded-xl font-gaming text-sm font-bold tracking-wider transition-all flex items-center gap-2 ${
                    selectedOption !== null && !isSubmitting
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-500 hover:to-cyan-500 shadow-lg active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Lock In Answer</span>
                </button>
              ) : (
                <button
                  id="quiz-next-btn"
                  onClick={handleNextQuestion}
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-gaming text-sm font-bold tracking-wider shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin text-cyan-200" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>{currentQuestionIndex + 1 === DAILY_QUIZ_QUESTIONS.length ? 'Submit Quiz & View Results' : 'Next Question'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div id="quiz-results-screen" className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 mx-auto shadow-2xl shadow-purple-500/30">
              <div className="w-full h-full rounded-[22px] bg-[#090d24] flex items-center justify-center">
                <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-gaming text-3xl sm:text-4xl font-black text-white tracking-wide">
                Quiz Completed!
              </h2>
              <p className="text-slate-300 text-sm">
                You correctly answered <strong className="text-amber-400 font-bold">{quizScore}</strong> of{' '}
                <strong>5</strong> questions today.
              </p>
            </div>

            {/* Reward Box */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">
                    {rewardStatus?.alreadyClaimed ? 'Daily Status' : 'Reward Status'}
                  </div>
                  <div className="text-sm font-bold text-white">
                    {rewardStatus?.ticketsEarned && rewardStatus.ticketsEarned > 0
                      ? 'Daily Quiz Completed — +2 Tickets'
                      : rewardStatus?.message || "Today's quiz reward already claimed."}
                  </div>
                </div>
              </div>
              <div className="font-gaming text-2xl font-black text-cyan-300">
                {user.weeklyTickets} <span className="text-xs font-sans text-slate-400">Total</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab('tickets')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-gaming text-sm font-bold tracking-wider shadow-lg active:scale-95 flex items-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>View Ticket Ledger</span>
              </button>

              <button
                onClick={handleRestart}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-gaming text-sm font-semibold flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Practice Again</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <span>
          <strong>Fair Play Notice:</strong> Trivia questions are for entertainment and community engagement only. DiamondDrop is an independent project and does not claim any official connection with Garena Free Fire.
        </span>
      </div>
    </div>
  );
};

