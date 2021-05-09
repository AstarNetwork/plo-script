import fs from 'fs';
import path from 'path';

const ID_NAME = 'crowdlaon';

// script entry point
export default async () => {
  // cache names are based on contract address
  const cacheFileDir = `${path.join(process.cwd(), 'cache/')}cache-${ID_NAME.slice(0, 6)}.json`;
  const jsonBlob = JSON.stringify('{}');

  fs.writeFile(cacheFileDir, jsonBlob, function (err) {
    if (err) return console.error(err);
  });
};
