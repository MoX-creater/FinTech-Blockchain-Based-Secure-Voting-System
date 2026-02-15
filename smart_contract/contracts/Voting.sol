// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    // ── Structs ─────────────────────────────────────────
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Voter {
        bool authorized;
        bool voted;
        uint256 vote; // candidateId they voted for
    }

    // ── State Variables ─────────────────────────────────
    address public owner;
    string public electionName;
    bool public electionStarted;
    bool public electionEnded;

    mapping(address => Voter) public voters;
    Candidate[] public candidates;
    uint256 public totalVotes;

    // ── Events ──────────────────────────────────────────
    event CandidateAdded(uint256 indexed candidateId, string name);
    event VoterAuthorized(address indexed voter);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event ElectionStarted();
    event ElectionEnded();

    // ── Modifiers ───────────────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the election owner can perform this action");
        _;
    }

    modifier electionIsActive() {
        require(electionStarted, "Election has not started yet");
        require(!electionEnded, "Election has already ended");
        _;
    }

    // ── Constructor ─────────────────────────────────────
    constructor(string memory _electionName) {
        owner = msg.sender;
        electionName = _electionName;
    }

    // ── Admin Functions ─────────────────────────────────

    /// @notice Add a new candidate (only before election starts)
    function addCandidate(string memory _name) public onlyOwner {
        require(!electionStarted, "Cannot add candidates after election has started");
        candidates.push(Candidate(candidates.length, _name, 0));
        emit CandidateAdded(candidates.length - 1, _name);
    }

    /// @notice Authorize a voter address
    function authorizeVoter(address _voter) public onlyOwner {
        require(!voters[_voter].voted, "Voter has already voted");
        voters[_voter].authorized = true;
        emit VoterAuthorized(_voter);
    }

    /// @notice Start the election
    function startElection() public onlyOwner {
        require(!electionStarted, "Election has already started");
        require(candidates.length > 0, "Add at least one candidate before starting");
        electionStarted = true;
        emit ElectionStarted();
    }

    /// @notice End the election
    function endElection() public onlyOwner electionIsActive {
        electionEnded = true;
        emit ElectionEnded();
    }

    // ── Voter Functions ─────────────────────────────────

    /// @notice Cast a vote for a candidate
    function vote(uint256 _candidateId) public electionIsActive {
        Voter storage sender = voters[msg.sender];
        require(sender.authorized, "You are not authorized to vote");
        require(!sender.voted, "You have already voted");
        require(_candidateId < candidates.length, "Invalid candidate ID");

        sender.voted = true;
        sender.vote = _candidateId;
        candidates[_candidateId].voteCount++;
        totalVotes++;

        emit VoteCast(msg.sender, _candidateId);
    }

    // ── View Functions ──────────────────────────────────

    /// @notice Get the total number of candidates
    function getCandidateCount() public view returns (uint256) {
        return candidates.length;
    }

    /// @notice Get a candidate's details by ID
    function getCandidate(uint256 _candidateId) public view returns (uint256, string memory, uint256) {
        require(_candidateId < candidates.length, "Invalid candidate ID");
        Candidate memory c = candidates[_candidateId];
        return (c.id, c.name, c.voteCount);
    }

    /// @notice Get all candidates (for frontend convenience)
    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    /// @notice Check the election status
    function getElectionStatus() public view returns (bool started, bool ended, uint256 total) {
        return (electionStarted, electionEnded, totalVotes);
    }
}
