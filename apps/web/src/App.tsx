import { CartCalculator, Rules } from '@/components';

export function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-10 px-5 py-16">
      <header className="space-y-2">
        <h1
          data-testid="app-title"
          className="font-display text-5xl tracking-wide text-foreground sm:text-6xl"
        >
          Back to the Future
        </h1>
        <p className="text-muted-foreground">
          Saisissez les films achetés, un par ligne. Le prix de la commande s&apos;affiche à
          l&apos;encaissement.
        </p>
      </header>
      <CartCalculator />
      <Rules />
    </main>
  );
}
