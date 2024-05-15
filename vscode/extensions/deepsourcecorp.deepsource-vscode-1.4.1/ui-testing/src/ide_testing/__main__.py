"""Support executing the CLI by doing `python -m ide_testing`."""
from __future__ import annotations

from ide_testing.cli import cli

if __name__ == "__main__":
    raise SystemExit(cli())
