import { VotingProvider, useVoting } from "./context/VotingContext";
import Navbar from "./components/Navbar";
import AdminPanel from "./components/AdminPanel";
import VotingStation from "./components/VotingStation";
import ResultsDisplay from "./components/ResultsDisplay";
import StatusMessage from "./components/StatusMessage";
import "./App.css";

function AppContent() {
  const { account, isOwner } = useVoting();

  return (
    <div className="app">
      <Navbar />
      <StatusMessage />

      {!account ? (
        <main className="hero">
          <div className="hero-content">
            <div className="hero-badge">Powered by Ethereum</div>
            <h1>Decentralized Voting</h1>
            <p>
              A transparent, secure, and tamper-proof election system built on
              blockchain technology. Every vote is recorded immutably on-chain.
            </p>
            <div className="hero-features">
              <div className="feature">
                <span>🔒</span>
                <div>
                  <strong>Secure</strong>
                  <p>Smart contract enforced rules</p>
                </div>
              </div>
              <div className="feature">
                <span>🌐</span>
                <div>
                  <strong>Transparent</strong>
                  <p>Publicly verifiable results</p>
                </div>
              </div>
              <div className="feature">
                <span>🛡️</span>
                <div>
                  <strong>Tamper-Proof</strong>
                  <p>Immutable on-chain records</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="dashboard">
          {isOwner && <AdminPanel />}
          <VotingStation />
          <ResultsDisplay />
        </main>
      )}

      <footer className="footer">
        <p>BlockVote — Decentralized E-Voting System © 2026</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <VotingProvider>
      <AppContent />
    </VotingProvider>
  );
}
