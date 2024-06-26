@echo off

REM Cargar variables desde el archivo .env
for /f "tokens=1,* delims==" %%a in ('type env_dev.env') do set "%%a=%%b"

REM Listar las imágenes
docker images

REM Borrar la imagen del proyecto usando el tag ingresado
docker rmi %IMAGE_FRONTEND%:%TAG_FRONTEND%

REM Construir la imagen de backend con el tag ingresado
docker image build -t %IMAGE_FRONTEND%:%TAG_FRONTEND% .

REM Etiquetar y hacer push de la imagen de backend
REM Reemplazar la etiqueta, la dirección del servidor registry
REM set REPO_NAME=registrylpz.et.bo:9043/electrolineras/electrolineras-backend
REM docker tag %IMAGE_FRONTEND%:%TAG_FRONTEND% %REPO_NAME_FRONTEND%:%TAG_FRONTEND%
REM docker push %REPO_NAME_FRONTEND%:%TAG_FRONTEND%

REM Etiquetar y hacer push de la imagen de frontend
REM Borrar la imagen del proyecto usando el tag ingresado
docker rmi %IMAGE_FRONTEND%:%TAG_FRONTEND%

Construir la imagen de backend con el tag ingresado
docker image build -t %IMAGE_FRONTEND%:%TAG_FRONTEND% .

REM Etiquetar y hacer push de la imagen de frontend
docker tag %IMAGE_FRONTEND%:%TAG_FRONTEND% %REPO_NAME_FRONTEND%:%TAG_FRONTEND%
docker push %REPO_NAME_FRONTEND%:%TAG_FRONTEND%

REM SSH al servidor para login
REM Previamente copiar el archivo .env con la variables en el directorio del proyecto
REM scp env_dev.env daniel.orias@   :/opt/docker-compose/dlp_electrolineras2/env_dev.env
REM ssh daniel.orias@10.241.74.31 "cd /opt/docker-compose/dlp_electrolineras2 && ls && docker compose --env-file env_dev.env ps && docker compose --env-file env_dev.env down && docker images && docker rmi %REPO_NAME_FRONTEND%:%TAG_FRONTEND% && docker rmi %REPO_NAME_FRONTEND%:%TAG_FRONTEND% && docker compose --env-file env_dev.env up -d --build --remove-orphans && docker compose --env-file env_dev.env ps"
