import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex-1" />
      <div className="flex items-center justify-center flex-1">
        <Image
          src="/noted.svg"
          alt="Noted logo"
          width={120}
          height={40}
          priority
          className="h-8 w-auto sm:h-10"
        />
        <h1 className="sr-only">Noted</h1>
      </div>
      <div className="flex-1 flex justify-end">
        <ThemeToggle />
      </div>
    </header>
  );
}
