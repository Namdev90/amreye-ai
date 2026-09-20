# Historical barebone zone detector

This folder preserves an earlier educational Python/OpenCV disk-diffusion demonstration. It is a historical source snapshot, separate from the current web application and Android package. It is not a clinically validated AST reader.

## Provenance

The five original source and setup files were copied unchanged on 20 September 2026 from the project owner's local `AMR_Eye_Barebone_AI_Zone_Detector/amr_eye_ai_barebone_model` folder. Their byte content was compared with the originals after copying. No Git metadata was present in that source folder, so its original creation date and intermediate revisions cannot be established from this snapshot. Version strings inside the original files belong to that historical demo.

| Original file | Purpose |
| --- | --- |
| `amr_eye_zone_detector.py` | Synthetic plate generation, disc detection, radial zone estimation, annotated image and CSV output |
| `launcher.py` | Interactive terminal launcher |
| `Run_AMR_Eye.bat` | Original Windows launcher and dependency installation |
| `requirements.txt` | Original, unpinned dependency list |
| `README.txt` | Original instructions and clinical-use warning |

The original detector uses demonstration scaling and placeholder S/I/R thresholds. These are not organism- and drug-specific clinical breakpoints. Historical claims in interface text do not establish measured accuracy, trained AI performance, standards compliance, or clinical suitability.

## Inspecting or running the snapshot

Read `README.txt` and the source before running it. Use a separate Python environment and install the dependencies from `requirements.txt`. Dependency versions were not locked in the original source. The archive import was checked for byte preservation and Python syntax; it was not independently validated for scientific accuracy or compatibility with current dependency versions.

From this folder, the detector can generate its own synthetic input:

```sh
python amr_eye_zone_detector.py --generate-sample
python amr_eye_zone_detector.py
```

Generated images and CSV files are not historical source files and are not included. The original Windows batch launcher also enables terminal color support through a per-user Windows Registry setting and may install packages; the direct Python commands avoid invoking that launcher.

See the [development history](../../docs/development-history.md) for the relationship between this snapshot, the website, Android application, and project documents.
