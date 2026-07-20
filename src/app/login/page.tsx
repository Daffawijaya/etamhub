import LoginForm from "@/components/auth/LoginForm";
import LoginHero from "@/components/auth/LoginHero";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-dark transition-colors">
      <div className="grid min-h-screen lg:grid-cols-2">
        <LoginForm />
        <LoginHero />
      </div>
    </main>
  );
}