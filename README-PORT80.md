# Port 80 Access Solutions for Sahara Journeys

Your server is currently running on port 3000. Here are three ways to make it accessible on port 80:

## Current Status
- Server running on: http://74.179.85.9:3000
- Admin panel: http://74.179.85.9:3000/admin

## Solution 1: Port Forwarding (Recommended)
This redirects port 80 traffic to port 3000 without requiring root privileges for the Node.js process.

```bash
# Set up port forwarding (requires sudo once)
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000

# Make it permanent across reboots
sudo iptables-save > /etc/iptables/rules.v4
```

After this, your site will be accessible at:
- http://74.179.85.9 (automatically forwards to port 3000)
- http://74.179.85.9/admin

## Solution 2: Run with Sudo
Start the server directly on port 80 with elevated privileges:

```bash
sudo PORT=80 NODE_ENV=production HOST=0.0.0.0 npx tsx server/index.ts
```

## Solution 3: Grant Capabilities (Advanced)
Give Node.js permission to bind to privileged ports:

```bash
# Grant capability (requires sudo once)
sudo setcap 'cap_net_bind_service=+ep' $(which node)

# Then run normally on port 80
PORT=80 NODE_ENV=production HOST=0.0.0.0 npx tsx server/index.ts
```

## Quick Start Scripts

Use the provided scripts:
- `./start-linux.sh` - Automatic port detection
- `./setup-port80.sh` - Interactive port 80 setup

## Current Server Access
- Main site: http://74.179.85.9:3000
- Admin panel: http://74.179.85.9:3000/admin
- API endpoints: http://74.179.85.9:3000/api/admin/users

Server PID: Check `server.pid` file
Log file: `sahara-server.log`