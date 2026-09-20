#!/usr/bin/env python3
"""AMR-Eye.AI Zone Detector - Enhanced Barebone Computer Vision Engine
Educational computer-vision demo for disk-diffusion AST plates.
Not for clinical diagnosis. Requires: opencv-python, numpy, pillow.

Usage:
  python amr_eye_zone_detector.py [--input sample_ast_plate.png] [--output annotated.png]
  python amr_eye_zone_detector.py --generate-sample
  python amr_eye_zone_detector.py --gui
"""
import argparse
import csv
import math
import os
import sys
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont


def load_best_font(size=28):
    """Cross-platform font loader with reliable fallbacks."""
    font_candidates = [
        "arial.ttf",
        "arialbd.ttf",
        "calibri.ttf",
        "DejaVuSans-Bold.ttf",
        "DejaVuSans.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "C:\\Windows\\Fonts\\arial.ttf",
        "C:\\Windows\\Fonts\\calibri.ttf",
    ]
    for font_name in font_candidates:
        try:
            return ImageFont.truetype(font_name, size)
        except Exception:
            continue
    return ImageFont.load_default()


def generate_sample(path='sample_ast_plate.png'):
    """Generates a synthetic AST plate for demonstration and testing."""
    import random
    size = 1000
    img = Image.new('RGB', (size, size), (14, 24, 30))
    draw = ImageDraw.Draw(img)
    cx = cy = size // 2
    r = int(size * 0.43)
    
    # Petri dish outer boundary
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(212, 178, 145), outline=(230, 230, 220), width=8)
    
    # Bacterial lawn texture simulation
    random.seed(4)
    for _ in range(15000):
        ang = random.random() * 2 * math.pi
        rr = r * math.sqrt(random.random()) * 0.97
        px = int(cx + math.cos(ang) * rr)
        py = int(cy + math.sin(ang) * rr)
        draw.point((px, py), fill=random.choice([(125, 78, 64), (138, 89, 71), (150, 98, 79), (105, 70, 60)]))

    # Antibiotic paper discs with inhibition zone halos
    discs = [
        ('CIP', 270, 310, 118),
        ('GEN', 690, 290, 82),
        ('AMP', 320, 670, 50),
        ('CTX', 720, 630, 140),
        ('MER', 520, 510, 105)
    ]
    font = load_best_font(26)
    
    for lab, x, y, halo in discs:
        # Clear inhibition halo
        draw.ellipse((x - halo, y - halo, x + halo, y + halo), fill=(224, 188, 154), outline=(245, 215, 185), width=3)
        # White antibiotic disc
        draw.ellipse((x - 36, y - 36, x + 36, y + 36), fill=(242, 243, 236), outline=(80, 80, 80), width=3)
        # Disc text label
        try:
            bb = draw.textbbox((0, 0), lab, font=font)
            tw, th = bb[2] - bb[0], bb[3] - bb[1]
        except Exception:
            tw, th = 30, 20
        draw.text((x - tw / 2, y - th / 2), lab, fill=(20, 28, 30), font=font)
        
    img.save(path)
    print(f"[+] Successfully generated synthetic AST plate sample: {path}")


def detect_discs(gray):
    """Robust multi-pass disc detector (Fixed Threshold + Otsu + Hough Circles)."""
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    discs = []

    # Pass 1: High binary thresholding for bright paper discs
    _, th1 = cv2.threshold(blur, 220, 255, cv2.THRESH_BINARY)
    th1 = cv2.morphologyEx(th1, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    contours, _ = cv2.findContours(th1, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    for c in contours:
        area = cv2.contourArea(c)
        if 400 < area < 10000:
            (x, y), r = cv2.minEnclosingCircle(c)
            if 16 < r < 60:
                discs.append((int(x), int(y), int(r)))

    # Pass 2: Fallback to Otsu thresholding if few discs were detected
    if len(discs) < 3:
        _, th2 = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        th2 = cv2.morphologyEx(th2, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
        contours, _ = cv2.findContours(th2, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for c in contours:
            area = cv2.contourArea(c)
            if 400 < area < 10000:
                (x, y), r = cv2.minEnclosingCircle(c)
                if 16 < r < 60:
                    discs.append((int(x), int(y), int(r)))

    # Pass 3: Fallback to Hough Circle Transform if needed
    if not discs:
        circles = cv2.HoughCircles(blur, cv2.HOUGH_GRADIENT, dp=1.2, minDist=60, param1=50, param2=30, minRadius=16, maxRadius=60)
        if circles is not None:
            for (x, y, r) in np.round(circles[0, :]).astype("int"):
                discs.append((int(x), int(y), int(r)))

    # Non-maximum suppression / deduplication
    clean_discs = []
    for x, y, r in sorted(discs, key=lambda d: d[2], reverse=True):
        if not any(math.hypot(x - cx, y - cy) < (r + cr) * 0.7 for cx, cy, cr in clean_discs):
            clean_discs.append((x, y, r))

    clean_discs = sorted(clean_discs, key=lambda p: (p[1], p[0]))
    return clean_discs[:12]


def radial_zone(gray, x, y, disc_r, start_r=40, stop_r=220):
    """Calculates clear inhibition zone radius using radial intensity profiles."""
    h, w = gray.shape
    angles = np.linspace(0, 2 * np.pi, 90, endpoint=False)
    
    # Calculate background lawn intensity level near disc neighborhood
    sample_radii = np.arange(start_r, min(stop_r, min(x, y, w - x, h - y)), 2)
    profile = []

    for r in sample_radii:
        ring_vals = []
        for a in angles:
            gx = int(x + math.cos(a) * r)
            gy = int(y + math.sin(a) * r)
            if 0 <= gx < w and 0 <= gy < h:
                ring_vals.append(gray[gy, gx])
        if ring_vals:
            profile.append((r, float(np.mean(ring_vals))))

    if not profile:
        return stop_r

    # Find where profile drops below lawn cutoff intensity
    mean_intensities = [val for _, val in profile]
    lawn_baseline = np.percentile(mean_intensities, 30)
    halo_brightness = mean_intensities[0]
    threshold = (halo_brightness + lawn_baseline) / 2.0 if halo_brightness > lawn_baseline else 155.0

    for r, val in profile:
        if val <= threshold or val <= 155.0:
            return r

    return stop_r


def interpret(zone_mm):
    """Demo SIR interpretation thresholds."""
    if zone_mm >= 22.0:
        return 'S'  # Susceptible
    elif zone_mm >= 16.0:
        return 'I'  # Intermediate
    else:
        return 'R'  # Resistant


def draw_header_bar(img, total_discs, sir_counts):
    """Draws a professional top summary banner on the annotated image."""
    h, w, _ = img.shape
    banner_h = 70
    overlay = img.copy()
    cv2.rectangle(overlay, (0, 0), (w, banner_h), (20, 25, 35), -1)
    cv2.addWeighted(overlay, 0.85, img, 0.15, 0, img)
    
    cv2.putText(img, "AMR-Eye.AI ZONE DETECTOR", (20, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.85, (255, 255, 255), 2)
    cv2.putText(img, f"Discs Detected: {total_discs} | Calibration: 5px = 1mm", (20, 58), cv2.FONT_HERSHEY_SIMPLEX, 0.48, (200, 210, 220), 1)
    
    # SIR Legend badges
    badges = [
        (f"S (Susceptible): {sir_counts.get('S', 0)}", (80, 255, 190)),
        (f"I (Intermediate): {sir_counts.get('I', 0)}", (0, 215, 255)),
        (f"R (Resistant): {sir_counts.get('R', 0)}", (80, 80, 255)),
    ]
    start_x = w - 460
    for text, col in badges:
        cv2.rectangle(img, (start_x, 20), (start_x + 135, 50), (40, 45, 55), -1)
        cv2.rectangle(img, (start_x, 20), (start_x + 135, 50), col, 1)
        cv2.putText(img, text, (start_x + 8, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.42, col, 1)
        start_x += 145


def run(input_path, output_path='annotated_zone_detection.png', csv_path='zone_results.csv'):
    """Main processing loop: loads image, detects discs & zones, renders output."""
    path_obj = Path(input_path)
    if not path_obj.exists():
        print(f"[!] Input file '{input_path}' not found. Generating sample plate...")
        generate_sample(input_path)

    img = cv2.imread(str(input_path))
    if img is None:
        raise FileNotFoundError(f"Could not load image: {input_path}")
    
    img = cv2.resize(img, (1000, 1000))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    discs = detect_discs(gray)
    rows = []
    sir_counts = {'S': 0, 'I': 0, 'R': 0}
    
    # Copy for semi-transparent zone overlays
    overlay = img.copy()

    for idx, (x, y, dr) in enumerate(discs, 1):
        zone_px = radial_zone(gray, x, y, dr)
        zone_mm = round(zone_px / 5.0, 1)  # Demo scale: 5 px = 1 mm
        sir = interpret(zone_mm)
        sir_counts[sir] = sir_counts.get(sir, 0) + 1
        
        color_map = {
            'S': (80, 255, 190),  # Green/Cyan
            'I': (0, 215, 255),   # Yellow/Orange
            'R': (80, 80, 255)    # Red
        }
        color = color_map[sir]

        # Draw filled semi-transparent halo zone
        cv2.circle(overlay, (x, y), zone_px, color, -1)
        cv2.circle(img, (x, y), zone_px, color, 3)
        cv2.circle(img, (x, y), dr, (255, 255, 255), 2)
        
        # Label box behind text
        label_text = f"D{idx}: {zone_mm}mm ({sir})"
        (tw, th), baseline = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 2)
        tx, ty = x + zone_px + 8, y + 5
        
        # Keep text within bounds
        if tx + tw > 980:
            tx = x - zone_px - tw - 12
            
        cv2.rectangle(img, (tx - 4, ty - th - 4), (tx + tw + 4, ty + baseline + 2), (20, 25, 35), -1)
        cv2.rectangle(img, (tx - 4, ty - th - 4), (tx + tw + 4, ty + baseline + 2), color, 1)
        cv2.putText(img, label_text, (tx, ty), cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2)

        rows.append({
            'disc': f'D{idx}',
            'x': x,
            'y': y,
            'disc_radius_px': dr,
            'zone_radius_px': zone_px,
            'zone_mm_demo': zone_mm,
            'interpretation_demo': sir
        })

    # Blend semi-transparent halos with original image
    cv2.addWeighted(overlay, 0.20, img, 0.80, 0, img)

    # Draw header dashboard banner
    draw_header_bar(img, len(rows), sir_counts)

    # Save output image & CSV
    cv2.imwrite(str(output_path), img)
    
    fieldnames = ['disc', 'x', 'y', 'disc_radius_px', 'zone_radius_px', 'zone_mm_demo', 'interpretation_demo']
    with open(csv_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        if rows:
            writer.writerows(rows)

    print(f"\n=======================================================")
    print(f"[+] AMR-Eye.AI Zone Detector execution complete!")
    print(f"[+] Discs Detected  : {len(rows)}")
    print(f"[+] Results Image   : {output_path}")
    print(f"[+] CSV Data Export : {csv_path}")
    print(f"=======================================================\n")
    return output_path, csv_path


def select_file_gui():
    """Opens a native GUI file chooser dialog if tkinter is available."""
    try:
        import tkinter as tk
        from tkinter import filedialog
        root = tk.Tk()
        root.withdraw()
        filename = filedialog.askopenfilename(
            title="Select AST Plate Image",
            filetypes=[("Image files", "*.png *.jpg *.jpeg *.bmp *.tif"), ("All files", "*.*")]
        )
        return filename
    except Exception:
        return None


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description="AMR-Eye.AI Zone Detector")
    ap.add_argument('--input', default='sample_ast_plate.png', help="Input image file path")
    ap.add_argument('--output', default='annotated_zone_detection.png', help="Output annotated image path")
    ap.add_argument('--csv', default='zone_results.csv', help="Output CSV path")
    ap.add_argument('--generate-sample', action='store_true', help="Force generate synthetic sample plate")
    ap.add_argument('--gui', action='store_true', help="Open file picker dialog to choose image")

    args = ap.parse_args()

    # If --gui or double-clicked without arguments, offer interactive file selection
    input_file = args.input
    if args.gui:
        selected = select_file_gui()
        if selected:
            input_file = selected

    if args.generate_sample or not Path(input_file).exists():
        generate_sample(input_file)
    
    out_img, out_csv = run(input_file, args.output, args.csv)
