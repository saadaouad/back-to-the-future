import { Header, CartCalculator, Rules } from '@/components';

export function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-10 px-5 py-16">
      <Header />
      <CartCalculator />
      <Rules />
    </main>
  );
}
