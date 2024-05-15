"""ide-testing - Automated testing for the DeepSource IDE plugin."""
from __future__ import annotations
import os.path
import platform
import sys
import time

import pyautogui
import pyscreeze


DELAY = 0.1


def fix_scaling(image_box: pyscreeze.Box) -> pyscreeze.Box:
    """For some OSes, pyautogui x/y coord seems to be 2x the actual location."""
    if platform.system() == "Darwin":
        image_box = pyscreeze.Box(
            left=image_box.left // 2,
            top=image_box.top // 2,
            width=image_box.width // 2,
            height=image_box.height // 2,
        )

    return image_box


def locate(image_name: str) -> pyscreeze.Box:
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    assets_folder = os.path.join(root_dir, "assets", platform.system())
    image_path = os.path.join(assets_folder, f"{image_name}.png")
    assert os.path.exists(image_path)
    image_box = pyautogui.locateOnScreen(image_path, confidence=0.9)

    image_box = fix_scaling(image_box)
    return image_box


def locate_or_exit(image_name: str) -> pyscreeze.Box:
    try:
        image_box = locate(image_name)
    except pyautogui.ImageNotFoundException:
        pyautogui.alert(f"Could not find image {image_name}")
        sys.exit(1)

    return image_box


def move_to(image_name: str) -> None:
    location = locate_or_exit(image_name)
    pyautogui.moveTo(location)


def click(image_name: str) -> None:
    location = locate_or_exit(image_name)
    pyautogui.click(location)
    time.sleep(DELAY)


def write(text: str) -> None:
    pyautogui.write(text)


def delete_db_command():
    if platform.system() == "Darwin":
        return "rm -rf ~/Library/Application\\ Support/deepsource"
    if platform.system() == "Windows":
        return "rm -r -ErrorAction SilentlyContinue ~/AppData/Local/deepsource"
    raise NotImplementedError


def delete_cached_data_command():
    if platform.system() == "Darwin":
        return "rm -rf ~/Library/Application\\ Support/Code/User/globalStorage/deepsourcecorp.deepsource-vscode"
    if platform.system() == "Windows":
        return "rm -r -ErrorAction SilentlyContinue ~/AppData/Roaming/Code/User/globalStorage/deepsourcecorp.deepsource-vscode"

    raise NotImplementedError


def open_command_pallette() -> None:
    if platform.system() == "Darwin":
        return pyautogui.hotkey("command", "shift", "p")

    return pyautogui.hotkey("ctrl", "shift", "p")


def command_pallette(command: str) -> None:
    open_command_pallette()
    write(command)
    pyautogui.press("\n")


def open_file_search() -> None:
    if platform.system() == "Darwin":
        return pyautogui.hotkey("command", "p")

    return pyautogui.hotkey("ctrl", "p")


def open_file(file_name: str) -> None:
    open_file_search()
    write(file_name)
    pyautogui.press("\n")

def previous_window() -> None:
    if platform.system() == "Darwin":
        return pyautogui.hotkey("command", "tab")

    pyautogui.hotkey("alt", "tab")

def end_of_file() -> None:
    """Go to end of file."""
    if platform.system() == "Darwin":
        pyautogui.hotkey("command", "down")
        return

    pyautogui.hotkey("ctrl", "end")

def login_test():
    pyautogui.alert("Open Gigarepo and press OK.")

    if platform.system() != 'Windows':
        click("explorer")
        command_pallette("Focus term")

        click("terminal")
        pyautogui.hotkey("ctrl", "c")
        write(delete_db_command())
        pyautogui.press("\n")
        write(delete_cached_data_command())
        pyautogui.press("\n")
        command_pallette("Reload wi")
        time.sleep(2)

    click("explorer")
    click("deepsource")
    # Syncing takes some time
    time.sleep(4)

    # Login, and allow extension to open a browser
    click("connect_to_deepsource")
    time.sleep(2)
    click("open")
    time.sleep(4)

    try:
        # If we got logged out we'll see this screen
        location = locate("continue_with_github")
        pyautogui.click(location)
        time.sleep(6)
        # Hopefully we're logged into google still and this goes through
    except pyautogui.ImageNotFoundException:
        # We were already logged in
        pass

    click("approve")
    previous_window()

def analysis_test():
    click("explorer")
    open_file("demo_code.py")

    # go to bottom of file
    end_of_file()

    # Wait a little (otherwise the editor drops keys), and add new vuln
    pyautogui.press("\n")
    write("print(hasattr(1, '__call__'))")
    pyautogui.press("\n")

    # Run analysis
    command_pallette("Run analysis")


def windows_cleanup():
    pyautogui.alert("Make sure VSCode is closed, and press OK.")

    pyautogui.press("win")
    write("Terminal")
    pyautogui.press("\n")
    time.sleep(2)
    
    write(delete_db_command())
    pyautogui.press("\n")
    write(delete_cached_data_command())
    pyautogui.press("\n")
    time.sleep(2)

def main():
    if platform.system() == "Windows":
        windows_cleanup()

    login_test()
    pyautogui.alert("Click OK once analyzers have done installing.")
    analysis_test()


if __name__ == "__main__":
    main()
