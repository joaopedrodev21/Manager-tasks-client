import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import "./AuthPage.css";

export function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        try {
            await register(name, email, password);
            navigate("/dashboard");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                    err.response?.data?.errors?.[0]?.message ||
                    "Erro ao cadastrar, tente novamente!"
                );
            } else {
                setError("Erro ao cadastrar, tente novamente!");
            }
        }
    }
    return (
        <div className="auth-page min-h-screen flex items-center justify-center px-4 py-10">
            <form onSubmit={handleSubmit} className="auth-card" style={{ maxWidth: "440px" }}>
                <div className="auth-card__header">
                    <h2 className="auth-card__title">Registrar</h2>
                    <p className="auth-card__subtitle">
                        Crie sua conta para começar a gerenciar tarefas imediatamente.
                    </p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <div className="auth-form">
                    <div className="auth-field">
                        <label>Nome</label>
                        <input
                            className="auth-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Email</label>
                        <input
                            className="auth-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label>Senha</label>
                        <div className="auth-password-wrapper">
                            <input
                                className="auth-input"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-button">
                        Registrar
                    </button>
                </div>

                <div className="auth-card__footer">
                    <p className="auth-footer">
                        Já tem conta? <Link to="/login" className="auth-link">Entre aqui</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}