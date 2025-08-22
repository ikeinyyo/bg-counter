import Link from "next/link";

type Props = {
  isWakeLockActive: boolean;
  activateWakeLock: () => void;
};

const Footer = ({ isWakeLockActive, activateWakeLock }: Props) => {
  return (
    <footer className="flex items-center justify-end p-2 bg-dark text-white h-8">
      <span className="text-xs">
        Copyright © 2025{" "}
        <Link
          className="text-primary hover:text-white transition-colors text-bold cursor-pointer"
          href="https://juernesdemesa.com"
        >
          Juernes de Mesa
        </Link>
        . All rights reserved.
      </span>
      <button
        className={`w-4 h-4 ml-2 rounded-full ${
          isWakeLockActive ? "bg-green-500 " : "bg-red-500"
        }`}
        onClick={activateWakeLock}
      />
    </footer>
  );
};

export { Footer };
