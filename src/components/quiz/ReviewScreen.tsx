import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type Question = {
  question: string;
  options: string[];
  correctOption: number;
  points: number;
  difficulty: string;
};

type UserAnswer = {
  questionIndex: number;
  selectedOption: number;
  isCorrect: boolean;
};

type ReviewScreenProps = {
  questions: Question[];
  userAnswers: UserAnswer[];
  dispatch: React.Dispatch<any>;
};

export default function ReviewScreen({ questions, userAnswers, dispatch }: ReviewScreenProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-2">Answer Review</h2>
        <p className="text-xl text-slate-300">
          You got {userAnswers.filter((a) => a.isCorrect).length} out of {questions.length} correct
        </p>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-6">
          {questions.map((question, qIndex) => {
            const userAnswer = userAnswers.find((a) => a.questionIndex === qIndex);
            const isCorrect = userAnswer?.isCorrect ?? false;
            const selectedOption = userAnswer?.selectedOption ?? -1;

            return (
              <div
                key={qIndex}
                className={`bg-slate-800/50 backdrop-blur rounded-2xl p-6 border-2 ${
                  isCorrect ? "border-green-500/50" : "border-red-500/50"
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">{isCorrect ? "✅" : "❌"}</span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-400 mb-2">Question {qIndex + 1}</p>
                    <h4 className="text-xl font-semibold mb-4">{question.question}</h4>
                  </div>
                </div>

                <div className="space-y-2">
                  {question.options.map((option, oIndex) => {
                    const isUserSelection = oIndex === selectedOption;
                    const isCorrectOption = oIndex === question.correctOption;

                    let optionClass = "p-3 rounded-lg ";
                    if (isCorrectOption) {
                      optionClass += "bg-green-500/20 border-2 border-green-500 text-green-300";
                    } else if (isUserSelection && !isCorrect) {
                      optionClass += "bg-red-500/20 border-2 border-red-500 text-red-300";
                    } else {
                      optionClass += "bg-slate-700/30 text-slate-400";
                    }

                    return (
                      <div key={oIndex} className={optionClass}>
                        <div className="flex items-center gap-2">
                          {isCorrectOption && <span>✓</span>}
                          {isUserSelection && !isCorrect && <span>✗</span>}
                          <span>{option}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-sm text-slate-400">
                    <span className="font-semibold">Points:</span> {question.points} •{" "}
                    <span className="font-semibold">Difficulty:</span>{" "}
                    <span className="capitalize">{question.difficulty}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={() => dispatch({ type: "restart" })}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          Take Quiz Again
        </Button>
      </div>
    </div>
  );
}
