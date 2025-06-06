import dotenv from "dotenv";
import fs from "fs";
import { ethers } from "ethers";
import inquirer from "inquirer";

dotenv.config();

const loadPrivateKeys = () => {
  const keys = process.env.PRIVATE_KEYS?.split(",").map((k) => k.trim());
  if (!keys || keys.length === 0) {
    console.error("❌ Tidak ada PRIVATE_KEYS dalam .env");
    process.exit(1);
  }
  return keys;
};

const askOptions = async () => {
  const questions = [
    {
      type: "input",
      name: "rpc",
      message: "RPC URL",
      default: process.env.RPC_URL,
    },
    {
      type: "input",
      name: "token",
      message: "Token Contract Address",
      default: process.env.TOKEN_ADDRESS,
    },
    {
      type: "input",
      name: "amount",
      message: "Jumlah token yang dikirim (misal 10.5)",
      default: process.env.AMOUNT,
    },
    {
      type: "input",
      name: "delay",
      message: "Delay antar TX (ms)?",
      default: process.env.DELAY_MS || 0,
    },
  ];
  return inquirer.prompt(questions);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const keys = loadPrivateKeys();
  const { rpc, token, amount, delay } = await askOptions();

  const provider = new ethers.JsonRpcProvider(rpc);
  const tokenAbi = [
    "function transfer(address to, uint amount) public returns (bool)",
    "function decimals() view returns (uint8)",
  ];

  const recipients = fs
    .readFileSync("addresses.csv", "utf8")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

  for (const key of keys) {
    const wallet = new ethers.Wallet(key, provider);
    const tokenContract = new ethers.Contract(token, tokenAbi, wallet);

    const senderBalance = await provider.getBalance(wallet.address);
    console.log(
      `?? Wallet: ${wallet.address} | Balance: ${ethers.formatEther(
        senderBalance
      )} ETH`
    );

    let decimals;
    try {
      decimals = await tokenContract.decimals();
      console.log(`?? Token decimals: ${decimals}`);
    } catch (err) {
      console.error("❌ Gagal ambil decimals dari token. Pastikan contract benar.");
      process.exit(1);
    }

    for (const to of recipients) {
      try {
        const txAmount = ethers.parseUnits(amount, decimals);
        const tx = await tokenContract.transfer(to, txAmount);
        console.log(`?? Mengirim ke: ${to} | Jumlah: ${amount}`);
        await tx.wait();

        const receipt = await provider.getTransactionReceipt(tx.hash);
        const block = await provider.getBlock(receipt.blockNumber);

        console.log(`?? Success: ${to} | TX Hash: ${tx.hash}`);
        console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);
        console.log(`   Block Number: ${receipt.blockNumber}`);
        console.log(`   Timestamp: ${new Date(block.timestamp * 1000).toLocaleString()}`);

        fs.appendFileSync("success.log", `${wallet.address},${to},${tx.hash}\n`);
        await sleep(parseInt(delay));
      } catch (err) {
        console.error(`?? Failed: ${to} | ${err.message}`);
        fs.appendFileSync("error.log", `${wallet.address},${to},${err.message}\n`);
      }
    }
  }
})();

