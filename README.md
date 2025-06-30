# Jade Time QR GitHub Pages

This page generates a Jade-compatible QR code to set the device time using the current UTC timestamp.

## Usage

- Deploy this repo to GitHub Pages (`main` branch or `/docs` directory).
- Open the site: it shows a QR code and a BC-UR string (scan this with Blockstream Jade).

## How it works

- On page load, gets the current UTC timestamp.
- Encodes `{ method: "set_epoch", params: { timestamp: <now> } }` as CBOR.
- Wraps the CBOR as BC-UR (`ur:jade-msg/...`).
- Renders as a QR code.

## No build step required!