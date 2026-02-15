import { useVoting } from "../context/VotingContext";
import "./VotingStation.css";

export default function VotingStation() {
    const { candidates, vote, voterInfo, electionStatus, loading } = useVoting();

    if (!electionStatus.started) {
        return (
            <div className="voting-station">
                <div className="station-placeholder">
                    <span className="placeholder-icon">⏳</span>
                    <h3>Election has not started yet</h3>
                    <p>Please wait for the admin to start the election.</p>
                </div>
            </div>
        );
    }

    if (electionStatus.ended) {
        return null; // Results component will handle this
    }

    return (
        <div className="voting-station">
            <h2>🗳️ Cast Your Vote</h2>

            {!voterInfo.authorized && (
                <div className="alert alert-warning">
                    <span>⚠️</span> You are not authorized to vote. Please contact the election admin.
                </div>
            )}

            {voterInfo.voted && (
                <div className="alert alert-success">
                    <span>✅</span> You have already cast your vote. Thank you for participating!
                </div>
            )}

            <div className="candidates-grid">
                {candidates.map((candidate) => (
                    <div
                        key={candidate.id}
                        className={`candidate-card ${voterInfo.voted ? "disabled" : ""}`}
                    >
                        <div className="candidate-avatar">
                            {candidate.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="candidate-info">
                            <h3>{candidate.name}</h3>
                            <span className="candidate-id">Candidate #{candidate.id}</span>
                        </div>
                        <button
                            className="btn btn-vote"
                            onClick={() => vote(candidate.id)}
                            disabled={loading || !voterInfo.authorized || voterInfo.voted}
                        >
                            {loading ? "⏳" : "Vote"}
                        </button>
                    </div>
                ))}
            </div>

            <div className="voting-stats">
                <span>Total Votes Cast: <strong>{electionStatus.totalVotes}</strong></span>
            </div>
        </div>
    );
}
