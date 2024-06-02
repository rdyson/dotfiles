# ide-testing

Automated testing for the DeepSource IDE plugin.

## Installation

In a terminal window, run:

```bash
git clone https://github.com/DeepSourceCorp/ide-vscode
cd ide-vscode
# crete a venv first!
pip install ui-testing
```

## Usage

Open up a clone of `Gigarepo` in a VSCode instance, that has the desired
DeepSource extension already installed.

Then, in the terminal window, run `ide-testing`

## Local Development / Testing

Do `pip install -e ui-testing` instead, if you want to edit the code and test.

## Type Checking

Run `mypy .`
