import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@git_quest/progress_v1';

const createDefaultProgress = () => ({
  totalXP: 0,
  completedLessons: [],
  quizResults: {},
  earnedAchievements: [],
  updatedAt: new Date().toISOString(),
});

let cachedProgress = null;

const normalizeProgress = (value) => ({
  ...createDefaultProgress(),
  ...(value && typeof value === 'object' ? value : {}),
  completedLessons: Array.isArray(value?.completedLessons) ? value.completedLessons : [],
  quizResults: value?.quizResults && typeof value.quizResults === 'object' ? value.quizResults : {},
  earnedAchievements: Array.isArray(value?.earnedAchievements) ? value.earnedAchievements : [],
  totalXP: Number.isFinite(value?.totalXP) ? Math.max(0, value.totalXP) : 0,
});

const persist = async (progress) => {
  const next = normalizeProgress({ ...progress, updatedAt: new Date().toISOString() });
  cachedProgress = next;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};

export const getProgress = async () => {
  if (cachedProgress) return cachedProgress;
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    cachedProgress = normalizeProgress(stored ? JSON.parse(stored) : null);
  } catch (error) {
    cachedProgress = createDefaultProgress();
  }
  return cachedProgress;
};

export const markLessonCompleted = async (lessonId, xpReward = 0) => {
  if (!lessonId) throw new Error('A lesson ID is required.');
  const current = await getProgress();
  if (current.completedLessons.includes(lessonId)) {
    return { progress: current, newlyCompleted: false, xpAwarded: 0 };
  }
  const xp = Math.max(0, Number(xpReward) || 0);
  const progress = await persist({
    ...current,
    totalXP: current.totalXP + xp,
    completedLessons: [...current.completedLessons, lessonId],
  });
  return { progress, newlyCompleted: true, xpAwarded: xp };
};

export const saveQuizResult = async (quizId, score, totalQuestions, xpReward = 0) => {
  if (!quizId) throw new Error('A quiz ID is required.');
  const current = await getProgress();
  const previous = current.quizResults[quizId];
  const safeScore = Math.max(0, Number(score) || 0);
  const safeTotal = Math.max(0, Number(totalQuestions) || 0);
  const bestScore = Math.max(previous?.score || 0, safeScore);
  const isFirstAttempt = !previous;
  const xp = isFirstAttempt ? Math.max(0, Number(xpReward) || 0) : 0;
  const progress = await persist({
    ...current,
    totalXP: current.totalXP + xp,
    quizResults: {
      ...current.quizResults,
      [quizId]: {
        score: bestScore,
        totalQuestions: safeTotal,
        attempts: (previous?.attempts || 0) + 1,
        completedAt: new Date().toISOString(),
      },
    },
  });
  return { progress, xpAwarded: xp, isFirstAttempt };
};

export const awardAchievement = async (achievementId) => {
  if (!achievementId) throw new Error('An achievement ID is required.');
  const current = await getProgress();
  if (current.earnedAchievements.includes(achievementId)) return current;
  return persist({
    ...current,
    earnedAchievements: [...current.earnedAchievements, achievementId],
  });
};

export const resetProgress = async () => {
  cachedProgress = createDefaultProgress();
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cachedProgress));
  return cachedProgress;
};
