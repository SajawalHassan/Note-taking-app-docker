#!/bin/bash
set -e

echo "[*] Updating system..."
sudo apt update -y
sudo apt upgrade -y

echo "[*] Installing prerequisites..."
sudo apt install -y ca-certificates curl gnupg lsb-release

echo "[*] Adding Docker’s official GPG key..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "[*] Setting up Docker repository..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "[*] Installing Docker Engine and Docker Compose plugin..."
sudo apt update -y
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "[*] Enabling Docker service..."
sudo systemctl enable docker
sudo systemctl start docker

echo "[*] Adding current user to docker group..."
sudo groupadd docker || true
sudo usermod -aG docker $USER

echo "[*] Installation complete!"
echo "--------------------------------------------"
echo "Docker version:"
docker --version
echo "Docker Compose version:"
docker compose version
echo "--------------------------------------------"
echo "⚠️ You need to log out and log back in (or run 'newgrp docker') for group changes to take effect."
