import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

const MOCK_EMAIL = "hung@gmail.com";
const MOCK_PASSWORD = "adbvbfd";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginData: LoginData = {
      email,
      password,
    };

    try {
      // Simulate a login request; replace this with your actual API call
      if (
        loginData.email === MOCK_EMAIL &&
        loginData.password === MOCK_PASSWORD
      ) {
        const data: LoginResponse = { token: "123xyz" };

        // Store token in session storage
        sessionStorage.setItem("authToken", data.token);

        // Redirect to the dashboard or another protected page
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">
          Sign in
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-gray-300 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-gray-300 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required
            />
          </div>

          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
