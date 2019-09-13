# Harvest
Simple tool to collect data from Harvest API (getharvest.com) and log it in a format that can be pasted into Google Sheets. This was something quick that is specialised to my use case however is easily editable - 100% done to save doing a boring admin task.

## Setup and run
* `yarn | npm i` install dependencies
* Add `ACCESS_TOKEN` and `ACCOUNT_ID` variables in a `.env` file - this can be generated on your account section in Harvest.
* `node harvest.js`
* You will be prompted how many days back the time entries should go, this is always 24 (* days) hours from the current time.

## Format
* The free version of the Harvest app has limited features so most of the formatting comes from the notes section
* The data is split by `/` in the notes, the following format in notes will generate the data below: `Client/Project/Task`
* Note the actual string returned will look like: `=SPLIT("Date|Client|Project|Notes|Hours", "|")`
* This is so you can simply paste this in Google Sheets and it will go into the related columns
```
Date  |  Client  |  Project  |  Notes   |   Hours
```

## Example Entry
![Example Input](https://i.imgur.com/XajBujT.png)
