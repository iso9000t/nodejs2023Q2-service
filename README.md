
# Home Library Service

Welcome to the Home Library Service! This guide is designed to help you get set up and running with this service in no time. Let's dive right in.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Git**: Necessary for cloning the repository. Download it from [here](https://git-scm.com/downloads) if you haven't already.
- **Docker**: For containerizing the application and its environment. Install Docker by following the instructions [here](https://docs.docker.com/get-docker/).
- **Node.js and npm**: Required for running the service and managing dependencies. Install Node.js from [here](https://nodejs.org/en/download/); npm is included.

### Setup

1. **Clone the Repository**: Obtain the project's source code by cloning this repository. Replace `{repository URL}` with the actual repository URL.

    ```bash
    git clone {repository URL}
    ```

2. **Environment Setup**: Set up your local environment by copying the provided example environment file and then configuring it according to your needs.

    ```bash
    cp .env.example .env
    ```

    Edit the `.env` file to suit your local environment settings.

3. **Install Dependencies**: Navigate to the project directory and install the necessary dependencies.

    ```bash
    npm install
    ```

    In case of dependency issues, attempt to resolve them with:

    ```bash
    npm audit fix
    ```

## Usage

### Starting the Service

To get the service up and running, use Docker Compose. This will create the service in a detached state:

```bash
docker-compose up -d
```

Alternatively, use the provided script:

```bash
npm run docker:up
```

To migrate your database schema:

```bash
docker-compose exec home-library npx prisma migrate dev
```

Or, use the migration script:

```bash
npm run prisma:migrate
```

Access the application at `http://localhost:4000` and explore the OpenAPI documentation at `http://localhost:4000/api-docs`.

### Checking Vulnerabilities

To check for vulnerabilities in Docker images:

```bash
docker scout cves
```

Or use the script:

```bash
npm run docker:scan
```

### Testing

Execute tests using the following commands:

- **Run All Tests** (excluding authorization checks):

    ```bash
    npm run test
    ```

- **Run a Specific Test Suite**:

    ```bash
    npm run test -- <path to suite>
    ```


### Keeping It Clean

Maintain code quality and format:

- **Linting**:

    ```bash
    npm run lint
    ```

- **Formatting**:

    ```bash
    npm run format
    ```

Docker images are available dev and prod versions at https://hub.docker.com/repository/docker/iso9000/homelib/general
Thank you for using the app and good luck! 
