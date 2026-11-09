"""Shared research boundaries. CSV escaping never mutates source records."""
import json
import re
import subprocess
from pathlib import Path


def spreadsheet_cell(value):
    if isinstance(value, str) and (re.match(r'^[\s\ufeff\x00-\x1f]*[=+@-]', value) or value.startswith(('\t', '\r', '\n'))):
        return "'" + value
    return value


def spreadsheet_row(row):
    return {key: spreadsheet_cell(value) for key, value in row.items()}


def safe_request(mode, url, timeout=15):
    """Only the Node bridge performs network I/O. No requests/urllib fallback."""
    bridge = Path(__file__).with_name('research-network.mjs')
    result = subprocess.run(['node', str(bridge), mode, url], capture_output=True,
                            text=True, timeout=timeout, check=True)
    return json.loads(result.stdout)
