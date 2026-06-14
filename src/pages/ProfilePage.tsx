import { Sidebar } from "../components/Sidebar";
import { MobileBottomNav } from "../components/MobileBottomNav";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useTasks } from "../hooks/useTasks";
import { Sun, Moon, User, Mail, Calendar } from "lucide-react";
import "../styles/dashboard-layout.css";
import "../styles/profile.css";

export function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { tasks, loading: tasksLoading } = useTasks();

  const completedTasks = tasks.filter(t => t.done).length;
  const pendingTasks = tasks.length - completedTasks;
  const productivity = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const initials = user?.name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("pt-BR")
    : "—";

  if (authLoading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-layout">
          <Sidebar tasks={tasks} />
          <MobileBottomNav />
          <div className="dashboard-main">
            <main>
              <div className="loading-shell">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Carregando perfil...</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        <Sidebar tasks={tasks} />

        <MobileBottomNav />

        <div className="dashboard-main">
          <main>
            {/* ── Profile Header ── */}
            <div className="dashboard-header">
              <div className="dashboard-header__top">
                <div className="dashboard-header__main">
                  <span className="dashboard-header__badge">Perfil</span>
                  <h1 className="dashboard-header__title">Minha conta</h1>
                  <p className="dashboard-header__description">
                    Visualize suas informações e personalize sua experiência.
                  </p>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-column" style={{ gap: "24px" }}>
                {/* ── User Info Card ── */}
                <div className="dashboard-card" style={{ padding: "32px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px", flexWrap: "wrap" }}>
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "20px",
                        background: "linear-gradient(135deg, #1d4ed8, #60a5fa)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "1.4rem",
                        fontWeight: 800,
                        letterSpacing: "0.02em",
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>
                     <div style={{ minWidth: 0, flex: 1 }}>
                       <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", wordBreak: "break-word" }}>
                         {user?.name}
                       </h2>
                       <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "0.85rem", wordBreak: "break-word" }}>
                         {user?.email}
                       </p>
                     </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div className="profile-info-row">
                      <span className="profile-info-icon">
                        <User size={16} />
                      </span>
                      <span className="profile-info-label">Nome</span>
                      <span className="profile-info-value">{user?.name || "—"}</span>
                    </div>

                    <div className="profile-info-row">
                      <span className="profile-info-icon">
                        <Mail size={16} />
                      </span>
                      <span className="profile-info-label">Email</span>
                      <span className="profile-info-value">{user?.email || "—"}</span>
                    </div>

                    <div className="profile-info-row">
                      <span className="profile-info-icon">
                        <Calendar size={16} />
                      </span>
                      <span className="profile-info-label">Membro desde</span>
                      <span className="profile-info-value">{memberSince}</span>
                    </div>

                  </div>
                </div>

                {/* ── Stats Mini Card ── */}
                <div className="dashboard-card" style={{ padding: "24px" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: "0.88rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                    Resumo das tarefas
                  </h3>
                  {tasksLoading ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Carregando tarefas...</p>
                  ) : (
                  <div className="profile-stats-grid">
                    <div className="profile-stat">
                      <span className="profile-stat__value">{tasks.length}</span>
                      <span className="profile-stat__label">Total</span>
                    </div>
                    <div className="profile-stat">
                      <span className="profile-stat__value" style={{ color: "#22c55e" }}>{completedTasks}</span>
                      <span className="profile-stat__label">Concluídas</span>
                    </div>
                    <div className="profile-stat">
                      <span className="profile-stat__value" style={{ color: "#f59e0b" }}>{pendingTasks}</span>
                      <span className="profile-stat__label">Pendentes</span>
                    </div>
                    <div className="profile-stat">
                      <span className="profile-stat__value" style={{ color: "#60a5fa" }}>{productivity}%</span>
                      <span className="profile-stat__label">Produtividade</span>
                    </div>
                  </div>
                  )}
                </div>
              </div>

              <div className="dashboard-column" style={{ gap: "24px" }}>
                {/* ── Theme Settings ── */}
                <div className="dashboard-card" style={{ padding: "24px" }}>
                  <h3 style={{ margin: "0 0 20px", fontSize: "0.88rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                    Personalização
                  </h3>

                  <div className="profile-theme-card">
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: theme === "dark"
                            ? "rgba(59, 130, 246, 0.15)"
                            : "rgba(245, 158, 11, 0.15)",
                          color: theme === "dark" ? "#60a5fa" : "#f59e0b",
                        }}
                      >
                        {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                          Tema {theme === "dark" ? "Escuro" : "Claro"}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          Alterne entre modo claro e escuro
                        </div>
                      </div>
                      <button
                        type="button"
                        className="profile-theme-toggle"
                        onClick={toggleTheme}
                        aria-label={`Mudar para tema ${theme === "dark" ? "claro" : "escuro"}`}
                      >
                        <span
                          className={`profile-theme-toggle__thumb ${theme === "light" ? "profile-theme-toggle__thumb--light" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  <p style={{ marginTop: "16px", fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                    {theme === "dark"
                      ? "Você está usando o tema escuro. Ideal para ambientes com pouca luz."
                      : "Você está usando o tema claro. Ideal para ambientes bem iluminados."}
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}