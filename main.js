import './style.css';
import { Map, View } from 'ol';
import Control from 'ol/control/Control';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS'; // Import TileWMS instead of ImageWMS

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

// Create the WMS layer from your local GeoServer
const wmsSource = new TileWMS({
  url: 'http://localhost:8080/geoserver/wms',
  params: {
    'LAYERS': 'Utility:line_data', // Replace with your workspace and layer name
    'VERSION': '1.1.1',
    'TILED': true
  },
  serverType: 'geoserver'
});

const wmsLayer = new TileLayer({
  source: wmsSource,
  visible: false
});

// Initialize the map with base layers and WMS overlay
const map = new Map({
  target: 'map',
  layers: [osmLayer, satelliteLayer, wmsLayer],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

// Create the base layer switcher control
const layerSwitcher = document.createElement('div');
layerSwitcher.className = 'layer-switcher';
layerSwitcher.innerHTML = `
  <select id="layer-select">
    <option value="osm" selected>OpenStreetMap</option>
    <option value="satellite">Satellite</option>
  </select>
`;

// Style the base layer switcher
layerSwitcher.style.position = 'absolute';
layerSwitcher.style.top = '10px';
layerSwitcher.style.right = '10px';
layerSwitcher.style.background = 'white';
layerSwitcher.style.padding = '5px';
layerSwitcher.style.border = '1px solid #ccc';
layerSwitcher.style.borderRadius = '3px';
layerSwitcher.style.zIndex = '1000';

// Create the WMS checkbox control
const wmsControl = document.createElement('div');
wmsControl.className = 'layer-control';
wmsControl.innerHTML = `
  <label>
    <input type="checkbox" id="wms-toggle"> Show WMS Layer
  </label>
`;

// Style the WMS checkbox control
wmsControl.style.position = 'absolute';
wmsControl.style.top = '50px'; // Positioned below the base layer switcher
wmsControl.style.right = '10px';
wmsControl.style.background = 'white';
wmsControl.style.padding = '5px';
wmsControl.style.border = '1px solid #ccc';
wmsControl.style.borderRadius = '3px';
wmsControl.style.zIndex = '1000';

// Add the base layer switcher to the map
const layerSwitcherControl = new Control({
  element: layerSwitcher
});
map.addControl(layerSwitcherControl);

// Add the WMS checkbox control to the map
const wmsCheckboxControl = new Control({
  element: wmsControl
});
map.addControl(wmsCheckboxControl);

// Add event listener to the base layer dropdown
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

// Add event listener to the WMS checkbox
const wmsCheckbox = wmsControl.querySelector('input');
wmsCheckbox.addEventListener('change', function () {
  wmsLayer.setVisible(this.checked);
});
