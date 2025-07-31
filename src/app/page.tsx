import { Bar } from "@/features/bar/Bar";
import { CounterContainer } from "@/features/layouts/CounterContainer";

export default function Home() {
  const counters = [
    {
      id: "player1",
      initialValue: 20,
      name: "Naranja",
      backgroundColor: "Naranja",
      icon: "❤️",
    },
    {
      id: "player2",
      initialValue: 20,
      name: "Jugador 2",
      backgroundColor: "#2563eb",
      icon: "💙",
    },
    {
      id: "player3",
      initialValue: 20,
      name: "Jugador 3",
      backgroundColor: "#16a34a",
      icon: "💚",
    },
  ];

  return (
    <div>
      <CounterContainer countersDefault={counters} />
    </div>
  );
}
