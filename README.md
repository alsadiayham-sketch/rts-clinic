# RTS Clinic

Standalone Windows clinic workspace from Royal Technology Solutions.

## Run locally

```powershell
npm install
npm start
```

## Build the installer

```powershell
npm run build
```

The installer is written to `dist/RTS-Clinic-Setup-<version>.exe`. Versioned artifacts avoid browser/proxy cache collisions and make a release traceable.

## Updates

Run `npm run release` to build and publish an update. Publishing prompts for optional or mandatory behavior and release notes, verifies the installer against `latest.yml`, requires the differential `.blockmap`, and uploads all three artifacts to GitHub Releases. Authentication comes from the local GitHub CLI; no token is stored in the repository.

Installed clients read the GitHub release feed, verify the installer with the SHA-512 in `latest.yml`, and use blockmaps for smaller differential downloads when the previous release also includes its blockmap.

The workspace supports patients, sessions, notes, payment rows, mixed payment methods, configurable insurance providers, and period-based bill reports. Data is local to the desktop profile in this initial standalone release.

The interface supports English and Arabic. Use the language switch on the sign-in screen or in the top bar; Arabic automatically enables right-to-left layout and the preference is remembered on the device.
