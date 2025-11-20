import reactLogo from "@/assets/react-logo.png";

export default function Header() {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-4 mb-4">
        <img src={reactLogo} alt="React logo" className="w-16 h-16" />
        <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          The React Quiz
        </h1>
      </div>
    </header>
  );
}
