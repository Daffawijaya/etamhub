import LoginForm from "@/components/auth/LoginForm";
import LoginHero from "@/components/auth/LoginHero";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white transition-colors dark:bg-dark">
      <div className="grid min-h-screen lg:grid-cols-5">
        <div className="lg:col-span-2">
          <LoginHero />
        </div>

        <div className="lg:col-span-3">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
