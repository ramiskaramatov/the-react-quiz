import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ArrowLeft } from "lucide-react";
import Options from "./Options";
import Timer from "./Timer";

type QuestionProps = {
  question: {
    question: string;
    options: string[];
    correctOption: number;
    points: number;
    difficulty: string;
  };
  dispatch: React.Dispatch<any>;
  answer: number | null;
  numQuestions: number;
  index: number;
  points: number;
  maxPossiblePoints: number;
  secondsRemaining: number | null;
  totalSeconds: number | null;
};

export default function Question({
  question,
  dispatch,
  answer,
  numQuestions,
  index,
  points,
  maxPossiblePoints,
  secondsRemaining,
  totalSeconds,
}: QuestionProps) {
  const progressValue = ((index + Number(answer !== null)) / numQuestions) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-300 border-green-500";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500";
      case "hard":
        return "bg-red-500/20 text-red-300 border-red-500";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 space-y-4">
        <div className="flex justify-end mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: "exitQuiz" })}
            className="hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Progress value={progressValue} className="h-3" />
        <div className="flex justify-between items-center text-lg">
          <p>
            Question <strong>{index + 1}</strong> / {numQuestions}
          </p>
          <div className="flex items-center gap-6">
            {secondsRemaining !== null && totalSeconds !== null && (
              <Timer secondsRemaining={secondsRemaining} totalSeconds={totalSeconds} />
            )}
            <p>
              <strong>{points}</strong> / {maxPossiblePoints} points
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-2xl font-semibold leading-relaxed flex-1">{question.question}</h4>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
        </div>
        <Options question={question} dispatch={dispatch} answer={answer} />
      </div>

      {answer !== null && (
        <div className="flex justify-between items-center">
          {index > 0 && (
            <Button
              size="lg"
              onClick={() => dispatch({ type: "previousQuestion" })}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
          <Button
            size="lg"
            onClick={() =>
              dispatch(
                index < numQuestions - 1 ? { type: "nextQuestion" } : { type: "finish" }
              )
            }
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 ml-auto"
          >
            {index < numQuestions - 1 ? "Next Question →" : "Finish Quiz"}
          </Button>
        </div>
      )}
    </div>
  );
}
