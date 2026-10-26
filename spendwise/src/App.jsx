import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

function App() {
  const { token, user, logout } = useAuth();

  useEffect(() => {
    function handleSessionExpired() {
      logout();
    }

    window.addEventListener("spendwise:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener(
        "spendwise:session-expired",
        handleSessionExpired,
      );
    };
  }, [logout]);

  if (!token || !user) {
    return <Login />;
  }

  return (
    <>
      <header className="flex items-center justify-between bg-white px-6 py-3 shadow-sm">
        <span className="font-semibold">Welcome, {user.name}</span>

        <button
          onClick={logout}
          className="rounded-lg border px-4 py-2 hover:bg-gray-50"
        >
          Log out
        </button>
      </header>

      <Dashboard />
    </>
  );
}

export default App;
