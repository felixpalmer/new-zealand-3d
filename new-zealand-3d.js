// Initialize the engine with a location and inject into page
const container = document.getElementById( 'container' );
const parkList = document.getElementById( 'park-list' );
const parkListOverlay = document.getElementById( 'park-list-overlay' );
const title = document.getElementById( 'title' );

// Define API Keys (replace these with your own!)
const NASADEM_APIKEY = null;
const LINZ_APIKEY = null;
if ( !NASADEM_APIKEY || !LINZ_APIKEY ) {
  const error = Error( 'Modify index.html to include API keys' );
  container.innerHTML = error; 
  throw error;
}

const datasource = {
  elevation: {
    apiKey: NASADEM_APIKEY
  },
  imagery: {
    apiKey: LINZ_APIKEY,
    urlFormat: 'https://basemaps.linz.govt.nz/v1/tiles/aerial/EPSG:3857/{z}/{x}/{y}.jpg?api={apiKey}',
    attribution: '&copy; <a href="//www.linz.govt.nz/linz-copyright">LINZ CC BY 4.0</a> &copy; <a href="//www.linz.govt.nz/data/linz-data/linz-basemaps/data-attribution">Imagery Basemap contributors</a>'
  }
}
Procedural.init( { container, datasource } );

// Configure buttons for UI
Procedural.setCameraModeControlVisible( true );
Procedural.setCompassVisible( false );
Procedural.setRotationControlVisible( true );
Procedural.setZoomControlVisible( true );

// Define function for loading a given national park
function loadPark( feature ) {
  const name = feature.properties.name;
  const [longitude, latitude] = feature.geometry.coordinates;
  Procedural.displayLocation( { latitude, longitude } );
  title.innerHTML = name;
  parkListOverlay.classList.add( 'hidden' );
}

// Show list when title clicked
title.addEventListener( 'click', () => {
  parkListOverlay.classList.remove( 'hidden' );
} );

// Fetch park list and populate UI
fetch( 'parks.geojson' )
  .then( data => data.json() )
  .then( parks => {
    parks.features.forEach( park => {
      const li = document.createElement( 'li' );
      const p = document.createElement( 'p' );
      p.innerHTML = park.properties.name;
      li.appendChild( p );
      li.style.backgroundImage = `url(images/${park.properties.image}.jpg)`;
      parkList.appendChild( li );
      li.addEventListener( 'click', () => loadPark( park ) );
    } );
  } );
