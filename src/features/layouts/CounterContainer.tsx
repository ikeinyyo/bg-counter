import { Counter } from "./Counter";

type CounterConfig = {
  id: string;
  initialValue: number;
  name?: string;
  backgroundColor?: string;
  icon?: string;
};

type Props = {
  counters: CounterConfig[];
};

const CounterContainer = ({ counters }: Props) => {
  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Contador de Vidas
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {counters.map((counter) => (
            <Counter
              key={counter.id}
              counter={counter.initialValue}
              name={counter.name}
              backgroundColor={counter.backgroundColor}
              icon={counter.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { CounterContainer };
