#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACK_DIR="$ROOT_DIR/Logra-Back/Logra-API"
FRONT_DIR="$ROOT_DIR/Logra-Front-Ng"

BACK_PID=""
FRONT_PID=""

cleanup() {
  echo
  echo "Deteniendo servicios..."
  [[ -n "$BACK_PID" ]] && kill -TERM "$BACK_PID" 2>/dev/null || true
  [[ -n "$FRONT_PID" ]] && kill -TERM "$FRONT_PID" 2>/dev/null || true
  echo "Servicios detenidos."
}
trap cleanup EXIT INT TERM

echo "Verificando dependencias..."
command -v dotnet >/dev/null || exit 1
command -v npm >/dev/null || exit 1

# 🔒 VARIABLES CLAVE (ESTA ERA LA QUE FALTABA)
export ASPNETCORE_ENVIRONMENT=Development
export NG_CLI_ANALYTICS=false
export NG_CLI_DISABLE_AUTOCOMPLETION=1
export CI=true

echo "Iniciando Backend (.NET)..."
(
  cd "$BACK_DIR"
  dotnet run < /dev/null
) &
BACK_PID=$!

echo "Iniciando Frontend (Angular)..."
(
  cd "$FRONT_DIR"
  npm run start < /dev/null
) &
FRONT_PID=$!

echo "Backend PID: $BACK_PID"
echo "Frontend PID: $FRONT_PID"
echo "Ambos servicios están iniciados. Ctrl+C para detener."

wait -n "$BACK_PID" "$FRONT_PID"
