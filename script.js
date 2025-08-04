document.addEventListener('DOMContentLoaded', () => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZ2xvYmFseGxsYzEyLSIsImEiOiJjbWR2dHZ3ZGsxMXl3Mmtva2Izb256NTF6In0.pnEnVhf4MTbgBXOTc09qoA';
  const pre = document.getElementById('map-preloader');
  const mapEl = document.getElementById('map');
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-106.6524, 35.0844],
    zoom: 10
  });
  map.on('load', () => { pre.style.display='none'; mapEl.style.visibility='visible'; });
  map.on('error', err => { pre.textContent='Failed to load map.'; console.error(err); });
});