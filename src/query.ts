import { ethers } from "ethers";
import { fromBn } from "evm-bn";
import { ERC20, ERC20__factory } from "../typechain";
import "dotenv/config";

if (!("ETH_RPC_URL" in process.env)) {
  throw new Error("ETH RPC Not Found");
}

const BASTION_AURORA_TREASURY_GNOSIS =
  "0x7DB96909Da3fAbaB6c7Ee2c97c4F98221d583530";

const BASTION_ETH_GNOSIS = "0xa8710C4E59666141f828A63522d613758492148B";

const vestingStart = 1650499200;
const duration = 60 * 60 * 24 * 365 * 2;

const ANGEL_INVESTOR_SEED = 92550000;
const VC_SEED = 200000000;
const ANGEL_INVESTOR_SERIES_A = 49125000;
const VC_SERIES_A = 512500000;

const INVESTOR_STILL_IN_BASTION_ETH_GNOSIS = 150000000;

const totalSupply = 5000000000;
const investorSupply =
  ANGEL_INVESTOR_SEED + VC_SEED + ANGEL_INVESTOR_SERIES_A + VC_SERIES_A;

async function balanceOf(
  address: string,
  chain: "ETH" | "AURORA"
): Promise<number> {
  let bstn: ERC20;
  if (chain == "ETH") {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env["ETH_RPC_URL"]
    );

    bstn = ERC20__factory.connect(
      "0x059a1F1deA1020297588C316fFc30A58a1a0D4A2",
      provider
    );
  } else {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://mainnet.aurora.dev"
    );

    bstn = ERC20__factory.connect(
      "0x9f1F933C660a1DC856F0E0Fe058435879c5CCEf0",
      provider
    );
  }
  const bn = await bstn.balanceOf(address);
  const balance = fromBn(bn, 18);
  return +balance;
}

export default async function query() {
  const bastionAuroraTreasuryGnosisBalance = await balanceOf(
    BASTION_AURORA_TREASURY_GNOSIS,
    "AURORA"
  );
  const bengineEthGnosisBalance =
    (await balanceOf(BASTION_ETH_GNOSIS, "ETH")) -
    INVESTOR_STILL_IN_BASTION_ETH_GNOSIS;
  const now = ~~(Date.now() / 1000);
  const elapsed = (now - vestingStart) / duration;
  const vested = investorSupply * (1 - elapsed);

  const circulating =
    totalSupply -
    vested -
    bastionAuroraTreasuryGnosisBalance -
    bengineEthGnosisBalance;

  return circulating;
}
