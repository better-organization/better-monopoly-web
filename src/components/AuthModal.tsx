import { useState } from "react";
import Button from "./Button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (token: string) => void;
}

interface LoginFormData {
  userId: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  userId: string;
  password: string;
  confirmPassword: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onAuthenticate,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    userId: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    username: "",
    userId: "",
    password: "",
    confirmPassword: "",
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleTabChange = (newTab: "login" | "register") => {
    if (newTab === activeTab || isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(newTab);
    }, 125);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 250);
  };

  if (!isOpen && !isClosing) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: loginForm.userId,
          password: loginForm.password,
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || `Login failed (${res.status})`);
      }

      const data = await res.json().catch(() => null);
      const message = data?.data?.message ?? "Logged in successfully.";

      alert(message);
      onAuthenticate("logged-in");
      setLoginForm({ userId: "", password: "" });
      handleClose();
    } catch (error) {
      console.error("Login failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          username: registerForm.username,
          password: registerForm.password,
          userId: registerForm.userId,
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || `Registration failed (${res.status})`);
      }

      const data = await res.json().catch(() => null);
      const message =
        data?.data?.message ??
        "User registered successfully. Please login to continue.";

      alert(message);
      setRegisterForm({
        username: "",
        userId: "",
        password: "",
        confirmPassword: "",
      });
      handleTabChange("login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Backdrop with blur */}
      <div
        className={`absolute inset-0 bg-black backdrop-blur-sm transition-all duration-300 ${
          isClosing ? "bg-opacity-0" : "bg-opacity-50"
        }`}
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div
        className={`relative w-[90%] max-w-md h-[80%] max-h-[600px] bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden border border-gray-600 transition-all duration-300 transform ${
          isClosing
            ? "scale-0 translate-y-8 opacity-0 origin-bottom"
            : "scale-100 translate-y-0 opacity-100 origin-bottom"
        } ${!isClosing && isOpen ? "animate-modalEnter" : ""}`}
      >
        <style jsx>{`
          @keyframes modalEnter {
            0% {
              transform: scale(0.3) translateY(30px) rotate(-2deg);
              opacity: 0;
              filter: blur(4px);
            }
            60% {
              transform: scale(1.02) translateY(-8px) rotate(0deg);
              opacity: 0.9;
              filter: blur(0px);
            }
            100% {
              transform: scale(1) translateY(0) rotate(0deg);
              opacity: 1;
              filter: blur(0px);
            }
          }

          @keyframes tabSlideFromLeft {
            0% {
              transform: translateX(-100%) scale(0.95);
              opacity: 0;
              filter: blur(2px);
            }
            100% {
              transform: translateX(0) scale(1);
              opacity: 1;
              filter: blur(0px);
            }
          }

          @keyframes tabSlideFromRight {
            0% {
              transform: translateX(100%) scale(0.95);
              opacity: 0;
              filter: blur(2px);
            }
            100% {
              transform: translateX(0) scale(1);
              opacity: 1;
              filter: blur(0px);
            }
          }

          .animate-modalEnter {
            animation: modalEnter 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          .animate-slideFromLeft {
            animation: tabSlideFromLeft 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .animate-slideFromRight {
            animation: tabSlideFromRight 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>
        {/* Header */}
        {/* Tabs */}
        <div className="flex border-b border-gray-600 relative">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-250 ease-out relative z-10 ${
              activeTab === "login"
                ? "text-green-400 transform scale-[1.02] font-semibold"
                : "text-gray-300 hover:text-green-300 hover:transform hover:scale-[1.01]"
            }`}
            onClick={() => handleTabChange("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-250 ease-out relative z-10 ${
              activeTab === "register"
                ? "text-green-400 transform scale-[1.02] font-semibold"
                : "text-gray-300 hover:text-green-300 hover:transform hover:scale-[1.01]"
            }`}
            onClick={() => handleTabChange("register")}
          >
            Register
          </button>
          {/* Active tab indicator */}
          <div
            className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-400 to-green-500 transition-all duration-250 ease-out transform ${
              activeTab === "login"
                ? "w-1/2 translate-x-0"
                : "w-1/2 translate-x-full"
            }`}
          />
          {/* Background indicator */}
          <div
            className={`absolute inset-0 bg-gray-700 bg-opacity-30 transition-all duration-250 ease-out transform ${
              activeTab === "login"
                ? "w-1/2 translate-x-0 rounded-tl-md"
                : "w-1/2 translate-x-full rounded-tr-md"
            }`}
          />
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto relative">
          <div
            className={`transition-all duration-250 ease-out transform ${
              isTransitioning
                ? activeTab === "login"
                  ? "opacity-0 translate-x-8 scale-98 blur-sm"
                  : "opacity-0 -translate-x-8 scale-98 blur-sm"
                : `opacity-100 translate-x-0 scale-100 blur-0 ${
                    activeTab === "login"
                      ? "animate-slideFromRight"
                      : "animate-slideFromLeft"
                  }`
            }`}
          >
            {activeTab === "login" ? (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-userId"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    User ID
                  </label>
                  <input
                    id="login-userId"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-500 bg-gray-700 bg-opacity-50 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    placeholder="Enter your user ID"
                    value={loginForm.userId}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        userId: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type="password"
                      required
                      className="w-full px-3 py-2 border border-gray-500 bg-gray-700 bg-opacity-50 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={isLoading}
                  variant="primary"
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-6 shadow-lg"
                >
                  Login
                </Button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label
                    htmlFor="register-username"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Username
                  </label>
                  <input
                    id="register-username"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-500 bg-gray-700 bg-opacity-50 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    placeholder="Choose a username"
                    value={registerForm.username}
                    onChange={(e) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="register-userId"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    User ID
                  </label>
                  <input
                    id="register-userId"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-500 bg-gray-700 bg-opacity-50 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    placeholder="Choose a unique user ID"
                    value={registerForm.userId}
                    onChange={(e) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        userId: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="register-password"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="register-password"
                      type="password"
                      required
                      className="w-full px-3 py-2 border border-gray-500 bg-gray-700 bg-opacity-50 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      placeholder="Create a password"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="register-confirmPassword"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="register-confirmPassword"
                      type="password"
                      required
                      className="w-full px-3 py-2 border border-gray-500 bg-gray-700 bg-opacity-50 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                      placeholder="Confirm your password"
                      value={registerForm.confirmPassword}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={isLoading}
                  variant="primary"
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-6 shadow-lg"
                >
                  Register
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
