const fs = require('fs');
const { promisify } = require('util');

const { getNames } = require('./swapiNames');

const pathToFile = 'names.txt';
const openAsync = promisify(fs.open);
const closeAsync = promisify(fs.close);
const readAsync = promisify(fs.read);
const writeAsync = promisify(fs.write);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const truncateFile = async () => await writeFileAsync(pathToFile, '');

const writeFile = async dataArray => {
    await writeFileAsync(pathToFile, `with writeFile:\r\n${dataArray.join('\r\n')}\r\n\r\n`);
};

const write = async dataArray => {
    const size = dataArray.join('').length * 3;
    const dataToWrite = `with write to position:\r\n${dataArray.reverse().join('\r\n')}\r\n\r\n`;
    const fd = await openAsync(pathToFile, 'r+');
    const fileData = await readAsync(fd, Buffer.allocUnsafe(size), 0, size, null);

    await writeAsync(fd, Buffer.from(dataToWrite), 0, dataToWrite.length, fileData.bytesRead);
    await closeAsync(fd);
};

const writeWithStream = async () => {
    const fileData = await readFileAsync(pathToFile);
    const writeStream = fs.createWriteStream(pathToFile, {
        flags: 'r+',
        start: fileData.length,
    });

    writeStream.write('\r\n\r\nwith writeStream:\r\nhash is aef35ghhjdk74hja83ksnfjk888sfsf\r\n');
    writeStream.end();
};

(async () => {
    try {
        const names = await getNames();

        await truncateFile();
        await writeFile(names.slice());
        await write(names.slice());
        await writeWithStream();
    } catch (err) {
        global.console.log(err);
    }
})();
