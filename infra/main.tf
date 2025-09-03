# Create VPC
resource "google_compute_network" "note-app-vpc" {
  name = "note-app-vpc"
}

# Create subnet for frontend
resource "google_compute_subnetwork" "frontend-subnet" {
  name = "note-app-frontend-subnet"
  ip_cidr_range = "10.0.1.0/24"
  region = "us-central1"
  network = google_compute_network.note-app-vpc.id
}

# Firewall rules for frontend
resource "google_compute_firewall" "frontend-subnet-fw" {
  name = "note-app-frontend-subnet-fw"
  network = google_compute_network.note-app-vpc.name
  direction = "INGRESS"
  target_tags = ["frontend-vms"]

  allow {
    protocol = "tcp"
    ports = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"] # Allow trafic from this ip address
}

# Create subnet for backend
resource "google_compute_subnetwork" "backend-subnet" {
  name = "note-app-backend-subnet"
  ip_cidr_range = "10.0.2.0/24"
  region = "us-central1"
  network = google_compute_network.note-app-vpc.id
}

# Firewall rules for the backend subnet
resource "google_compute_firewall" "backend-subnet-fw" {
  name = "note-app-backend-subnet-fw"
  network = google_compute_network.note-app-vpc.name

  direction = "INGRESS"
  target_tags = ["backend-vms"]
  source_ranges = ["10.0.1.0/24"] # frontend subnet cidr

  allow {
    protocol = "tcp"
    ports = ["5000"]
  }
}