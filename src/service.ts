import "dotenv/config";
import { Octokit } from "octokit";

if (!("GH_TOKEN" in process.env)) {
  throw new Error("GH Token Not Found");
}

const octokit = new Octokit({
  auth: process.env["GH_TOKEN"],
});

async function service() {
  const { data: circulatingSupply } = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: "bastionprotocol",
      repo: "circulating-supply",
      path: "result/circulating",
    }
  );

  const res = Buffer.from(
    //@ts-ignore
    circulatingSupply.content,
    "base64"
  ).toString();
  console.log("res", res);
  //   const circulating = Buffer.from(circulatingResponse.content);
}

service();
