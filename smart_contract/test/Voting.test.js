const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
    let voting;
    let owner, voter1, voter2, unauthorized;

    beforeEach(async function () {
        [owner, voter1, voter2, unauthorized] = await ethers.getSigners();
        const Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.deploy("Test Election");
    });

    // ── Deployment ──────────────────────────────────────
    describe("Deployment", function () {
        it("should set the correct owner", async function () {
            expect(await voting.owner()).to.equal(owner.address);
        });

        it("should set the election name", async function () {
            expect(await voting.electionName()).to.equal("Test Election");
        });

        it("should start with no candidates", async function () {
            expect(await voting.getCandidateCount()).to.equal(0);
        });
    });

    // ── Adding Candidates ───────────────────────────────
    describe("Adding Candidates", function () {
        it("should allow owner to add candidates", async function () {
            await voting.addCandidate("Alice");
            await voting.addCandidate("Bob");
            expect(await voting.getCandidateCount()).to.equal(2);

            const [id, name, voteCount] = await voting.getCandidate(0);
            expect(name).to.equal("Alice");
            expect(voteCount).to.equal(0);
        });

        it("should emit CandidateAdded event", async function () {
            await expect(voting.addCandidate("Alice"))
                .to.emit(voting, "CandidateAdded")
                .withArgs(0, "Alice");
        });

        it("should NOT allow non-owner to add candidates", async function () {
            await expect(
                voting.connect(voter1).addCandidate("Charlie")
            ).to.be.revertedWith("Only the election owner can perform this action");
        });

        it("should NOT allow adding candidates after election starts", async function () {
            await voting.addCandidate("Alice");
            await voting.startElection();
            await expect(voting.addCandidate("Late Entry")).to.be.revertedWith(
                "Cannot add candidates after election has started"
            );
        });
    });

    // ── Authorization ───────────────────────────────────
    describe("Voter Authorization", function () {
        it("should allow owner to authorize voters", async function () {
            await voting.authorizeVoter(voter1.address);
            const voter = await voting.voters(voter1.address);
            expect(voter.authorized).to.be.true;
        });

        it("should emit VoterAuthorized event", async function () {
            await expect(voting.authorizeVoter(voter1.address))
                .to.emit(voting, "VoterAuthorized")
                .withArgs(voter1.address);
        });

        it("should NOT allow non-owner to authorize voters", async function () {
            await expect(
                voting.connect(voter1).authorizeVoter(voter2.address)
            ).to.be.revertedWith("Only the election owner can perform this action");
        });
    });

    // ── Election Lifecycle ──────────────────────────────
    describe("Election Lifecycle", function () {
        it("should start election", async function () {
            await voting.addCandidate("Alice");
            await voting.startElection();
            expect(await voting.electionStarted()).to.be.true;
        });

        it("should NOT start without candidates", async function () {
            await expect(voting.startElection()).to.be.revertedWith(
                "Add at least one candidate before starting"
            );
        });

        it("should end election", async function () {
            await voting.addCandidate("Alice");
            await voting.startElection();
            await voting.endElection();
            expect(await voting.electionEnded()).to.be.true;
        });
    });

    // ── Voting ──────────────────────────────────────────
    describe("Voting", function () {
        beforeEach(async function () {
            await voting.addCandidate("Alice");
            await voting.addCandidate("Bob");
            await voting.authorizeVoter(voter1.address);
            await voting.authorizeVoter(voter2.address);
            await voting.startElection();
        });

        it("should allow authorized voter to vote", async function () {
            await voting.connect(voter1).vote(0);
            const [, , voteCount] = await voting.getCandidate(0);
            expect(voteCount).to.equal(1);
            expect(await voting.totalVotes()).to.equal(1);
        });

        it("should emit VoteCast event", async function () {
            await expect(voting.connect(voter1).vote(0))
                .to.emit(voting, "VoteCast")
                .withArgs(voter1.address, 0);
        });

        it("should NOT allow double voting", async function () {
            await voting.connect(voter1).vote(0);
            await expect(voting.connect(voter1).vote(1)).to.be.revertedWith(
                "You have already voted"
            );
        });

        it("should NOT allow unauthorized voter", async function () {
            await expect(
                voting.connect(unauthorized).vote(0)
            ).to.be.revertedWith("You are not authorized to vote");
        });

        it("should NOT allow invalid candidate ID", async function () {
            await expect(voting.connect(voter1).vote(99)).to.be.revertedWith(
                "Invalid candidate ID"
            );
        });

        it("should NOT allow voting after election ends", async function () {
            await voting.endElection();
            await expect(voting.connect(voter1).vote(0)).to.be.revertedWith(
                "Election has already ended"
            );
        });
    });

    // ── View Functions ──────────────────────────────────
    describe("View Functions", function () {
        it("should return all candidates", async function () {
            await voting.addCandidate("Alice");
            await voting.addCandidate("Bob");
            const all = await voting.getAllCandidates();
            expect(all.length).to.equal(2);
        });

        it("should return election status", async function () {
            await voting.addCandidate("Alice");
            const [started, ended, total] = await voting.getElectionStatus();
            expect(started).to.be.false;
            expect(ended).to.be.false;
            expect(total).to.equal(0);
        });
    });
});
