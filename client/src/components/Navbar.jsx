import { useVoting } from "../context/VotingContext";
import "./Navbar.css";

export default function Navbar() {
    const { account, connectWallet, isOwner, loading, electionName } = useVoting();

    const shortenAddress = (addr) =>
        addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="navbar-icon">🗳️</span>
                <div>
                    <h1 className="navbar-title">BlockVote</h1>
                    {electionName && <p className="navbar-subtitle">{electionName}</p>}
                </div>
            </div>

            <div className="navbar-actions">
                {account ? (
                    <div className="wallet-info">
                        {isOwner && <span className="badge badge-admin">Admin</span>}
                        <span className="badge badge-voter">Voter</span>
                        <span className="wallet-address">{shortenAddress(account)}</span>
                        <div className="wallet-dot connected" />
                    </div>
                ) : (
                    <button
                        className="btn btn-connect"
                        onClick={connectWallet}
                        disabled={loading}
                    >
                        {loading ? "Connecting..." : "Connect Wallet"}
                    </button>
                )}
            </div>
        </nav>
    );
}
