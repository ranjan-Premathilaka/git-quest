import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { Card, Badge, Button } from '../components';
import { gitBasicsQuiz } from '../data/quizData';
import { getProgress, saveQuizResult } from '../services/progressService';

export default function QuizScreen({ navigation }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [savedResult, setSavedResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [bestScore, setBestScore] = useState(null);

  const question = gitBasicsQuiz.questions[questionIndex];
  const total = gitBasicsQuiz.questions.length;
  const score = answers.reduce((sum, answer) => sum + (answer.correct ? 1 : 0), 0);

  useEffect(() => {
    getProgress().then((progress) => {
      const previous = progress.quizResults[gitBasicsQuiz.id];
      if (previous) setBestScore(previous.score);
    }).catch(() => {});
  }, []);

  const chooseAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setAnswers((current) => [...current, { correct: index === question.answer }]);
  };

  const finishQuiz = async () => {
    const finalAnswers = [...answers];
    const finalScore = finalAnswers.filter((answer) => answer.correct).length;
    setSaving(true);
    try {
      const result = await saveQuizResult(gitBasicsQuiz.id, finalScore, total, gitBasicsQuiz.xpReward);
      setSavedResult(result);
      setBestScore(result.progress.quizResults[gitBasicsQuiz.id].score);
      setFinished(true);
    } catch (error) {
      console.warn('Unable to save quiz result:', error);
      setFinished(true);
    } finally {
      setSaving(false);
    }
  };

  const nextQuestion = () => {
    if (questionIndex === total - 1) {
      finishQuiz();
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
  };

  const restartQuiz = () => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setFinished(false);
    setSavedResult(null);
  };

  if (finished) {
    const finalScore = answers.filter((answer) => answer.correct).length;
    const percent = Math.round((finalScore / total) * 100);
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Button title="← Dashboard" variant="secondary" size="sm" onPress={() => navigation.navigate(ROUTES.DASHBOARD)} />
          <Card style={styles.resultCard} variant="elevated">
            <Text style={styles.resultIcon}>{percent >= 70 ? '🏆' : '💪'}</Text>
            <Text style={styles.resultTitle}>{percent >= 70 ? 'Quest Completed!' : 'Keep Practising!'}</Text>
            <Text style={styles.resultScore}>{finalScore}/{total}</Text>
            <Text style={styles.resultSubtitle}>You answered {percent}% correctly.</Text>
            {savedResult && <Badge label={savedResult.xpAwarded > 0 ? `+${savedResult.xpAwarded} XP earned` : 'Quiz completed • no repeat XP'} variant="gitRelease" />}
            {!savedResult && <Text style={styles.muted}>Your result could not be saved. Please check your device storage.</Text>}
            {bestScore !== null && <Text style={styles.muted}>Best score: {bestScore}/{total}</Text>}
            <Button title="Try Again" onPress={restartQuiz} style={styles.fullButton} />
            <Button title="Back to Dashboard" variant="outline" onPress={() => navigation.navigate(ROUTES.DASHBOARD)} style={styles.fullButton} />
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Button title="← Dashboard" variant="secondary" size="sm" onPress={() => navigation.navigate(ROUTES.DASHBOARD)} />
          <Badge label={`+${gitBasicsQuiz.xpReward} XP`} variant="gitRelease" />
        </View>
        <Text style={styles.eyebrow}>GIT QUEST • KNOWLEDGE CHECK</Text>
        <Text style={styles.title}>{gitBasicsQuiz.title}</Text>
        <Text style={styles.description}>{gitBasicsQuiz.description}</Text>
        <View style={styles.progressMeta}>
          <Text style={styles.muted}>QUESTION {questionIndex + 1} OF {total}</Text>
          <Text style={styles.muted}>{Math.round(((questionIndex + 1) / total) * 100)}%</Text>
        </View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${((questionIndex + 1) / total) * 100}%` }]} /></View>
        <Card style={styles.questionCard} variant="elevated">
          <Text style={styles.questionNumber}>QUESTION {String(questionIndex + 1).padStart(2, '0')}</Text>
          <Text style={styles.question}>{question.question}</Text>
          {question.options.map((option, index) => {
            const selected = selectedAnswer === index;
            const correct = selectedAnswer !== null && index === question.answer;
            const wrong = selected && index !== question.answer;
            return (
              <TouchableOpacity key={`${question.id}-${index}`} activeOpacity={0.75} disabled={selectedAnswer !== null} onPress={() => chooseAnswer(index)} style={[styles.option, correct && styles.correctOption, wrong && styles.wrongOption, selected && !wrong && styles.selectedOption]}>
                <Text style={[styles.optionLetter, correct && styles.correctText, wrong && styles.wrongText]}>{String.fromCharCode(65 + index)}</Text>
                <Text style={[styles.optionText, correct && styles.correctText, wrong && styles.wrongText]}>{option}</Text>
                {correct && <Text style={styles.feedbackMark}>✓</Text>}
                {wrong && <Text style={styles.feedbackMark}>✕</Text>}
              </TouchableOpacity>
            );
          })}
          {selectedAnswer !== null && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationTitle}>{selectedAnswer === question.answer ? 'Correct answer!' : 'Not quite!'}</Text>
              <Text style={styles.explanation}>{question.explanation}</Text>
            </View>
          )}
          <Button title={questionIndex === total - 1 ? 'Finish Quiz →' : 'Next Question →'} onPress={nextQuestion} disabled={selectedAnswer === null || saving} style={styles.fullButton} />
        </Card>
        <Text style={styles.footerNote}>Choose one answer. You will see an explanation after each question.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background, paddingTop: 4 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  eyebrow: { ...typography.caption, color: colors.accent, marginBottom: spacing.xs },
  title: { ...typography.h2, marginBottom: spacing.xs },
  description: { ...typography.body, marginBottom: spacing.lg },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  muted: { ...typography.bodySmall, marginTop: spacing.sm },
  progressTrack: { height: 7, borderRadius: borderRadius.full, backgroundColor: colors.surfaceLight, overflow: 'hidden', marginBottom: spacing.lg },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: borderRadius.full },
  questionCard: { padding: spacing.lg },
  questionNumber: { ...typography.caption, color: colors.primaryLight, marginBottom: spacing.md },
  question: { ...typography.h3, lineHeight: 28, marginBottom: spacing.lg },
  option: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: spacing.sm },
  selectedOption: { borderColor: colors.primary, backgroundColor: colors.badgeBackground },
  correctOption: { borderColor: colors.success, backgroundColor: 'rgba(16,185,129,0.12)' },
  wrongOption: { borderColor: colors.error, backgroundColor: 'rgba(239,68,68,0.12)' },
  optionLetter: { color: colors.primaryLight, fontFamily: typography.fontFamily.code, fontWeight: '700', marginRight: spacing.md },
  optionText: { flex: 1, color: colors.textPrimary, fontSize: typography.sizes.sm, lineHeight: 20 },
  correctText: { color: colors.success },
  wrongText: { color: colors.error },
  feedbackMark: { fontWeight: '700', marginLeft: spacing.sm, color: colors.textPrimary },
  explanationBox: { padding: spacing.md, borderRadius: borderRadius.md, backgroundColor: colors.codeBackground, marginTop: spacing.sm, marginBottom: spacing.md },
  explanationTitle: { color: colors.accentLight, fontWeight: '700', marginBottom: spacing.xs },
  explanation: { ...typography.bodySmall, color: colors.textSecondary },
  fullButton: { width: '100%', marginTop: spacing.md },
  footerNote: { ...typography.bodySmall, textAlign: 'center', marginTop: spacing.md },
  resultCard: { alignItems: 'center', padding: spacing.xl, marginTop: spacing.xl },
  resultIcon: { fontSize: 52, marginBottom: spacing.md },
  resultTitle: { ...typography.h2, textAlign: 'center' },
  resultScore: { fontSize: 48, fontWeight: '800', color: colors.primaryLight, marginTop: spacing.md },
  resultSubtitle: { ...typography.body, marginBottom: spacing.md },
});
