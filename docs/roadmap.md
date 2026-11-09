# Roadmap

This is a list of remaining development and verification work, not a schedule or a claim that capabilities have been delivered.

## Release engineering

- Maintain the external Android signing process introduced for v1.5.7, including owner-controlled key custody, backup and release-artifact verification. The published signed APK does not replace device acceptance testing.
- Test installation, upgrades, back navigation, system insets, downloads, PDF opening, connectivity loss, and the offline library on physical Android devices.
- Keep the Android offline content and website intentionally versioned; document a reproducible content-generation process before assuming they update together.
- Maintain the existing MIT software-license notices and review third-party/document/brand attribution separately.

## Product and research

- Define the Reader V1 measurement scope, representative inputs, calibration process, unreadable handling, and independent comparison criteria.
- Preserve measured, derived, simulated, and reviewed values as distinct records.
- Evaluate proposed hardware and integrations individually before promoting them to supported features.
- Use the [detailed development reference](../project-docs/Supporting%20documents/AMREYE%20AI%20Development%20Roadmap%20and%20Advanced%20Architecture.docx) for the wider research programme.

The synthetic demonstration and historical detector are not validation evidence for clinical deployment.
