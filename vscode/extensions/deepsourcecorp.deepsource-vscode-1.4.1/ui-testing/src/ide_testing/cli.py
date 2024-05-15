"""CLI interface for ide_testing."""
from __future__ import annotations

import argparse

import ide_testing


class CLIArgs:
    name: str


def cli(argv: list[str] | None = None) -> int:
    """CLI interface."""
    parser = argparse.ArgumentParser()
    ide_testing.main()
    return 0
