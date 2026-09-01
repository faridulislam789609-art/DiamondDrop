import { QuizQuestion } from '../types';
import { QUIZ_QUESTION_BANK } from '../data/quizQuestions';

/**
 * Fisher-Yates shuffle helper
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Prepares a question with shuffled options and updated correctIndex
 */
export function prepareShuffledQuestion(original: QuizQuestion): QuizQuestion {
  const originalCorrectOption = original.options[original.correctIndex];
  const shuffledOptions = shuffleArray(original.options);
  const newCorrectIndex = shuffledOptions.indexOf(originalCorrectOption);

  return {
    ...original,
    options: shuffledOptions,
    correctIndex: newCorrectIndex,
  };
}

/**
 * Gets or generates today's 5 quiz questions for a user
 */
export function getDailyQuizQuestionsForUser(
  userId: string,
  todayDateStr: string,
  recentQuestionIds: number[] = [],
  savedDailyQuestionIds?: number[]
): { questions: QuizQuestion[]; questionIds: number[] } {
  const storageKey = `dd_quiz_${userId || 'guest'}_${todayDateStr}`;

  // 1. Try to load today's saved questions from localStorage to prevent refresh reshuffling
  try {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (
        parsed &&
        parsed.date === todayDateStr &&
        Array.isArray(parsed.questions) &&
        parsed.questions.length === 5
      ) {
        return {
          questions: parsed.questions,
          questionIds: parsed.questionIds || parsed.questions.map((q: QuizQuestion) => q.id),
        };
      }
    }
  } catch (err) {
    console.warn('Failed to parse cached quiz questions:', err);
  }

  // 2. If savedDailyQuestionIds exists from user doc for today, use those specific questions
  if (
    Array.isArray(savedDailyQuestionIds) &&
    savedDailyQuestionIds.length === 5
  ) {
    const matched = savedDailyQuestionIds
      .map((id) => QUIZ_QUESTION_BANK.find((q) => q.id === id))
      .filter((q): q is QuizQuestion => Boolean(q));

    if (matched.length === 5) {
      const preparedQuestions = matched.map((q) => prepareShuffledQuestion(q));
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            date: todayDateStr,
            questionIds: savedDailyQuestionIds,
            questions: preparedQuestions,
          })
        );
      } catch {
        // ignore localStorage quota errors
      }
      return {
        questions: preparedQuestions,
        questionIds: savedDailyQuestionIds,
      };
    }
  }

  // 3. Otherwise, select 5 new random questions excluding recentQuestionIds
  const recentSet = new Set(recentQuestionIds || []);
  let candidatePool = QUIZ_QUESTION_BANK.filter((q) => !recentSet.has(q.id));

  // If candidate pool is too small (< 5), fallback to the entire question bank
  if (candidatePool.length < 5) {
    candidatePool = [...QUIZ_QUESTION_BANK];
  }

  // Shuffle the candidate pool and pick 5
  const shuffledCandidates = shuffleArray(candidatePool);
  const selected = shuffledCandidates.slice(0, 5);

  // Shuffle question order and shuffle their options
  const finalQuestions = selected.map((q) => prepareShuffledQuestion(q));
  const finalQuestionIds = finalQuestions.map((q) => q.id);

  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        date: todayDateStr,
        questionIds: finalQuestionIds,
        questions: finalQuestions,
      })
    );
  } catch {
    // ignore localStorage quota errors
  }

  return {
    questions: finalQuestions,
    questionIds: finalQuestionIds,
  };
}
