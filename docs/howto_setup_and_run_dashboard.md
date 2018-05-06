# How To Setup And Run Dashboard

* 1. Download and install Node.js
* 2. Setup Node.js
* 3. Download and install MySQL Community Server
* 4. Create a MySQL database
* 5. Run MySQL Community Server
* 6. Update MySQL database credentials in config file
* 7. Install Python
* 8. Run Server

## 1. Download and install Node.js
Install the latest stable long-term-release (LTS) - v8.11.1 as of writing

### For Debian-based linux distribution:
Run these commands to install using package manager:

* curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
* sudo apt-get install -y nodejs

### For Windows machine:
Download Node.js installer from https://nodejs.org/en/download/


## 2. Setup Node.js
Run these commands to (1) install required Node.js dependencies and (2) compile all Typescript source files. Same commands in both Windows and Linux.

* cd *[directory to root of this project]*
* npm run setup


## 3. Download and install MySQL Community Server
Install the latest stable release - v8.0.11 as of writing

### For Debian-based linux distribution:
Run these commands to install using package manager. Install with default settings when prompted.

* sudo apt-get update
* sudo apt-get install mysql-server
* mysql_secure_installation

### For Windows machine:
Download MySQL Community Server installer from https://dev.mysql.com/downloads/windows/installer/8.0.html. The download requires an Oracle Web account, which is free to register.

* Leave install settings as default except:
* Select "Server only" as the Setup Type during the installation
* Select "Use Legacy Authentication Method (Retain MySQL 5.x Compatibility)" for Authentication Method


## 4. Create a MySQL database
Create a database to use.

### For Debian-based linux distribution:
Run these commands:

* mysql -u [username] -p
* create database cidashboard

### For Windows machine:

* Run MySQL 8.0 Command Line Client and login
* Run command: **create database cidashboard**


## 5. Run MySQL Community Server
The MySQL Community Server should be registered as a service and automatically started. If not, follow these instructions to start.

### For Debian-based linux distribution:
Run this command to start service:

* sudo systemctl start mysql-server

### For Windows machine:

* Launch Services application (built into Windows)
* Start service called "MySQL80"


## 6. Update MySQL database credentials in config file

* Open file *config/config.js*
* Update database credentials in property *config.db*


## 7. Install Python
Ensure "python" command is accessible from the command prompt/bash. Add python to your environmental path if necessary. This is required for the server to launch and interact with Python scripts.

### For Debian-based linux distribution:
By default, Debian and Ubuntu already have Python installed.

### For Windows machine:
Download Python 2 or 3 from https://www.python.org/.

* Leave install settings as default except:
* Select to add Python to environmental path
* ^ You may need to restart your computer for the environmental path to update


## 8. Run Server
Run these commands to start the server. Same commands in both Windows and Linux.

* cd *[directory to root of this project]*
* npm run start

Currently, the command above will also automatically launch the webapp after starting.