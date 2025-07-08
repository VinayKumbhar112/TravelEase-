

 

console.log(mapToken);
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',  // ✅ required!
  center: coordinates,
  zoom: 8
});


const marker=new mapboxgl.Marker({ color: 'red' })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
     .setHTML(`<h5>${listingLocation}</h5><p>Exact location shown after booking</p>`)

  )
  .addTo(map);