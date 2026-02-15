import { useVoting } from "../context/VotingContext";
import "./StatusMessage.css";

export default function StatusMessage() {
    const { error, success, clearMessages } = useVoting();

    if (!error && !success) return null;

    return (
        <div className={`status-message ${error ? "error" : "success"}`}>
            <span className="status-icon">{error ? "❌" : "✅"}</span>
            <p>{error || success}</p>
            <button className="status-close" onClick={clearMessages}>
                ✕
            </button>
        </div>
    );
}
