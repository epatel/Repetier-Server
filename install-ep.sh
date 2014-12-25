cd build

sudo cp RepetierServer /usr/bin

sudo cp ../linux/repetier-server.conf /etc

sudo mkdir /var/lib/Repetier-Server /var/lib/Repetier-Server/configs /var/lib/Repetier-Server/www /var/lib/Repetier-Server/storage /var/lib/Repetier-Server/languages

sudo cp -r ../www/* /var/lib/Repetier-Server/www
sudo cp ../languages/* /var/lib/Repetier-Server/languages

sudo cp ../linux/init_Repetier-Server_debian /etc/init.d/Repetier-Server
sudo chmod 755 /etc/init.d/Repetier-Server

sudo update-rc.d Repetier-Server defaults

echo sudo /etc/init.d/Repetier-Server start
echo sudo /etc/init.d/Repetier-Server stop
