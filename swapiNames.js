const https = require('https');

const apiUrl = 'https://swapi.co/api/people/';

const getSwapiData = url => {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            const data = [];

            if (res.statusCode !== 200) {
                reject(new Error('error to get data'));
            }

            res.on('error', err => reject(err));
            res.on('data', chunk => data.push(chunk));
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data.join('')));
                } catch (err) {
                    reject(err);
                }
            });
        });
    });
};

const getNames = async () => {
    const names = [];
    let currentPage = 1;

    const addNames = response => response.results.forEach(character => names.push(character.name));

    try {
        const firstResponse = await getSwapiData(apiUrl);
        let nextPage = firstResponse.next;
        addNames(firstResponse);

        while (nextPage !== null) {
            const result = await getSwapiData(`${apiUrl}?page=${currentPage + 1}`);

            addNames(result);
            currentPage += 1;
            nextPage = result.next;
        }

        names.sort();
    } catch (err) {
        global.console.log(err);
    }

    return names;
};

const writePeople = async () => {
    const names = await getNames();

    global.console.log(names.join('\r\n'));
};

if (require.main === module) {
    writePeople();
}

module.exports = {
    getNames,
};
