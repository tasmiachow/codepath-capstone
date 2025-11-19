import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      setLoading(true);
      try {
        const [meRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/api/auth/me`, { headers }),
          fetch(`${API_BASE}/api/user-game-stats`, { headers }),
        ]);

        if (meRes.ok && mounted) {
          const meJson = await meRes.json();
          setUser(meJson.user ?? null);
        }

        if (!statsRes.ok) {
          // if endpoint missing return empty sessions
          if (mounted) setSessions([]);
        } else {
          const statsJson = await statsRes.json();
          // accept either { sessions: [...] } or array directly
          const s = Array.isArray(statsJson)
            ? statsJson
            : statsJson.sessions ?? [];
          if (mounted) setSessions(s);
        }
      } catch (err) {
        console.error("dashboard fetch error", err);
        if (mounted) setError("Failed to load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = sessions.length;
    const scores = sessions
      .map((s) => Number(s.score ?? 0))
      .filter((v) => !Number.isNaN(v));
    const best = scores.length ? Math.max(...scores) : null;
    const avg = scores.length
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) /
        10
      : null;
    const last = sessions.length
      ? sessions[0]?.datePlayed ?? sessions[0]?.created_at ?? null
      : null;
    return { total, best, avg, last };
  }, [sessions]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">
          {user ? `Welcome, ${user.username || user.email}` : "Dashboard"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Your recent activity and game stats.
        </p>
      </header>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-base-100 p-4 shadow">
          <div className="text-sm text-gray-500">Games Played</div>
          <div className="text-2xl font-semibold">
            {loading ? "…" : stats.total}
          </div>
        </div>

        <div className="card bg-base-100 p-4 shadow">
          <div className="text-sm text-gray-500">Average Score</div>
          <div className="text-2xl font-semibold">
            {loading ? "…" : stats.avg ?? "—"}
          </div>
        </div>

        <div className="card bg-base-100 p-4 shadow">
          <div className="text-sm text-gray-500">Best Score</div>
          <div className="text-2xl font-semibold">
            {loading ? "…" : stats.best ?? "—"}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {stats.last ? `Last: ${new Date(stats.last).toLocaleString()}` : ""}
          </div>
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Recent Sessions</h2>
          <Link to="/games" className="btn btn-sm btn-primary">
            Browse Games
          </Link>
        </div>

        {loading ? (
          <div className="text-gray-500">Loading sessions…</div>
        ) : sessions.length === 0 ? (
          <div className="text-gray-600">
            No sessions yet.{" "}
            <Link to="/games" className="link">
              Play a game
            </Link>
            .
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.slice(0, 10).map((s) => (
              <div
                key={s.id ?? s._id ?? `${s.gameId}-${s.datePlayed}`}
                className="flex items-center justify-between p-3 bg-base-200 rounded"
              >
                <div>
                  <div className="font-medium">
                    {s.gameName ?? s.game ?? `Game ${s.gameId ?? ""}`}
                  </div>
                  <div className="text-sm text-gray-500">
                    {s.datePlayed
                      ? new Date(s.datePlayed).toLocaleString()
                      : s.created_at
                      ? new Date(s.created_at).toLocaleString()
                      : ""}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{s.score ?? "—"}</div>
                  <div className="text-sm text-gray-500">score</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
