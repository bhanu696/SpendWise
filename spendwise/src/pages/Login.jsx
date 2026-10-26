
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login, register } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl border bg-white p-8 shadow-sm"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            SpendWise
          </h1>
          <p className="mt-2 text-gray-500">
            {isRegistering
              ? "Create your account"
              : "Sign in to your account"}
          </p>
        </div>

        {isRegistering && (
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Full name"
            autoComplete="name"
            maxLength={80}
            required
            className="w-full rounded-lg border p-3"
          />
        )}

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          autoComplete="email"
          required
          className="w-full rounded-lg border p-3"
        />

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete={isRegistering ? "new-password" : "current-password"}
          minLength={isRegistering ? 8 : undefined}
          maxLength={128}
          required
          className="w-full rounded-lg border p-3"
        />

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : isRegistering
              ? "Create account"
              : "Log in"}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsRegistering((previous) => !previous);
            setError("");
          }}
          className="w-full text-sm text-blue-600"
        >
          {isRegistering
            ? "Already have an account? Log in"
            : "New to SpendWise? Create an account"}
        </button>
      </form>
    </main>
  );
}

export default Login;
