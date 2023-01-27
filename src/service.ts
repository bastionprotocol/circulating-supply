import { Octokit } from "octokit";

const octokit = new Octokit();

async function service() {
  await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: "",
    repo: "",
    path: "circulating-supply",
    message: "",
    content: "",
  });
}

service();
