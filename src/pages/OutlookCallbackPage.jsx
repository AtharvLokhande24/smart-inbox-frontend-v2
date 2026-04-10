import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function OutlookCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [message, setMessage] = useState("Finalizing Outlook sign-in...");

  useEffect(() => {
    async function completeOAuthLogin() {
      const oauthError = searchParams.get("error");

      if (oauthError) {
        setMessage("Outlook sign-in failed. Redirecting to login...");
        setTimeout(() => {
          navigate(`/login?oauthError=${encodeURIComponent(oauthError)}`, { replace: true });
        }, 1000);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        const user = res.data?.user;

        if (!user?.id) {
          throw new Error("Invalid user details received");
        }

        login(user);
        setMessage("Signed in successfully. Redirecting...");
        navigate("/dashboard", { replace: true });
      } catch (err) {
        const apiError = err.response?.data?.error || err.message || "Outlook sign-in failed";
        setMessage("Could not complete sign-in. Redirecting to login...");
        setTimeout(() => {
          navigate(`/login?oauthError=${encodeURIComponent(apiError)}`, { replace: true });
        }, 1000);
      }
    }

    completeOAuthLogin();
  }, [login, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
        <h1 className="text-xl font-semibold text-slate-900">Outlook Authentication</h1>
        <p className="mt-3 text-sm text-slate-600">{message}</p>
      </div>
    </div>
  );
}

export default OutlookCallbackPage;
