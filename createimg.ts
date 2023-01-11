var exec = require('child_process').exec;
const yaml = require('js-yaml');
const fs   = require('fs');

const typeColourMap = new Map([
  ['brown', '812B27'],
  ['train', 'ffffff'],
  ['lightblue', 'ACE0F9'],
  ['blue', '1174BA'],
  ['yellow', 'FDF035'],
  ['pink', 'C33C82'],
  ['red', 'EA202D'],
  ['orange', 'E09C39'],
  ['green', '4DA962'],
])

const getMapboxUrl = (location: Location, dimensions: string) =>
  `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+${typeColourMap.get(location.type)}(${location.long},${location.lat})/${location.long},${location.lat},14,0/${dimensions}?access_token=pk.eyJ1IjoiY3VydGlzY29kZSIsImEiOiJjbGNxam9vNzcwMHlyM3htc3NxamZzNjZpIn0.K_kg-bcBMcuLd6HFbl8UuA`

interface Location {
  slug: string
  lat: string
  long: string
  type: string
}

const createImg = () => {

  try {
    const doc = yaml.load(fs.readFileSync('./data/locations.yaml', 'utf8'));

    doc.locations.forEach((location: Location) => {
      if (location.slug !== undefined) {
        console.log(`Creating ${location.slug}`)

        const mobileMapboxUrl = getMapboxUrl(location, '400x300');
        const desktopMapboxUrl = getMapboxUrl(location, '440x200');

        console.log(` - ${mobileMapboxUrl}`);
        console.log(` - ${desktopMapboxUrl}`);

        exec(`
          curl -g "${mobileMapboxUrl}" --output ./static/images/map/${location.slug}-400x300.png
          curl -g "${desktopMapboxUrl}" --output ./static/images/map/${location.slug}-440x200.png
        `)
      }
    })

  
  } catch (e) {
    console.log(e);
  }

}

createImg();