import "dotenv/config";
import { Octokit } from "octokit";
import { createOrUpdateTextFile } from "@octokit/plugin-create-or-update-text-file";
import query from "./query";

if (!("GH_TOKEN" in process.env)) {
  throw new Error("GH Token Not Found");
}

const MyOctokit = Octokit.plugin(createOrUpdateTextFile);

const octokit = new MyOctokit({
  auth: process.env["GH_TOKEN"],
});

async function service() {
  const newCiculatingSupply = await query();
  const timestamp = ~~(Date.now() / 1000);
  await octokit.createOrUpdateTextFile({
    owner: "bastionprotocol",
    repo: "circulating-supply",
    path: "result/circulating",
    content: newCiculatingSupply.toString(),
    message: `chore: update circulating supply timestamp: ${timestamp}`,
  });
}

setInterval(() => {
  service();
}, 1000 * 60 * 10);
