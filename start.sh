#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting Docker (SQL Server + RabbitMQ)..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" up -d

echo "Waiting for SQL Server to be ready..."
sleep 10

gnome-terminal --title="Auth Service" -- bash -c "cd '$SCRIPT_DIR/services/AuthService/PFM.AuthService' && dotnet run; exec bash"
gnome-terminal --title="Transaction Service" -- bash -c "cd '$SCRIPT_DIR/services/TransactionService/PFM.TransactionService' && dotnet run; exec bash"
gnome-terminal --title="BFF" -- bash -c "cd '$SCRIPT_DIR/services/BFF/PFM.BFF' && dotnet run; exec bash"

echo "All services starting. Check the terminal windows for logs."
