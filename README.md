# CSE-210-Project

## Backend

In order to run the backend, run the following sequential commands in your terminal under the backend folder: 
1. `npm install` 
2. `npm run dev`
NOTE: mongodb is not set up yet, so this runs locally on PORT 3000.

## Frontend

In order to run the frontend, run the following sequential commands in your terminal under the frontend folder: 
1. `npm install` 
2. `npm run dev`. 
This runs locally on PORT 5173.

## Style Guide

Code style are inforced by automated checks during PR. The codebase adheres to the following styles:
- Variable/Method naming: camelCase
- Class/Module naming: PascalCase
- Indentation: 2 spaces
- Unused modules/variables: Provide warning, but does not enforce change because of active dev process (leave them as a reference for others).
- Formatter: Prettier
- Linting: ESLint, excecute `npm run lint` for results

Commit message and branch naming:
- Commit messages should be in the format of "[commit type] ([module]): [message]"
- Branch names should be in the format of "action/username/branchName"
