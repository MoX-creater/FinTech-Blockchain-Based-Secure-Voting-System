import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

// We'll import the ABI directly — copied from the compiled artifact
import contractABI from "../abi/Voting.json";

const VotingContext = createContext();

// Default localhost contract address — update after deployment
const DEFAULT_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export function VotingProvider({ children }) {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [electionStatus, setElectionStatus] = useState({
        started: false,
        ended: false,
        totalVotes: 0,
    });
    const [voterInfo, setVoterInfo] = useState({
        authorized: false,
        voted: false,
    });
    const [electionName, setElectionName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ── Connect Wallet ─────────────────────────────────
    const connectWallet = useCallback(async () => {
        try {
            if (!window.ethereum) {
                setError("Please install MetaMask to use this application!");
                return;
            }

            setLoading(true);
            setError("");

            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await browserProvider.send("eth_requestAccounts", []);
            const userSigner = await browserProvider.getSigner();

            const votingContract = new ethers.Contract(
                DEFAULT_CONTRACT_ADDRESS,
                contractABI,
                userSigner
            );

            setProvider(browserProvider);
            setSigner(userSigner);
            setAccount(accounts[0]);
            setContract(votingContract);

            // Check if connected account is the owner
            const owner = await votingContract.owner();
            setIsOwner(owner.toLowerCase() === accounts[0].toLowerCase());

            // Get election name
            const name = await votingContract.electionName();
            setElectionName(name);

            setLoading(false);
        } catch (err) {
            setError("Failed to connect wallet: " + err.message);
            setLoading(false);
        }
    }, []);

    // ── Fetch all data ─────────────────────────────────
    const fetchData = useCallback(async () => {
        if (!contract || !account) return;
        try {
            // Fetch candidates
            const allCandidates = await contract.getAllCandidates();
            const formatted = allCandidates.map((c) => ({
                id: Number(c.id),
                name: c.name,
                voteCount: Number(c.voteCount),
            }));
            setCandidates(formatted);

            // Fetch election status
            const [started, ended, total] = await contract.getElectionStatus();
            setElectionStatus({
                started,
                ended,
                totalVotes: Number(total),
            });

            // Fetch voter info
            const voter = await contract.voters(account);
            setVoterInfo({
                authorized: voter.authorized,
                voted: voter.voted,
            });
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }, [contract, account]);

    useEffect(() => {
        if (contract && account) {
            fetchData();
        }
    }, [contract, account, fetchData]);

    // ── Listen for account changes ─────────────────────
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    connectWallet();
                } else {
                    setAccount(null);
                    setContract(null);
                }
            });
        }
    }, [connectWallet]);

    // ── Admin: Add Candidate ───────────────────────────
    const addCandidate = async (name) => {
        if (!contract) return;
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const tx = await contract.addCandidate(name);
            await tx.wait();
            setSuccess(`Candidate "${name}" added successfully!`);
            fetchData();
        } catch (err) {
            setError("Failed to add candidate: " + (err.reason || err.message));
        } finally {
            setLoading(false);
        }
    };

    // ── Admin: Authorize Voter ─────────────────────────
    const authorizeVoter = async (voterAddress) => {
        if (!contract) return;
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const tx = await contract.authorizeVoter(voterAddress);
            await tx.wait();
            setSuccess(`Voter ${voterAddress} authorized!`);
            fetchData();
        } catch (err) {
            setError("Failed to authorize voter: " + (err.reason || err.message));
        } finally {
            setLoading(false);
        }
    };

    // ── Admin: Start Election ──────────────────────────
    const startElection = async () => {
        if (!contract) return;
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const tx = await contract.startElection();
            await tx.wait();
            setSuccess("Election started successfully!");
            fetchData();
        } catch (err) {
            setError("Failed to start election: " + (err.reason || err.message));
        } finally {
            setLoading(false);
        }
    };

    // ── Admin: End Election ────────────────────────────
    const endElection = async () => {
        if (!contract) return;
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const tx = await contract.endElection();
            await tx.wait();
            setSuccess("Election ended successfully!");
            fetchData();
        } catch (err) {
            setError("Failed to end election: " + (err.reason || err.message));
        } finally {
            setLoading(false);
        }
    };

    // ── Voter: Cast Vote ──────────────────────────────
    const vote = async (candidateId) => {
        if (!contract) return;
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const tx = await contract.vote(candidateId);
            await tx.wait();
            setSuccess("Vote cast successfully!");
            fetchData();
        } catch (err) {
            setError("Failed to vote: " + (err.reason || err.message));
        } finally {
            setLoading(false);
        }
    };

    // ── Clear Messages ─────────────────────────────────
    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    return (
        <VotingContext.Provider
            value={{
                account,
                isOwner,
                candidates,
                electionStatus,
                electionName,
                voterInfo,
                loading,
                error,
                success,
                connectWallet,
                addCandidate,
                authorizeVoter,
                startElection,
                endElection,
                vote,
                fetchData,
                clearMessages,
            }}
        >
            {children}
        </VotingContext.Provider>
    );
}

export function useVoting() {
    const context = useContext(VotingContext);
    if (!context) {
        throw new Error("useVoting must be used within a VotingProvider");
    }
    return context;
}
