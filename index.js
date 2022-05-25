const express = require('express');
const app = express();

const cheerio = require('cheerio');
const axios = require('axios');

const dateArray = ['2022-03', '2022-04', '2022-05'];

const getData = async function () {
  const promiseArray = dateArray
    .slice(0, 1)
    .map((month) =>
      axios(`https://www.checkee.info/main.php?dispdate=${month}`)
    );
  // const data = await axios(
  //
  // );
  const result = await Promise.all(promiseArray);

  const output = result
    .map((web) => cheerio.load(web.data)) // load web structure
    .map(($) => $('tbody').toArray()) // get tbody element array
    .map((tbodyArr) =>
      tbodyArr[6].children.filter((item) => item.name === 'tr')
    ) // filter out tr element
    .map(
      (trArray) =>
        trArray
          .map((item) =>
            item.children.map(
              (item) => item.children[0].data || item.children[0].attribs?.title // data and detail
            )
          ) // td info array
          .slice(1) // first tr trivial
    );

  return output;
};

app.get('/', async function (req, res) {
  const result = await getData();
  res.send(result);
});

app.listen(3000);
