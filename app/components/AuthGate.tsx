import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";

interface AuthGateProps {
    children: React.ReactNode;
    validCode: string;
}

export default function AuthGate({ children, validCode }: AuthGateProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedAuth = localStorage.getItem("elliot-auth");
        if (storedAuth === validCode) {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
        }

        // Check URL query parameter
        const urlCode = searchParams.get("code");

        if (urlCode && urlCode === validCode) {
            localStorage.setItem("elliot-auth", validCode);
            setIsAuthenticated(true);
            // Clean up URL
            setSearchParams({});
        }

        setIsLoading(false);
    }, [validCode, searchParams, setSearchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (code === validCode) {
            localStorage.setItem("elliot-auth", validCode);
            setIsAuthenticated(true);
        } else {
            setError("Invalid code. Please try again.");
            setCode("");
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 px-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                    <h1 className="text-3xl font-bold text-center mb-2 text-playful">Welcome</h1>
                    <p className="text-xl text-center text-gray-600 mb-6 text-formal">
                        Enter your invitation code to continue
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="password"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter code"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition font-semibold text-playful text-lg cursor-pointer"
                        >
                            Enter
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
