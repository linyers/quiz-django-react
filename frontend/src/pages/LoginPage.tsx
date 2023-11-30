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
    <main className="md:max-w-4xl md:mx-auto mx-6 bg-white shadow-lg border rounded-lg overflow-hidden absolute right-0 left-0 top-32">
      <form
        className="flex flex-col justify-center items-center p-4 gap-5"
        onSubmit={handleSubmit}
      >
        <h2 className="font-bold text-3xl mt-5">Ingresar</h2>
        <div className="flex flex-col">
          <label className="mt-4 mb-2 font-bold text-lg text-gray-900">
            Email
          </label>
          <input
            className="border py-2 px-3 text-grey-800"
            type="email"
            placeholder="user@example.com"
          />
        </div>
        <div className="flex flex-col">
          <label className="mt-4 mb-2 font-bold text-lg text-gray-900">
            Contraseña
          </label>
          <input
            className="border py-2 px-3 text-grey-800"
            type="password"
            placeholder="********"
          />
        </div>
        <button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none my-5  ease-linear transition-all duration-150">
          Ingresar
        </button>
      </form>
    </main>
  );
}

export default LoginPage;
