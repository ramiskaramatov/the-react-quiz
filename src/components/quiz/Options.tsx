import { Button } from "@/components/ui/button";

type OptionsProps = {
  question: {
    options: string[];
    correctOption: number;
  };
  dispatch: React.Dispatch<any>;
  answer: number | null;
};

export default function Options({ question, dispatch, answer }: OptionsProps) {
  const hasAnswered = answer !== null;

  return (
    <div className="space-y-3">
      {question.options.map((option, index) => {
        const isSelected = index === answer;
        const isCorrect = index === question.correctOption;
        const showResult = hasAnswered;

        let buttonClass = "w-full justify-start text-left h-auto py-4 px-6 text-lg transition-all";
        
        if (!showResult) {
          buttonClass += " bg-slate-700 hover:bg-slate-600 hover:translate-x-3";
        } else if (isCorrect) {
          buttonClass += " bg-cyan-500 hover:bg-cyan-500 text-white";
        } else if (isSelected && !isCorrect) {
          buttonClass += " bg-orange-500 hover:bg-orange-500 text-white";
        } else {
          buttonClass += " bg-slate-700/50";
        }

        if (isSelected && !showResult) {
          buttonClass += " translate-x-3";
        }

        return (
          <Button
            key={option}
            className={buttonClass}
            disabled={hasAnswered}
            onClick={() => dispatch({ type: "newAnswer", payload: index })}
            variant="outline"
          >
            {option}
          </Button>
        );
      })}
    </div>
  );
}
