import { Button } from "@/components/ui/button";

type FinishScreenProps = {
  points: number;
  maxPossiblePoints: number;
  highscore: number;
  dispatch: React.Dispatch<any>;
};

export default function FinishScreen({
  points,
  maxPossiblePoints,
  highscore,
  dispatch,
}: FinishScreenProps) {
  const percentage = (points / maxPossiblePoints) * 100;

  let emoji;
  let message;
  if (percentage === 100) {
    emoji = "🥇";
    message = "Perfect score! You're a React master!";
  } else if (percentage >= 80) {
    emoji = "🎉";
    message = "Excellent work! You know your React!";
  } else if (percentage >= 50) {
    emoji = "🙃";
    message = "Not bad! Keep learning!";
  } else if (percentage > 0) {
    emoji = "🤨";
    message = "You might want to review the basics.";
  } else {
    emoji = "🤦‍♂️";
    message = "Let's try again!";
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur border border-cyan-500/30 rounded-2xl p-8 w-full">
        <span className="text-6xl mb-4 block">{emoji}</span>
        <p className="text-3xl font-bold mb-2">
          You scored <span className="text-cyan-400">{points}</span> out of {maxPossiblePoints}
        </p>
        <p className="text-2xl text-slate-300 mb-4">({Math.ceil(percentage)}%)</p>
        <p className="text-xl text-slate-400">{message}</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 w-full">
        <p className="text-2xl">
          🏆 High Score: <span className="font-bold text-yellow-400">{highscore}</span> points
        </p>
      </div>

      <div className="flex gap-4 w-full">
        <Button
          size="lg"
          onClick={() => dispatch({ type: "showReview" })}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          Review Answers
        </Button>
        <Button
          size="lg"
          onClick={() => dispatch({ type: "restart" })}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          Restart Quiz
        </Button>
      </div>
    </div>
  );
}
