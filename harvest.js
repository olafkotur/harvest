const dotenv = require('dotenv');
const https = require('https');
const moment = require('moment');

dotenv.config();

const options = {
  protocol: "https:",
  hostname: "api.harvestapp.com",
  path: "/v2/time_entries",
  headers: {
    "User-Agent": "Harvest",
    "Authorization": "Bearer " + process.env.ACCESS_TOKEN,
    "Harvest-Account-ID": process.env.ACCOUNT_ID,
  }
}

fetchTimeEntries = (daysBack) => {
  console.log(`Fetching time entries for ${daysBack} days...\n`);
  https.get(options, (res) => {
    const { statusCode } = res;

    if (statusCode !== 200) {
      return console.error(`Request failed with status: ${statusCode}`);
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      const parsedData = JSON.parse(rawData);
      parsedData.time_entries.reverse().forEach((data) => {
        const dataDate = moment(data.spent_date);
        const date = moment().subtract(daysBack, 'days');
        const isValidDate = moment(dataDate).isAfter(date);

        if (isValidDate) {
          const entry = {
            date: dataDate.format('DD/MM/YYYY'),
            hours: data.hours,
            notes: data.notes,
          };

          const [client, project, task] = entry.notes ? entry.notes.split('/') : '';
          const formatted = `=SPLIT("${entry.date}|${client}|${project}|${task}|${entry.hours}", "|")`;
          console.log('\x1b[32m', formatted);
        }
      });
    });
  }).on('error', (e) => console.error(`Got error: ${e.message}`));
}

const stdin = process.openStdin();
process.stdout.write('How many days back would you like to go?: ');
stdin.addListener('data', d => {
  stdin.pause();
  fetchTimeEntries(d.toString().trim());
});
