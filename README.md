# NOTES TO DOCUMENT

## AI

- Skills, npx skills experimental_install, to use skills-lock to install the skills

## NESTJS

    nest generate lib x-name
    nest generate app x-name

## DOCKER

    docker compose up --build

## How to get docker hot reloading

install ubuntu in wsl

```
wsl --install -d Ubuntu
wsl -d Ubuntu
wsl -l -v
```

Open file explorer in Ubuntu

```
explorer.exe \\wsl.localhost\Ubuntu
```

Copy the project to a folder in ubuntu

```
\\wsl.localhost\Ubuntu\home\<your-ubuntu-user>\projects\<project_name>
```

In a terminal go

```
cd \\wsl.localhost\Ubuntu\home\<your-ubuntu-user>\projects\<project_name>
wsl -d Ubuntu
code .
```

Verify docker is installed

```
docker ps
```

If not fix it with

```
sudo usermod -aG docker $USER
exit
wsl --shutdown
wsl -d Ubuntu
docker ps
```

Run the app

```
docker compose up --build
```

### How to debug

The docker compose file run the apps with the debug mode in the port 9229

then in the docker compose file that port is mapped diferently for every microservice

in the vs code launch.json you have the configuration to attacht to every microservice

### How to install git kraken in the ubuntu machine

[WSL GitKraken](https://help.gitkraken.com/gitkraken-desktop/windows-subsystem-for-linux/)

```
gitkraken
```

### TEST

In the package json i excluded the e2e tests, the main.ts and the modules.

"collectCoverageFrom": [
"**/*.(t|j)s",
"!**/test/**",
"!**/*.spec.ts",
"!**/main.ts",
"!**/*.module.ts"
],
