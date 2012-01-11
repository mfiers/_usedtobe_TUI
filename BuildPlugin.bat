@ECHO OFF

ECHO Cleaning ..\Plugin Dir
RMDIR ..\Plugin /s /q
MKDIR ..\Plugin

ECHO Copying base plugin
XCOPY Plugin\* ..\Plugin\* /S

ECHO Copying TAIR script
XCOPY Sites\wormbase.js ..\Plugin\

ECHO Configuring manifest.json
REM hack here to overwrite manifest.json with alternate version (instead of editing the file)
XCOPY Sites\manifest.json ..\Plugin\ /Y