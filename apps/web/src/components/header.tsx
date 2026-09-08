export function Header() {
  return (
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
  );
}
