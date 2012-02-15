@ECHO OFF

ECHO Cleaning ..\Plugin Dir
RMDIR ..\Plugin /s /q
MKDIR ..\Plugin

ECHO Copying base plugin
XCOPY Plugin\* ..\Plugin\* /S

ECHO Copying script
XCOPY Sites\stuff.js ..\Plugin\

ECHO Copying image
XCOPY tui.png ..\Plugin\

ECHO -----------------------
ECHO Make sure to copy the 
ECHO script name into the 
ECHO manifest.json js array
ECHO -----------------------

PAUSE