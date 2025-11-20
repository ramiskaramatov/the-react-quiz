import { useEffect, useReducer } from "react";
import Header from "@/components/quiz/Header";
import Loader from "@/components/quiz/Loader";
import ErrorMessage from "@/components/quiz/Error";
import StartScreen from "@/components/quiz/StartScreen";
import Question from "@/components/quiz/Question";
import FinishScreen from "@/components/quiz/FinishScreen";
import ReviewScreen from "@/components/quiz/ReviewScreen";

type QuestionType = {
  question: string;
  options: string[];
  correctOption: number;
  points: number;
  difficulty: "easy" | "medium" | "hard";
};

type UserAnswer = {
  questionIndex: number;
  selectedOption: number;
  isCorrect: boolean;
};

type State = {
  questions: QuestionType[];
  allQuestions: QuestionType[];
  status: "loading" | "error" | "ready" | "active" | "finished" | "review";
  index: number;
  answer: number | null;
  points: number;
  highscore: number;
  selectedDifficulty: "all" | "easy" | "medium" | "hard";
  userAnswers: UserAnswer[];
  secondsRemaining: number | null;
};

const getHighscore = () => {
  const saved = localStorage.getItem("quizHighscore");
  return saved ? parseInt(saved) : 0;
};

const saveHighscore = (score: number) => {
  localStorage.setItem("quizHighscore", score.toString());
};

const initialState: State = {
  questions: [],
  allQuestions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: getHighscore(),
  selectedDifficulty: "all",
  userAnswers: [],
  secondsRemaining: null,
};

type Action =
  | { type: "dataReceived"; payload: QuestionType[] }
  | { type: "dataFailed" }
  | { type: "setDifficulty"; payload: "all" | "easy" | "medium" | "hard" }
  | { type: "start" }
  | { type: "newAnswer"; payload: number }
  | { type: "nextQuestion" }
  | { type: "previousQuestion" }
  | { type: "exitQuiz" }
  | { type: "finish" }
  | { type: "restart" }
  | { type: "showReview" }
  | { type: "tick" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "dataReceived": {
      const questions = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        questions,
        allQuestions: questions,
        status: "ready",
      };
    }
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "setDifficulty": {
      const filtered =
        action.payload === "all"
          ? state.allQuestions
          : state.allQuestions.filter((q) => q.difficulty === action.payload);
      return {
        ...state,
        selectedDifficulty: action.payload,
        questions: filtered,
      };
    }
    case "start": {
      return state.questions.length > 0
        ? { ...state, status: "active", index: 0, answer: null, points: 0, userAnswers: [], secondsRemaining: state.questions.length * 30 }
        : state;
    }
    case "newAnswer": {
      const question = state.questions[state.index];
      const isCorrect = action.payload === question.correctOption;
      const newUserAnswer: UserAnswer = {
        questionIndex: state.index,
        selectedOption: action.payload,
        isCorrect,
      };
      
      // Check if there's already an answer for this question
      const existingAnswerIndex = state.userAnswers.findIndex(
        (ans) => ans.questionIndex === state.index
      );
      
      const updatedUserAnswers = existingAnswerIndex >= 0
        ? state.userAnswers.map((ans, idx) => 
            idx === existingAnswerIndex ? newUserAnswer : ans
          )
        : [...state.userAnswers, newUserAnswer];
      
      // Calculate points based on whether this is a new answer or replacing one
      let newPoints = state.points;
      if (existingAnswerIndex >= 0) {
        const oldAnswer = state.userAnswers[existingAnswerIndex];
        // Remove old points and add new points
        newPoints = oldAnswer.isCorrect ? state.points - question.points : state.points;
        newPoints = isCorrect ? newPoints + question.points : newPoints;
      } else {
        newPoints = isCorrect ? state.points + question.points : state.points;
      }
      
      return {
        ...state,
        answer: action.payload,
        points: newPoints,
        userAnswers: updatedUserAnswers,
      };
    }
    case "nextQuestion": {
      const nextIndex = state.index + 1;
      const nextAnswer = state.userAnswers.find(
        (ans) => ans.questionIndex === nextIndex
      );
      return {
        ...state,
        index: nextIndex,
        answer: nextAnswer ? nextAnswer.selectedOption : null,
      };
    }
    case "previousQuestion": {
      if (state.index === 0) return state;
      const prevUserAnswer = state.userAnswers.find(
        (ans) => ans.questionIndex === state.index - 1
      );
      return {
        ...state,
        index: state.index - 1,
        answer: prevUserAnswer ? prevUserAnswer.selectedOption : null,
      };
    }
    case "exitQuiz":
      return {
        ...state,
        status: "ready",
        index: 0,
        answer: null,
        points: 0,
        userAnswers: [],
        secondsRemaining: null,
      };
    case "finish": {
      const newHighscore = state.points > state.highscore ? state.points : state.highscore;
      if (state.points > state.highscore) {
        saveHighscore(state.points);
      }
      return {
        ...state,
        status: "finished",
        highscore: newHighscore,
      };
    }
    case "restart":
      return {
        ...state,
        status: "ready",
        index: 0,
        answer: null,
        points: 0,
        userAnswers: [],
        secondsRemaining: null,
      };
    case "showReview":
      return {
        ...state,
        status: "review",
      };
    case "tick": {
      if (state.secondsRemaining === null || state.secondsRemaining <= 0) {
        return state;
      }
      const newSeconds = state.secondsRemaining - 1;
      if (newSeconds === 0) {
        const newHighscore = state.points > state.highscore ? state.points : state.highscore;
        if (state.points > state.highscore) {
          saveHighscore(state.points);
        }
        return {
          ...state,
          status: "finished",
          highscore: newHighscore,
          secondsRemaining: 0,
        };
      }
      return {
        ...state,
        secondsRemaining: newSeconds,
      };
    }
    default:
      return state;
  }
}

export default function Index() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status, index, answer, points, highscore, selectedDifficulty, userAnswers, secondsRemaining } = state;

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.length > 0 ? questions.reduce((acc, q) => acc + q.points, 0) : 0;

  useEffect(() => {
    fetch("/questions.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const qs = Array.isArray(data) ? data : data?.questions ?? [];
        dispatch({ type: "dataReceived", payload: qs });
      })
      .catch((err) => {
        console.error("Failed to load questions:", err);
        dispatch({ type: "dataFailed" });
      });
  }, []);

  useEffect(() => {
    if (status === "active" && secondsRemaining !== null && secondsRemaining > 0) {
      const timer = setInterval(() => {
        dispatch({ type: "tick" });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, secondsRemaining]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-slate-100 p-8">
      <div className="max-w-3xl mx-auto">
        <Header />
        <main className="mt-12">
          {status === "loading" && <Loader />}
          {status === "error" && <ErrorMessage />}
          {status === "ready" && (
            <StartScreen
              numQuestions={numQuestions}
              dispatch={dispatch}
              selectedDifficulty={selectedDifficulty}
            />
          )}
          {status === "active" && questions[index] && (
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
              numQuestions={numQuestions}
              index={index}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              secondsRemaining={secondsRemaining}
            />
          )}
          {status === "finished" && (
            <FinishScreen
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              highscore={highscore}
              dispatch={dispatch}
            />
          )}
          {status === "review" && (
            <ReviewScreen
              questions={questions}
              userAnswers={userAnswers}
              dispatch={dispatch}
            />
          )}
        </main>
      </div>
    </div>
  );
}
