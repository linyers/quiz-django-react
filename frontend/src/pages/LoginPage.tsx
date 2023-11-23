import { useAuthStore } from "../store/auth";

function LoginPage() {
  const requestTokens = useAuthStore((state) => state.requestTokens);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (e.currentTarget.elements[0] as HTMLInputElement).value;
    const password = (e.currentTarget.elements[1] as HTMLInputElement).value;

    requestTokens(email, password);
  };
  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="user@example.com" />
        <input type="password" placeholder="********" />
        <button>Login</button>
      </form>
    </main>
  );
}

export default LoginPage;
