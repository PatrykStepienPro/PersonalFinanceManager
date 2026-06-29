#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Stopping .NET services..."
pkill -f "PFM.AuthService" 2>/dev/null
pkill -f "PFM.TransactionService" 2>/dev/null
pkill -f "PFM.BudgetService" 2>/dev/null
pkill -f "PFM.NotificationService" 2>/dev/null
pkill -f "PFM.BFF" 2>/dev/null

echo "Stopping Docker containers..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" stop

echo "All services stopped."
