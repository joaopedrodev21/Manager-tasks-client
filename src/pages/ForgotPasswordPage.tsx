import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/auth.service";
import axios from "axios";
import "./AuthPage.css";

export function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            setSent(true);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Erro ao enviar email");
            } else {
                setError("Erro ao enviar email");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page min-h-screen px-4">
            <div className="auth-grid w-full">
                <form onSubmit={handleSubmit} className="auth-card">
                    <div className="auth-card__content">
                        <h2 className="auth-card__title">Esqueceu sua senha?</h2>
                        <p className="auth-card__subtitle">
                            Digite seu email e enviaremos um link para criar uma nova senha.
                        </p>
                    </div>

                    {sent ? (
                        <div className="auth-success">
                            Email enviado! Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                        </div>
                    ) : (
                        <>
                            {error && <div className="auth-error">{error}</div>}

                            <div className="auth-form">
                                <div className="auth-field">
                                    <label>Email</label>
                                    <input
                                        className="auth-input"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="auth-button" disabled={loading}>
                                    {loading ? "Enviando..." : "Enviar link de recuperação"}
                                </button>
                            </div>
                        </>
                    )}

                    <p className="auth-footer">
                        <Link to="/login" className="auth-link">← Voltar ao login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}