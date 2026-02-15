# 🗳️ BlockVote — Decentralized E-Voting System

A transparent, secure, and tamper-proof election system built on **Ethereum Smart Contracts**. Every vote is recorded immutably on-chain, preventing fraud and ensuring verifiable results.

![Solidity](https://img.shields.io/badge/Solidity-0.8.19-blue?logo=solidity)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Ethers.js](https://img.shields.io/badge/Ethers.js-6.9-purple)
![Hardhat](https://img.shields.io/badge/Hardhat-2.19-yellow?logo=hardhat)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔒 **Secure Voting** | Smart contract enforces one-vote-per-address rule |
| 👑 **Admin Controls** | Add candidates, authorize voters, start/end elections |
| 🌐 **Transparent Results** | Publicly verifiable on-chain vote counts |
| 🛡️ **Tamper-Proof** | Immutable blockchain records — no vote manipulation |
| 🦊 **MetaMask Integration** | Seamless wallet connection via ethers.js |
| 📊 **Live Results** | Animated bar chart with winner highlighting |

---

## 📁 Project Structure

```
blockchain/
├── smart_contract/               # Solidity + Hardhat
│   ├── contracts/Voting.sol      # Voting smart contract
│   ├── scripts/deploy.js         # Deployment script
│   ├── test/Voting.test.js       # 14 unit tests
│   └── hardhat.config.js
│
└── client/                       # React + Vite frontend
    └── src/
        ├── abi/Voting.json               # Contract ABI
        ├── context/VotingContext.jsx      # Web3 state management
        ├── components/
        │   ├── Navbar.jsx                # Wallet connection
        │   ├── AdminPanel.jsx            # Admin dashboard
        │   ├── VotingStation.jsx         # Vote casting UI
        │   ├── ResultsDisplay.jsx        # Election results
        │   └── StatusMessage.jsx         # Toast notifications
        └── App.jsx
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MetaMask](https://metamask.io/) browser extension
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/blockvote.git
cd blockvote/blockchain
```

### 2. Install Dependencies

```bash
# Install smart contract dependencies
cd smart_contract
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Compile & Test the Smart Contract

```bash
cd ../smart_contract
npx hardhat compile
npx hardhat test
```

You should see **14/14 tests passing** ✅

### 4. Start the Local Blockchain

Open a **new terminal** and run:

```bash
cd smart_contract
npx hardhat node
```

> ⚠️ **Keep this terminal open** — it runs the local Ethereum node. You'll see a list of 20 test accounts with their private keys.

### 5. Deploy the Smart Contract

In a **second terminal**:

```bash
cd smart_contract
npx hardhat run scripts/deploy.js --network localhost
```

You should see:
```
✅ Voting contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 6. Start the Frontend

In a **third terminal**:

```bash
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🦊 MetaMask Configuration

### Add the Hardhat Network

1. Open MetaMask → **Settings** → **Networks** → **Add Network**
2. Fill in:

| Field | Value |
|---|---|
| Network Name | `Hardhat Localhost` |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency Symbol | `ETH` |

3. Click **Save**

### Import Test Accounts

1. Copy the **first private key** from the Hardhat node terminal output (Account #0 — this is the **admin**)
2. MetaMask → **Import Account** → Paste the private key
3. Repeat for **Account #1** (to test as a voter)

---

## 🎮 Usage Walkthrough

### As Admin (Account #0)

1. Connect wallet → You'll see the **Admin Dashboard**
2. **Add Candidates** — e.g., "Alice", "Bob"
3. **Authorize Voters** — paste Account #1's address
4. Click **Start Election** 🚀

### As Voter (Account #1)

1. Switch to Account #1 in MetaMask
2. Refresh the page → Connect wallet
3. You'll see the **Voting Station** with candidate cards
4. Click **Vote** on your preferred candidate
5. Your vote is recorded on-chain — you cannot vote again

### View Results

- Results are visible as an animated **bar chart**
- Once the admin clicks **End Election**, final results are displayed with a 🏆 winner badge

---

## 🧪 Smart Contract API

| Function | Access | Description |
|---|---|---|
| `addCandidate(name)` | Owner | Add a candidate (before election starts) |
| `authorizeVoter(address)` | Owner | Whitelist a voter |
| `startElection()` | Owner | Open voting |
| `endElection()` | Owner | Close voting |
| `vote(candidateId)` | Voter | Cast a vote (once only) |
| `getAllCandidates()` | Public | Get all candidates + vote counts |
| `getElectionStatus()` | Public | Get started/ended/totalVotes |

---

## 🛠️ Tech Stack

- **Smart Contract**: Solidity 0.8.19
- **Development Environment**: Hardhat 2.19.5
- **Frontend**: React 19 + Vite
- **Blockchain Interaction**: Ethers.js 6.9
- **Styling**: Vanilla CSS (dark theme with glassmorphism)

---


