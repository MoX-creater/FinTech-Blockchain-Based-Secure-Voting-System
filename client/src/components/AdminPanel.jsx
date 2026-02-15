import { useState } from "react";
import { useVoting } from "../context/VotingContext";
import "./AdminPanel.css";

export default function AdminPanel() {
    const {
        addCandidate,
        authorizeVoter,
        startElection,
        endElection,
        electionStatus,
        candidates,
        loading,
    } = useVoting();

    const [candidateName, setCandidateName] = useState("");
    const [voterAddress, setVoterAddress] = useState("");

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        if (!candidateName.trim()) return;
        await addCandidate(candidateName.trim());
        setCandidateName("");
    };

    const handleAuthorizeVoter = async (e) => {
        e.preventDefault();
        if (!voterAddress.trim()) return;
        await authorizeVoter(voterAddress.trim());
        setVoterAddress("");
    };

    return (
        <div className="admin-panel">
            <div className="panel-header">
                <h2>⚙️ Admin Dashboard</h2>
                <div className="election-controls">
                    {!electionStatus.started ? (
                        <button
                            className="btn btn-start"
                            onClick={startElection}
                            disabled={loading || candidates.length === 0}
                        >
                            🚀 Start Election
                        </button>
                    ) : !electionStatus.ended ? (
                        <button
                            className="btn btn-end"
                            onClick={endElection}
                            disabled={loading}
                        >
                            🛑 End Election
                        </button>
                    ) : (
                        <span className="status-badge ended">Election Ended</span>
                    )}
                </div>
            </div>

            <div className="admin-grid">
                {/* Add Candidate */}
                <div className="admin-card">
                    <h3>👤 Add Candidate</h3>
                    <form onSubmit={handleAddCandidate}>
                        <input
                            type="text"
                            placeholder="Candidate name"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            disabled={loading || electionStatus.started}
                            className="input"
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || !candidateName.trim() || electionStatus.started}
                        >
                            {loading ? "Adding..." : "Add Candidate"}
                        </button>
                    </form>
                    {electionStatus.started && (
                        <p className="hint">Cannot add candidates after election starts</p>
                    )}
                </div>

                {/* Authorize Voter */}
                <div className="admin-card">
                    <h3>✅ Authorize Voter</h3>
                    <form onSubmit={handleAuthorizeVoter}>
                        <input
                            type="text"
                            placeholder="0x... voter address"
                            value={voterAddress}
                            onChange={(e) => setVoterAddress(e.target.value)}
                            disabled={loading}
                            className="input"
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || !voterAddress.trim()}
                        >
                            {loading ? "Authorizing..." : "Authorize"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Current Candidates */}
            {candidates.length > 0 && (
                <div className="candidates-list">
                    <h3>📋 Registered Candidates</h3>
                    <div className="candidate-chips">
                        {candidates.map((c) => (
                            <span key={c.id} className="candidate-chip">
                                #{c.id} — {c.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
