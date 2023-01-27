import "dotenv/config";
import { Octokit } from "octokit";

if (!("GH_TOKEN" in process.env)) {
  throw new Error("GH Token Not Found");
}

const octokit = new Octokit({
  auth: process.env["GH_TOKEN"],
});

async function service() {
  const data = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: "bastionprotocol",
      repo: "circulating-supply",
      path: "package.json",
      message: "",
      content: "",
    }
  );
  console.log("data", data);
}

service();
