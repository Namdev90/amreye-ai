# Historical document tooling

These 14 first-party scripts preserve parts of the 19 September 2026 project-document restructuring workflow. They were copied unchanged from that task's local `work/` folder on 20 September 2026 and compared byte for byte with the originals. They total 40,731 bytes. They are a historical source archive, not a portable build system or a complete recipe for reproducing the finished documents.

## Inventory

| Original script | Bytes | Role and principal inputs |
| --- | ---: | --- |
| `inspect_source.py` | 1,566 | Reads `source-master.docx`; extracts source blocks and headings |
| `source_stats.py` | 1,354 | Reads `source-master.docx`, `source-blocks.json`, and older local `product-final.pdf` / `product-consolidated.pdf` files |
| `build_documents.py` | 21,824 | Builds main/companion documents from `source-master.docx`, `source-blocks.json`, and `main.md`; writes `distribution-manifest.json` |
| `verify_documents.py` | 2,249 | Checks generated DOCX files using `source-blocks.json` and `distribution-manifest.json`; writes `verification.json` |
| `link_documents.py` | 1,022 | Rewrites document links using `drive-link-map.json` |
| `final_label_fix.py` | 625 | Adjusts paragraph grouping in three generated companion documents |
| `prepare_render_copies.py` | 1,205 | Creates rendering copies of output DOCX files with hyperlink wrappers flattened |
| `render_word.ps1` | 1,366 | Uses Microsoft Word to paginate and export local DOCX files to PDF |
| `render_pdf_pages.py` | 1,760 | Renders QA PDFs to page images and writes page metrics |
| `render_changed_pages.py` | 662 | Renders selected pages of local QA PDFs |
| `check_final_pages.py` | 745 | Inspects selected pages of local QA PDFs |
| `package_delivery.py` | 4,403 | Packages output documents using the source master, manifest, link map, verification report, and QA PDFs |
| `verify_final_readbacks.py` | 938 | Compares output files with remote downloads listed in `final-readback-urls.json` |
| `finalize_local.py` | 1,012 | Verifies the delivery ZIP and conditionally replaces a matching original desktop master with the finished master |

## Local inputs and portability

The scripts expect the original task layout: scripts and working inputs in `work/`, final files in sibling `outputs/`, and QA PDFs/images under `work/qa/`. Some scripts contain the original absolute Windows paths, document names, page selections, source-block ranges, and date-specific editorial assumptions. These are preserved as historical code, not recommendations for a new workflow.

This archive does not include the local `main.md`, `source-blocks.json`, `source-headings.json`, `distribution-manifest.json`, `drive-link-map.json`, verification reports, `final-readback-urls.json`, generated QA files, or older local PDFs. Some are intermediate outputs of the archived scripts; others were separately prepared inputs. The archive does not establish the complete execution order or capture every manual/editorial intervention.

The original master is already preserved in [`project-docs/AMREYE AI Main and Supporting Documents.zip`](../../project-docs/AMREYE%20AI%20Main%20and%20Supporting%20Documents.zip), at `Source backup/2026-09-19 Original master before restructuring.docx`. See the [document guide](../../project-docs/Start%20here.md) for the finished seven-page overview and seven supporting references. That original master is not the separately bundled 300-page Android compendium.

## Dependencies and execution limits

The Python scripts use the standard library and, where imported, `python-docx`, `lxml`, `pypdf`, `pypdfium2`, and Pillow. Rendering also depends on a local Poppler `pdftoppm` executable; Word export uses Windows PowerShell and an installed Microsoft Word COM application. Dependency versions and the original runtime environment were not captured as a reproducible lockfile for this archive.

Inspect and adapt paths in a separate working copy before execution. Several scripts overwrite generated documents, links, reports, or ZIP files. `finalize_local.py` can update a desktop document when its hash matches the original. `verify_final_readbacks.py` makes network requests using its separate URL input file. No scripts were executed as part of this archive import.

Validation of the import covered original-byte equality, syntax parsing of all 13 Python scripts, and a bounded scan for obvious credential or private-contact literals. No such literals were identified; this does not constitute an exhaustive security audit. Historical verification logic and recorded document claims should not be interpreted as newly performed validation.
