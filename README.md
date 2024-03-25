
# Home Library Service

Welcome to the Home Library Service! This guide is designed to help you get set up and running with this service in no time. Let's dive right in.

## Getting Started

### Prerequisites

Ensure you have these essentials:
- **Git**: For cloning the repository. If it's not already on your system, [grab it here](https://git-scm.com/downloads).
- **Node.js and npm**: Our service's heartbeat. Download Node.js [right here](https://nodejs.org/en/download/), and npm comes along with it.

### Setup

1. **Clone the Repository**: Start by cloning the project to your machine.

    git clone {repository URL}

    Don't forget to replace `{repository URL}` with the actual URL of this repository.

2. **Environment Setup**: Copy the `.env.example` file to create a `.env` file that you can then configure according to your local environment.
 
    cp .env.example .env

    Edit the `.env` file to match your local setup.

3. **Install Dependencies**: Jump into the project directory and fetch those dependencies.

    npm install

    If you encounter any issues with dependencies, try fixing them with:

    npm audit fix


### Start It Up

create the service:

docker-compose up -d (or use "docker:up" script)

migrate: docker-compose exec home-library npx prisma migrate dev (or use "prisma:migrate" script)

Head over to `http://localhost:4000` (or whatever port you've configured) to see the app live. 
And don't miss out on the OpenAPI documentation at `http://localhost:4000/api-doc/` for a comprehensive guide to what's possible with your new service.

## Check vulnerabilities 

docker scout cves (or "docker:scan" script)

## Testing

Here's how to run the tests:

- **Run All Tests** (Excluding Authorization):
 
    npm run test

- **Run a Specific Test Suite**:

    npm run test -- <path to suite>

- **With Authorization Checks**:

    npm run test:auth (not for the first task)
 
    Or, for a specific suite:

    npm run test:auth -- <path to suite>
 

### Keeping It Clean

Code cleanliness is next to godliness:
- **Lint**:

    npm run lint

- **Format**:

    npm run format

Thank you for using the app and good luck!
