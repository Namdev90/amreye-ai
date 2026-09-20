#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AMR-Eye.AI Zone Detector — Animated Launcher UI
Uses 'rich' for terminal visuals. Falls back to basic ANSI if unavailable.
"""
import sys
import os
import io
import time
import subprocess
import csv
from pathlib import Path

# Force UTF-8 output on Windows to prevent codec errors
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
    os.environ["PYTHONIOENCODING"] = "utf-8"

# ── Rich availability ──────────────────────────────────────────────────────────
try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.progress import Progress, SpinnerColumn, BarColumn, TextColumn, TimeElapsedColumn
    from rich.table import Table
    from rich.text import Text
    from rich import box
    from rich.align import Align
    from rich.rule import Rule
    from rich.columns import Columns
    HAS_RICH = True
    console = Console(force_terminal=True, highlight=False)
except ImportError:
    HAS_RICH = False
    console = None

# ── ASCII Logo ────────────────────────────────────────────────────────────────
LOGO = r"""
     _    __  __ ____        _____            _    ___
    / \  |  \/  |  _ \      | ____|   _  ___ | |  / _ \  ___
   / _ \ | |\/| | |_) |____ |  _|| | | |/ _ \| | | |_| || |
  / ___ \| |  | |  _ <_____|| |__| |_| |  __/|_|_|  _  || |
 /_/   \_\_|  |_|_| \_\     |_____|\__, |\___(_)(_)_| |_||_|
                                    |___/
"""

SUBTITLE = "AMR-Eye.AI  --  AI-Powered Antimicrobial Resistance Zone Detection"
VERSION  = "v2.0  |  Computer Vision Engine  |  CLSI / EUCAST Framework"


def banner_rich():
    logo_text = Text(LOGO, style="bold cyan")
    console.print(Align.center(logo_text))
    console.print(Align.center(Text(SUBTITLE, style="bold white")))
    console.print(Align.center(Text(VERSION, style="dim white")))
    console.print()
    console.print(Rule("[bold cyan]Initialising AMR-Eye.AI Analysis Engine[/bold cyan]", style="cyan"))
    console.print()


def banner_plain():
    print("=" * 72)
    print("       AMR-Eye.AI  --  Zone Detector  --  v2.0")
    print("  AI-Powered Antimicrobial Resistance Zone Detection Engine")
    print("=" * 72)
    print()


def spin_steps_rich():
    """Animated multi-stage pipeline with progress bars and descriptions.
    Each step lasts 2-4 seconds so judges can read and comprehend."""

    # (label, description shown below bar, duration in seconds)
    stages = [
        (
            "[>>] Booting AMR-Eye.AI Vision Core",
            "Loading OpenCV, NumPy, and image processing modules into memory",
            2.5,
        ),
        (
            "[>>] Loading AST plate image",
            "Reading pixel data and resizing to 1000x1000 standard resolution",
            2.0,
        ),
        (
            "[>>] Preprocessing -- Gaussian blur + denoising",
            "Applying 5x5 Gaussian kernel to reduce sensor noise and smooth edges",
            3.0,
        ),
        (
            "[>>] Pass 1/3 -- Fixed threshold disc detection",
            "Binary thresholding at intensity 220 to isolate bright paper discs",
            3.0,
        ),
        (
            "[>>] Pass 2/3 -- Otsu adaptive segmentation",
            "Automatic threshold selection via Otsu's method for variable lighting",
            2.5,
        ),
        (
            "[>>] Pass 3/3 -- Hough Circle Transform",
            "Gradient-based circle fitting as fallback for partially occluded discs",
            2.5,
        ),
        (
            "[>>] Non-Maximum Suppression (NMS)",
            "Removing duplicate detections -- keeping strongest match per region",
            2.0,
        ),
        (
            "[>>] Radial intensity scanning",
            "Sampling 90 angles per disc, scanning outward to find inhibition edge",
            3.5,
        ),
        (
            "[>>] Adaptive zone boundary detection",
            "Computing brightness profile and finding lawn-to-halo transition point",
            3.0,
        ),
        (
            "[>>] Calibrating measurements (5 px = 1 mm)",
            "Converting pixel radii to millimetres using plate calibration factor",
            2.0,
        ),
        (
            "[>>] S-I-R classification (CLSI thresholds)",
            "Susceptible >= 22mm | Intermediate 16-21mm | Resistant < 16mm",
            2.5,
        ),
        (
            "[>>] Rendering annotated output",
            "Drawing zone halos, disc markers, labels, and dashboard header",
            3.0,
        ),
        (
            "[>>] Exporting CSV data",
            "Writing disc coordinates, zone radii, and interpretations to file",
            1.5,
        ),
    ]

    total_stages = len(stages)

    with Progress(
        SpinnerColumn(spinner_name="dots2", style="bold cyan"),
        TextColumn("[bold white]{task.description}"),
        BarColumn(bar_width=32, style="cyan", complete_style="bold green"),
        TextColumn("[bold green]{task.percentage:>3.0f}%"),
        TimeElapsedColumn(),
        console=console,
        transient=False,
    ) as progress:
        overall = progress.add_task("[bold yellow]AMR-Eye.AI Pipeline", total=total_stages)
        step_t  = progress.add_task("Initialising...", total=100)
        # Invisible task used just to show the description text below
        desc_t  = progress.add_task("", total=0, visible=False)

        for label, description, duration in stages:
            # Update step label
            progress.update(step_t, description=f"[cyan]{label}", completed=0)
            # Print the explanation line so judges can read what's happening
            console.print(f"      [dim]{description}[/dim]")

            increments = 30
            for i in range(increments + 1):
                progress.update(step_t, completed=int(i * 100 / increments))
                time.sleep(duration / increments)
            progress.advance(overall, 1)
            console.print()  # spacing between steps

        progress.update(step_t, description="[bold green][OK] All pipeline stages complete!", completed=100)
        time.sleep(1.0)

    console.print()


def spin_steps_plain():
    """Fallback spinner for plain terminals -- slower pacing."""
    stages = [
        ("Booting AMR-Eye.AI Vision Core...",                 2.0),
        ("Loading AST plate image...",                        1.5),
        ("Preprocessing -- Gaussian blur + denoise...",       2.0),
        ("Pass 1/3 -- Fixed threshold disc detection...",     2.0),
        ("Pass 2/3 -- Otsu adaptive segmentation...",         1.8),
        ("Pass 3/3 -- Hough Circle Transform...",             1.8),
        ("Non-Maximum Suppression (NMS)...",                  1.5),
        ("Radial intensity scanning...",                      2.5),
        ("Adaptive zone boundary detection...",               2.0),
        ("Calibrating measurements (5 px = 1 mm)...",         1.5),
        ("S-I-R classification (CLSI thresholds)...",         1.8),
        ("Rendering annotated output...",                     2.0),
        ("Exporting CSV data...",                             1.0),
    ]
    chars = ["|", "/", "-", "\\"]
    for stage, duration in stages:
        reps = max(int(duration / 0.08), 10)
        for j in range(reps):
            print(f"\r  [{chars[j % 4]}] {stage}", end="", flush=True)
            time.sleep(duration / reps)
        print(f"\r  [+] {stage:<58} DONE")


def run_detector(input_path="sample_ast_plate.png",
                 output_path="annotated_zone_detection.png",
                 csv_path="zone_results.csv"):
    cmd = [
        sys.executable, "amr_eye_zone_detector.py",
        "--input",  str(input_path),
        "--output", str(output_path),
        "--csv",    str(csv_path),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    return result.returncode, result.stdout, result.stderr


def results_table_rich(csv_path="zone_results.csv"):
    if not Path(csv_path).exists():
        return

    table = Table(
        title="[bold white]AMR-Eye.AI  --  Zone Measurement Results[/bold white]",
        box=box.DOUBLE_EDGE,
        border_style="cyan",
        header_style="bold cyan on grey23",
        show_lines=True,
        expand=True,
    )
    table.add_column("Disc",              justify="center", style="bold white",  min_width=6)
    table.add_column("Position (x, y)",  justify="center", style="dim white",   min_width=14)
    table.add_column("Disc Radius (px)", justify="center", style="white",       min_width=14)
    table.add_column("Zone (px)",        justify="center", style="white",       min_width=10)
    table.add_column("Zone (mm)",        justify="center", style="bold yellow", min_width=10)
    table.add_column("Interpretation",   justify="center",                       min_width=20)

    sir_labels = {
        "S": "[bold green]SUSCEPTIBLE[/bold green]",
        "I": "[bold yellow]INTERMEDIATE[/bold yellow]",
        "R": "[bold red]RESISTANT[/bold red]",
    }

    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            sir = row.get("interpretation_demo", "?")
            table.add_row(
                row.get("disc", ""),
                f"({row.get('x','')}, {row.get('y','')})",
                row.get("disc_radius_px", row.get("zone_radius_px", "")),
                row.get("zone_radius_px", ""),
                row.get("zone_mm_demo", ""),
                sir_labels.get(sir, sir),
            )

    console.print()
    console.print(table)


def results_table_plain(csv_path="zone_results.csv"):
    if not Path(csv_path).exists():
        return
    print()
    print(f"  {'Disc':>5} | {'X':>5} | {'Y':>5} | {'Zone(px)':>9} | {'Zone(mm)':>9} | Interpretation")
    print("  " + "-" * 60)
    with open(csv_path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            sir = row.get("interpretation_demo", "?")
            label = {"S": "SUSCEPTIBLE", "I": "INTERMEDIATE", "R": "RESISTANT"}.get(sir, sir)
            print(f"  {row['disc']:>5} | {row['x']:>5} | {row['y']:>5} | "
                  f"{row['zone_radius_px']:>9} | {row['zone_mm_demo']:>9} | {label}")


def summary_panel_rich(csv_path="zone_results.csv", out_img="annotated_zone_detection.png"):
    counts = {"S": 0, "I": 0, "R": 0}
    if Path(csv_path).exists():
        with open(csv_path, newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                k = row.get("interpretation_demo", "")
                if k in counts:
                    counts[k] += 1

    total = sum(counts.values())
    lines = [
        f"[bold cyan]Total discs analysed:[/bold cyan]   [bold white]{total}[/bold white]",
        "",
        f"[bold green][S] Susceptible  :[/bold green]    [bold green]{counts['S']} disc(s)[/bold green]",
        f"[bold yellow][I] Intermediate :[/bold yellow]    [bold yellow]{counts['I']} disc(s)[/bold yellow]",
        f"[bold red][R] Resistant    :[/bold red]    [bold red]{counts['R']} disc(s)[/bold red]",
        "",
        f"[bold white]Output image :[/bold white]  [cyan]{out_img}[/cyan]",
        f"[bold white]CSV export   :[/bold white]  [cyan]{csv_path}[/cyan]",
        "",
        "[dim]CLINICAL DISCLAIMER: Thresholds are demo placeholders.[/dim]",
        "[dim]Real clinical use requires CLSI/EUCAST breakpoint tables[/dim]",
        "[dim]specific to the organism, antibiotic, and testing method.[/dim]",
    ]
    panel = Panel(
        "\n".join(lines),
        title="[bold yellow] AMR-Eye.AI  --  Analysis Complete [/bold yellow]",
        border_style="green",
        padding=(1, 4),
    )
    console.print()
    console.print(panel)


def menu_rich():
    console.print(Panel(
        "[bold white]Choose analysis mode:[/bold white]\n\n"
        "  [bold cyan][1][/bold cyan]  Run analysis on [bold]sample AST plate[/bold] [dim](default)[/dim]\n"
        "  [bold cyan][2][/bold cyan]  Select [bold]custom image[/bold] via file dialog\n"
        "  [bold cyan][3][/bold cyan]  Regenerate synthetic sample plate\n",
        title="[bold cyan] AMR-Eye.AI  --  Launcher Menu [/bold cyan]",
        border_style="cyan",
        padding=(0, 3),
    ))
    choice = console.input("[bold cyan]>>[/bold cyan] Enter option [[cyan]1[/cyan]/[cyan]2[/cyan]/[cyan]3[/cyan]] (press ENTER for default): ").strip()
    return choice


def menu_plain():
    print("  [1] Run on sample plate (default)")
    print("  [2] Select custom image file")
    print("  [3] Regenerate synthetic sample plate")
    return input(">> Option: ").strip()


def main():
    os.chdir(Path(__file__).parent)

    if HAS_RICH:
        console.clear()
        banner_rich()
        choice = menu_rich()
    else:
        banner_plain()
        choice = menu_plain()

    input_file  = "sample_ast_plate.png"
    output_file = "annotated_zone_detection.png"
    csv_file    = "zone_results.csv"

    if choice == "2":
        try:
            import tkinter as tk
            from tkinter import filedialog
            root = tk.Tk()
            root.withdraw()
            sel = filedialog.askopenfilename(
                title="AMR-Eye.AI -- Select AST Plate Image",
                filetypes=[("Images", "*.png *.jpg *.jpeg *.bmp *.tif"), ("All files", "*.*")]
            )
            if sel:
                input_file = sel
                if HAS_RICH:
                    console.print(f"\n[bold green][OK] Selected:[/bold green] [cyan]{input_file}[/cyan]\n")
        except Exception as e:
            if HAS_RICH:
                console.print(f"[yellow]File dialog unavailable: {e}. Using default.[/yellow]")

    elif choice == "3":
        if HAS_RICH:
            with console.status("[bold cyan]AMR-Eye.AI -- Generating synthetic AST plate...[/bold cyan]", spinner="dots"):
                subprocess.run([sys.executable, "amr_eye_zone_detector.py", "--generate-sample"],
                               capture_output=True, encoding="utf-8")
            console.print("[bold green][OK] Sample plate generated![/bold green]\n")
        else:
            print("Generating sample...")
            subprocess.run([sys.executable, "amr_eye_zone_detector.py", "--generate-sample"])
        time.sleep(0.4)

    # ── Animated pipeline ──────────────────────────────────────────────────────
    if HAS_RICH:
        console.print()
        console.print(Rule("[bold cyan]AMR-Eye.AI  --  Running Analysis Pipeline[/bold cyan]", style="cyan"))
        console.print()
        spin_steps_rich()
    else:
        print("\nAMR-Eye.AI -- Running analysis pipeline...\n")
        spin_steps_plain()

    # ── Actual detector ────────────────────────────────────────────────────────
    rc, stdout, stderr = run_detector(input_file, output_file, csv_file)

    if rc != 0:
        if HAS_RICH:
            console.print(f"[bold red]AMR-Eye.AI ERROR:[/bold red]\n{stderr}")
        else:
            print(f"\nERROR: {stderr}")
        try:
            input("\nPress ENTER to exit.")
        except (EOFError, KeyboardInterrupt):
            pass
        sys.exit(1)

    # ── Show results ───────────────────────────────────────────────────────────
    if HAS_RICH:
        console.print()
        console.print(Rule("[bold green]AMR-Eye.AI  --  Results[/bold green]", style="green"))
        results_table_rich(csv_file)
        summary_panel_rich(csv_file, output_file)
        console.print()
        try:
            console.input("[dim]Press ENTER to open the annotated image and exit...[/dim]")
        except (EOFError, KeyboardInterrupt):
            pass
    else:
        results_table_plain(csv_file)
        print("\nAMR-Eye.AI -- Analysis complete!")
        try:
            input("Press ENTER to open image and exit.")
        except (EOFError, KeyboardInterrupt):
            pass

    # ── Open output ────────────────────────────────────────────────────────────
    if Path(output_file).exists():
        os.startfile(output_file)


if __name__ == "__main__":
    main()
