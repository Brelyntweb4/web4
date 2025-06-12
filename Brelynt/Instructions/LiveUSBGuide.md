# Creating a Bootable BrelyntOS USB

This guide describes how to package the `brelynt-electron` folder with a lightweight Linux distribution. The final USB stick should boot straight into the Electron UI and start the background services `p2p-server.js` and `filehub.js` automatically.

## 1. Prepare the Base System

1. **Download a minimal Linux distro**. TinyCore or Debian Live works well. The example below assumes Debian-based tools.
2. Install the `live-build` package:
   ```bash
   sudo apt-get install live-build
   ```
3. Create a working directory and copy the `brelynt-electron` folder there:
   ```bash
   mkdir -p ~/brelynt-live/config/packages.chroot
   cp -r /path/to/web4/brelynt-electron ~/brelynt-live/
   ```

## 2. Add Required Packages

Inside `~/brelynt-live/config/package-lists/brelynt.list.chroot` add the packages needed for Node.js and a browser:

```text
nodejs
npm
xorg
matchbox-window-manager
chromium
```

These packages will be installed into the live image.

## 3. Autostart Services and UI

Create a systemd service file `brelynt.service` in `~/brelynt-live/config/includes.chroot/etc/systemd/system/` with the following content:

```ini
[Unit]
Description=Brelynt services and UI
After=network.target

[Service]
Type=simple
ExecStart=/brelynt-electron/start-services.sh
WorkingDirectory=/brelynt-electron
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable this service by creating a symlink in `~/brelynt-live/config/includes.chroot/etc/systemd/system/multi-user.target.wants/` pointing to `../brelynt.service`.

## 4. Build the ISO

Run the live-build process from the working directory:

```bash
cd ~/brelynt-live
sudo lb build
```

The resulting ISO can be written to a USB stick with `dd` or any ISO imaging tool.

## 5. Boot Process

When the machine boots from the USB:
1. Debian initializes the system and starts `brelynt.service`.
2. `brelynt.service` runs `start-services.sh` which:
   - launches `filehub.js` on port 3040;
   - launches `p2p-server.js` on port 9090;
   - starts the Electron app that loads `public/index.html`.

The user is presented with BrelyntOS immediately after boot.

## 6. Start Script

Make sure `brelynt-electron/start-services.sh` is executable. The script is provided in the repository and can be adjusted for other browsers if Electron is not desired.

