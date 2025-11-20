import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type StartScreenProps = {
  numQuestions: number;
  dispatch: React.Dispatch<any>;
  selectedDifficulty: "all" | "easy" | "medium" | "hard";
};

export default function StartScreen({ numQuestions, dispatch, selectedDifficulty }: StartScreenProps) {
  const difficulties: Array<{ value: "all" | "easy" | "medium" | "hard"; label: string; color: string }> = [
    { value: "all", label: "All Levels", color: "bg-slate-600 hover:bg-slate-700" },
    { value: "easy", label: "Easy", color: "bg-green-600 hover:bg-green-700" },
    { value: "medium", label: "Medium", color: "bg-yellow-600 hover:bg-yellow-700" },
    { value: "hard", label: "Hard", color: "bg-red-600 hover:bg-red-700" },
  ];

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div>
        <h2 className="text-4xl font-bold mb-4">Welcome to The React Quiz!</h2>
        <p className="text-2xl text-slate-300">
          {numQuestions} question{numQuestions !== 1 ? "s" : ""} to test your React knowledge
        </p>
      </div>

      <div className="w-full max-w-md">
        <p className="text-lg mb-4 text-slate-300">Select Difficulty:</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {difficulties.map((diff) => (
            <button
              key={diff.value}
              onClick={() => dispatch({ type: "setDifficulty", payload: diff.value })}
              className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                selectedDifficulty === diff.value
                  ? diff.color + " ring-4 ring-white/30"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        size="lg"
        onClick={() => dispatch({ type: "start" })}
        className="text-xl px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
      >
        Let's Start
      </Button>
    </div>
  );
}
