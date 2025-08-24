const CounterLoading = () => {
  return (
    <main
      className="bg-white min-h-[calc(100vh-3.5rem-2rem)] flex items-center justify-center"
      role="status"
      aria-busy="true"
      aria-label="Loading counters"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 blur-xl opacity-30 rounded-full bg-primary" />
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm md:text-base text-dark">
            Loading counters...
            <span className="inline-flex items-center ml-2 align-middle">
              <span
                className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="h-2.5 w-2.5 rounded-full bg-primary/70 animate-bounce ml-1.5"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="h-2.5 w-2.5 rounded-full bg-primary/50 animate-bounce ml-1.5"
                style={{ animationDelay: "300ms" }}
              />
            </span>
          </p>
          <p className="mt-2 text-xs text-gray-500">It won't take long</p>
        </div>
      </div>
    </main>
  );
};
export { CounterLoading };
