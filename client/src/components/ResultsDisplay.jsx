import { useVoting } from "../context/VotingContext";
import "./ResultsDisplay.css";

export default function ResultsDisplay() {
    const { candidates, electionStatus, electionName } = useVoting();

    if (!electionStatus.ended && !electionStatus.started) return null;

    const maxVotes = Math.max(...candidates.map((c) => c.voteCount), 1);
    const sortedCandidates = [...candidates].sort(
        (a, b) => b.voteCount - a.voteCount
    );

    return (
        <div className="results-display">
            <h2>📊 {electionStatus.ended ? "Final Results" : "Live Results"}</h2>
            {electionStatus.ended && (
                <p className="results-subtitle">
                    {electionName} — Total Votes: {electionStatus.totalVotes}
                </p>
            )}

            <div className="results-bars">
                {sortedCandidates.map((candidate, index) => {
                    const percentage =
                        electionStatus.totalVotes > 0
                            ? ((candidate.voteCount / electionStatus.totalVotes) * 100).toFixed(1)
                            : 0;
                    const barWidth =
                        maxVotes > 0 ? (candidate.voteCount / maxVotes) * 100 : 0;

                    return (
                        <div
                            key={candidate.id}
                            className={`result-row ${index === 0 && electionStatus.ended ? "winner" : ""}`}
                        >
                            <div className="result-meta">
                                <div className="result-rank">
                                    {index === 0 && electionStatus.ended ? "🏆" : `#${index + 1}`}
                                </div>
                                <span className="result-name">{candidate.name}</span>
                                <span className="result-votes">
                                    {candidate.voteCount} vote{candidate.voteCount !== 1 ? "s" : ""} ({percentage}%)
                                </span>
                            </div>
                            <div className="bar-track">
                                <div
                                    className="bar-fill"
                                    style={{
                                        width: `${barWidth}%`,
                                        animationDelay: `${index * 0.15}s`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
