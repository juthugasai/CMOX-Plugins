@echo off
set BRIDGE_URL=%CMOX_BRIDGE_URL%
if "%BRIDGE_URL%"=="" set BRIDGE_URL=http://localhost:7890

if "%1"=="health" (
  curl -s -X GET "%BRIDGE_URL%/health"
  goto end
)
if "%1"=="ingest" (
  curl -s -X POST "%BRIDGE_URL%/" -H "Content-Type: application/json" -H "X-CMOX-Plugin: incremental-backup" -d "{\"action\": \"%2\", \"data\": %3}"
  goto end
)
echo Usage: cli.bat [health ^| ingest ^<action^> ^<json_data^>]
:end
