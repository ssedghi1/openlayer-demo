import './style.css';
import { Map, View } from 'ol';
import Control from 'ol/control/Control';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';

// Create the OSM base layer
const osmLayer = new TileLayer({
  source: new OSM(),
  visible: true
});

// Create the satellite layer using ArcGIS World Imagery
const satelliteLayer = new TileLayer({
  source: new XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 20,
    attributions: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, ITC, NASA, JAXA, KGC, Stamen, NSG, and the GIS User Community'
  }),
  visible: false
});

// Create a custom layer switcher control
const layerSwitcher = document.createElement('div');
layerSwitcher.className = 'layer-switcher';
layerSwitcher.innerHTML = `
  <select id="layer-select">
    <option value="osm" selected>OpenStreetMap</option>
    <option value="satellite">Satellite</option>
  </select>
`;

// Style the control
layerSwitcher.style.position = 'absolute';
layerSwitcher.style.top = '10px';
layerSwitcher.style.right = '10px';
layerSwitcher.style.background = 'white';
layerSwitcher.style.padding = '5px';
layerSwitcher.style.border = '1px solid #ccc';
layerSwitcher.style.borderRadius = '3px';
layerSwitcher.style.zIndex = '1000';

// Create the OpenLayers control
const layerSwitcherControl = new Control({
  element: layerSwitcher
});

// Add event listener to the dropdown
const select = layerSwitcher.querySelector('select');
select.addEventListener('change', function () {
  if (this.value === 'osm') {
    osmLayer.setVisible(true);
    satelliteLayer.setVisible(false);
  } else {
    osmLayer.setVisible(false);
    satelliteLayer.setVisible(true);
  }
});

// Initialize the map with both layers
const map = new Map({
  target: 'map',
  layers: [osmLayer, satelliteLayer],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

// Add the custom control to the map
map.addControl(layerSwitcherControl);
