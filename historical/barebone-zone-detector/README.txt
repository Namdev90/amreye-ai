AMR-Eye AI Zone Detector — Enhanced Barebone Demo
===================================================
Educational computer-vision demo for disk-diffusion AST (Antibiotic Susceptibility Testing) plates.
NOT FOR CLINICAL USE. For demonstration/presentation purposes only.

QUICK START (ONE CLICK)
-----------------------
Just double-click:  Run_AMR_Eye.bat

The launcher will:
  1. Check Python is installed
  2. Auto-install missing dependencies (opencv-python, numpy, pillow)
  3. Show a menu: run on sample plate, pick a custom image, or regenerate sample
  4. Automatically open the annotated result image when done

MANUAL USAGE
------------
  python amr_eye_zone_detector.py                          # Run on default sample plate
  python amr_eye_zone_detector.py --gui                    # Pick image with file dialog
  python amr_eye_zone_detector.py --input myplate.png      # Custom input file
  python amr_eye_zone_detector.py --generate-sample        # Re-generate synthetic sample
  python amr_eye_zone_detector.py --output out.png --csv data.csv

INSTALL DEPENDENCIES
--------------------
  pip install -r requirements.txt

OUTPUT FILES
------------
  annotated_zone_detection.png  — Image with disc circles, zone halos, SIR labels, header dashboard
  zone_results.csv              — Disc-by-disc zone measurements and SIR interpretation

WHAT IT DOES
------------
  - Auto-detects antibiotic paper discs using multi-pass computer vision (Threshold + Otsu + Hough)
  - Measures inhibition zone radius by radial intensity scanning (adaptive thresholding)
  - Classifies each disc as S (Susceptible), I (Intermediate), or R (Resistant) via demo thresholds
  - Renders coloured overlays with a summary dashboard banner on the output image
  - Exports structured data to CSV

CLINICAL NOTE
-------------
Zone breakpoints in this demo are placeholders. Real clinical use requires CLSI/EUCAST
breakpoint tables referenced by organism, drug, and method. Always consult a clinical
microbiologist for actual AST interpretation.
