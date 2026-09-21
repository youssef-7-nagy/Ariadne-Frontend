import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { notify } from "../utils/notify";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

/**
 * OAuthCallback — landing page after a successful Passport OAuth redirect.
 *
 * The backend redirects here with one of two query-string shapes:
 *   Success: /oauth/callback?token=xxx&user=<urlencoded JSON>
 *   Failure: /oauth/callback?error=google_auth_failed
 *
 * On success: saves token + user to localStorage, fires auth-changed event,
 *             then navigates to the appropriate dashboard.
 * On failure: shows a toast and redirects back to /login.
 */
const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userRaw = searchParams.get("user");
    const error = searchParams.get("error");

    // ── Error from backend ────────────────────────────────────────────────────
    if (error || !token) {
      const errorMessages = {
        google_auth_failed: "Google authentication failed. Please try again.",
        facebook_auth_failed: "Facebook authentication failed. Please try again.",
        apple_auth_failed: "Apple authentication failed. Please try again.",
        authentication_failed: "Authentication failed. Please try again.",
        server_error: "A server error occurred. Please try again later.",
      };
      const message =
        errorMessages[error] || "OAuth login failed. Please try again.";
      notify.error(`Error - ${message}`);
      navigate("/login", { replace: true });
      return;
    }

    // ── Success ───────────────────────────────────────────────────────────────
    try {
      const user = JSON.parse(userRaw);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Notify App.jsx to re-read auth state from localStorage
      window.dispatchEvent(new Event("auth-changed"));

      const isAdmin = user?.role === "admin" || user?.role === "superadmin";
      notify.success("Login successfully");

      // Small delay so the toast is visible before navigation
      setTimeout(() => {
        window.location.href = isAdmin ? "/admin" : "/profile";
      }, 100);
    } catch (parseErr) {
      console.error("OAuthCallback: failed to parse user payload", parseErr);
      notify.error("Error - Login failed. Please try again.");
      navigate("/login", { replace: true });
    }
  }, []); // run once on mount

  // Minimal loading UI — only visible for the brief redirect moment
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#0a0a0a",
      }}
    >
      <LoadingSpinner text="Signing in…" />
    </div>
  );
};

export default OAuthCallback;
