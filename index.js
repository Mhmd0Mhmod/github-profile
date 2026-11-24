import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";

console.log(
  chalk.yellow(
    figlet.textSync("Github Profile Data", { horizontalLayout: "default" }),
  ),
);
program
  .version("1.0.0")
  .description("Fetch and print public details for a GitHub user");
program.action(() => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "githubUserName",
        message: chalk.white.underline("Enter Your Github User Name :"),
      },
    ])
    .then(async (anwsers) => {
      const userData = await fetchGithubProfile(anwsers.githubUserName);
      console.log(userData);

      printProfile(userData);
    });
});

program.parse(process.argv);

function printError(message) {
  console.error(message);
  process.exit();
}
function printProfile(profile) {
  console.log(`Name: ${profile.name || "not set"}`);
  console.log(`Username: ${profile.login}`);
  console.log(`Profile: ${profile.html_url}`);
  console.log(`Public repos: ${profile.public_repos}`);
  console.log(`Followers: ${profile.followers}`);
}
async function fetchGithubProfile(userName) {
  const url = `https://api.github.com/users/${encodeURIComponent(userName)}`;

  const spinner = ora("Fethcing Profile Data " + userName);
  try {
    spinner.start();
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "github-profile-cli",
      },
    });
    if (response.status === 404) {
      spinner.fail(`GitHub user not found: ${userName}`);
      process.exit();
    }

    if (!response.ok) {
      spinner.fail(
        data?.message || `GitHub request failed with status ${response.status}`,
      );
      process.exit();
    }
    spinner.succeed();

    return await response.json();
  } catch {
    spinner.fail("could not reach GitHub");
    process.exit();
  } finally {
    spinner.clear();
  }
}
