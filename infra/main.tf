# Create VPC
resource "google_compute_network" "note-app-vpc" {
  name = "note-app-vpc"
}

# ----- FRONTEND -----

# Create subnet
resource "google_compute_subnetwork" "frontend-subnet" {
  name = "note-app-frontend-subnet"
  ip_cidr_range = "10.0.1.0/24"
  region = "us-central1"
  network = google_compute_network.note-app-vpc.id
}

# Firewall rules
resource "google_compute_firewall" "frontend-subnet-fw" {
  name = "note-app-frontend-subnet-fw"
  network = google_compute_network.note-app-vpc.name
  direction = "INGRESS"
  target_tags = ["frontend-vms"]

  allow {
    protocol = "tcp"
    ports = ["80", "443", "22"]
  }

  source_ranges = ["0.0.0.0/0"] # Allow trafic from this ip address
}

# frontend vm
resource "google_compute_instance" "frontend-vm" {
  name = "note-app-frontend-vm"
  machine_type = "e2-micro"
  zone = "us-central1-a"

  tags = ["frontend-vms"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
      size = 20
      type = "pd-balanced"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.frontend-subnet.id

    access_config {
      
    }
  }

  metadata = {
    startup-script = <<-EOT
    #!/bin/bash
    set -e
    echo "[*] Updating system..."
    apt-get update -y
    apt-get upgrade -y

    echo "[*] Installing prerequisites..."
    apt-get install -y ca-certificates curl gnupg lsb-release

    echo "[*] Adding Docker's official GPG key..."
    mkdir -m 0755 -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    echo "[*] Setting up Docker repo..."
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list

    apt-get update -y

    echo "[*] Installing Docker + Compose..."
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    echo "[*] Enabling Docker..."
    systemctl enable docker
    systemctl start docker

    EOT
  }
}

# ----- BACKEND -----

# Create subnet
resource "google_compute_subnetwork" "backend-subnet" {
  name = "note-app-backend-subnet"
  ip_cidr_range = "10.0.2.0/24"
  region = "us-central1"
  network = google_compute_network.note-app-vpc.id
}

# Firewall rules for subnet
resource "google_compute_firewall" "backend-subnet-fw" {
  name = "note-app-backend-subnet-fw"
  network = google_compute_network.note-app-vpc.name

  direction = "INGRESS"
  target_tags = ["backend-vms"]
  # source_ranges = ["10.0.1.0/24"] # allow traffic from frontend subnet cidr
  source_ranges = ["0.0.0.0/0"]

  allow {
    protocol = "tcp"
    ports = ["5000", "22"]
  }
}

# Backend vm
resource "google_compute_instance" "backend-vm" {
  name = "note-app-backend-vm"
  machine_type = "e2-micro"
  zone = "us-central1-a"

  tags = ["backend-vms"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
      size = 20
      type = "pd-balanced"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.backend-subnet.id

    access_config {
      
    }
  }
  

  metadata = {
    startup-script = <<-EOT
      #!/bin/bash
      set -e
      echo "[*] Updating system..."
      apt-get update -y
      apt-get upgrade -y

      echo "[*] Installing prerequisites..."
      apt-get install -y ca-certificates curl gnupg lsb-release

      echo "[*] Adding Docker's official GPG key..."
      mkdir -m 0755 -p /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

      echo "[*] Setting up Docker repo..."
      echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list

      apt-get update -y

      echo "[*] Installing Docker + Compose..."
      apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

      echo "[*] Enabling Docker..."
      systemctl enable docker
      systemctl start docker
      EOF
    EOT
  }
}

# DATABASE
resource "google_compute_instance" "db-vm" {
  name = "note-app-db-vm"
  machine_type = "e2-micro"
  zone = "us-central1-a"

  tags = ["backend-vms"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
      size = 20
      type = "pd-balanced"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.backend-subnet.id

    access_config {
      
    }
  }

  metadata = {
    startup-script = <<-EOT
      #!/bin/bash
      set -e
      echo "[*] Updating system..."
      apt-get update -y
      apt-get upgrade -y

      echo "[*] Installing prerequisites..."
      apt-get install -y ca-certificates curl gnupg lsb-release

      echo "[*] Adding Docker's official GPG key..."
      mkdir -m 0755 -p /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

      echo "[*] Setting up Docker repo..."
      echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list

      apt-get update -y

      echo "[*] Installing Docker + Compose..."
      apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

      echo "[*] Enabling Docker..."
      systemctl enable docker
      systemctl start docker
      EOF
    EOT
  }
}