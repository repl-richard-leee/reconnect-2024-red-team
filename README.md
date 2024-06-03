# Reconnect 2024 Red Team
Welcome to the lab experience!

This is the source code for the servers running at:
- https://reconnect2024red1.pg.replicondev.net/
- https://reconnect2024red2.pg.replicondev.net/
- https://reconnect2024red3.pg.replicondev.net/
- https://reconnect2024red4.pg.replicondev.net/
- https://reconnect2024red5.pg.replicondev.net/
- https://reconnect2024red6.pg.replicondev.net/
- https://reconnect2024red7.pg.replicondev.net/
- https://reconnect2024red8.pg.replicondev.net/
- https://reconnect2024red9.pg.replicondev.net/

Please stay on your assigned instance of the site (not all site instances may be running for performance reasons).

## Vulnerable Source Code
All the relevant code is found in the [playerRouter.mjs](playerRouter.mjs) file.

## Your Mission
Should you choose to accept:
1. Prototype Pollution: Add a custom field to Mockey Mouse to read "debt": 1000
2. Prototype Pollution & Path Traversal: Extract the contents of the .env file