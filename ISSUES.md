# Known Issues

This file documents current known problems and limitations in Zarixsol Ai Dev Studio. Please check here before opening a new issue.

## Installation
- Some dependencies may fail to install on older Node.js versions (<18).
- pnpm is recommended; npm/yarn may cause workspace issues.

## Platform
- Linux: Some Electron features may require additional system libraries.
- Windows: Path length issues may occur in deep folder structures.

## Development
- Hot reload may not always reflect changes in Electron main process.
- Some TypeScript types may be out of sync between packages.

## Security
- Local authentication is basic; advanced auth is in progress.

## To Do
- Improve error handling in agent and core packages.
- Add more tests for UI components.

If you encounter a new issue, please:
- Check for updates in this file.
- Open a GitHub issue with steps to reproduce, logs, and screenshots if possible.

See [CONTRIBUTE.md](CONTRIBUTE.md) for more details.