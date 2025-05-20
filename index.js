#!/usr/bin/env node


import inquirer from "inquirer";
import * as fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import degit from "degit";

const CURR_DIR = process.cwd();

const _dirname = dirname(fileURLToPath(import.meta.url));

const CHOICES = JSON.parse(fs.readFileSync(path.resolve(_dirname, "templates.json"), "utf-8"));

const QUESTIONS = [
    {
        name: "project-choice",
        type: "list",
        message: "what project template would you like to generate ?",
        choices: CHOICES,
    },

    {
        name: 'project-name',
        type: 'input',
        message: 'Project-name: ',
        validate: function(input) {
            if(/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
            else    
                return "Project name can only contain letters, numbers, underscores and hashes."
        }
    }
]


// const getStartedQuestion = {
//     name: 'get-started',
//     type: 'confirm',
//     message: 'Do you want to get started with this project now ?',
//     default: true,
// }

const git_username = process.env.GITHUB_USERNAME
const git_repo_name = process.env.GITHUB_REPO_NAME

inquirer.prompt(QUESTIONS).then(async(answers) => {
    const projectChoice = answers['project-choice'];
    const projectName = answers['project-name'];
    const folderPath = `${git_username}/${git_repo_name}/${projectChoice}`

    const emitter = degit(`subhashvadrevu/react-ignite-templates/${projectChoice}`, {
        cache: false,
        force: true,
        verbose: true
    });

    console.log(`Fetching ${projectChoice} template...`);
    await emitter.clone(projectName);

    try {
        execSync('npm -v', { stdio: 'ignore' });
    } catch (err) {
        console.error('❌ npm is not installed. Please install Node.js and npm first.');
        process.exit(1);
    }

    console.log('Installing dependencies...');
    execSync(`cd ${projectName} && npm install`, { stdio: "inherit" });


    console.log('Your new project is ready!')
    console.log('To get started, run: ')
    console.log(`   cd ${projectName}`)
    console.log(`   npm run dev`)
})