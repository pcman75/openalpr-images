
Install
---
Copy openalpr-images.service file into the /etc/systemd/system.

Start it with systemctl start openalpr-images

Enable it to run on boot with systemctl enable openalpr-images

See logs with journalctl -u openalpr-images --since "1 hour ago"