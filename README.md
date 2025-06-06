# Auto Send Token CLI Bot (Ethereum / Optimism)

This is a Node.js-based CLI tool designed to automate sending the same ERC-20 token amount to multiple wallet addresses on Ethereum and Optimism networks.

To use this bot, you must first clone the repository, install the required dependencies using `npm install`, and then create a `.env` file containing your private key(s), RPC URL, token contract address, the token amount you wish to send, and the delay between each transaction in milliseconds.

The list of recipient wallet addresses should be placed in a file called `addresses.csv`, with one address per line.

Once setup is complete, you can run the bot using `node index.js`, and it will automatically detect the token's decimals, sign and send the token transactions, and print out live logs for each step.

All successful transactions will be recorded in `success.log`, while any failed attempts will be saved in `error.log`, helping you track exactly which transfers went through and which did not.

This script supports multiple sender wallets, reads token decimals dynamically, and provides real-time feedback in the terminal for every transaction sent.

> Use this tool responsibly. It runs locally and stores no personal information. You are solely responsible for all activity using it.

---

## Usage

### 1. Clone the repository
```bash
git clone https://github.com/username/auto-send-token.git
cd auto-send-token
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a `.env` file
```env
PRIVATE_KEYS=0xPRIVATEKEY1,0xPRIVATEKEY2
RPC_URL=https://mainnet.optimism.io
TOKEN_ADDRESS=0xTokenContract
AMOUNT=10.5
DELAY_MS=3000
```

### 4. Prepare `addresses.csv`
Each recipient wallet address on a new line:
```
0xabc123...
0xdef456...
```

### 5. Run the bot
```bash
node index.js
```

---

## Logs

- Successful transactions  `success.log`
- Failed transactions  `error.log`

---

## Disclaimer

This tool is intended for educational or utility purposes only. It runs completely locally and does not store any private or sensitive data. Use at your own risk.
