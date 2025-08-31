# Note-Taking App with Docker & CI/CD

A simple note-taking application designed to learn and implement modern DevOps practices. This project demonstrates the use of Docker for containerization, GitHub Actions for CI/CD, and Google Cloud Platform (GCP) for deployment.

## Features

- **Multi-Container Architecture**:

  - Frontend, backend, and database each run in separate Docker containers.
  - Private Docker network with nginx acting as a reverse proxy.

- **Dockerized Development & Production Environments**:

  - Separate `Dockerfile.dev` and `Dockerfile.prod` for frontend and backend services.
  - `docker-compose.dev.yml` and `docker-compose.prod.yml` for local and production setups.

- **CI/CD Pipeline with GitHub Actions**:

  - Matrix strategy to build frontend and backend images.
  - Utilizes QEMU and Buildx for multi-architecture builds.
  - Caching of npm dependencies to speed up builds.
  - Pushes images to Docker Hub with `:cache`, SSH, and the `latest` tags.
  - Deploys the latest version to a GCP virtual machine via SSH.

- **Cloud Deployment**:

  - Hosted on a GCP virtual machine.
  - Automated deployment ensures the app is always up-to-date.

## Technologies Used

- **Frontend**: React (TypeScript)
- **Backend**: Node.js (Express)
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: Google Cloud Platform (VM)
- **Reverse Proxy**: nginx

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- Node.js & npm (for local development)
- Google Cloud SDK (for deployment)

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/SajawalHassan/Note-taking-app-docker.git
   cd Note-taking-app-docker
   ```

2. Build and start the services:

   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. Edit the api url in `client/hooks/useNotes.ts` for your server. (If on production, keep as is)

4. Access the application at `http://localhost`.

### Production Deployment

1. Build and push images:

   ```bash
   docker-compose -f docker-compose.prod.yml build
   docker-compose -f docker-compose.prod.yml push
   ```

2. SSH into your GCP VM and pull the latest images:

   ```bash
   ssh user@your-vm-ip
   docker-compose -f docker-compose.prod.yml pull
   docker-compose -f docker-compose.prod.yml up -d
   ```

## CI/CD Workflow

The GitHub Actions workflow automates the following:

- **Build**:

  - Sets up QEMU and Docker Buildx for multi-architecture builds.
  - Caches npm dependencies to speed up builds.
  - Builds frontend and backend images.

- **Push**:

  - Logs into Docker Hub.
  - Pushes images with `:cache` tags.

- **Deploy**:

  - SSHs into the GCP VM.
  - Pulls the latest images.
  - Restarts the services with the new images.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.
