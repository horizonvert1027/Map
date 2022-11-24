import floorPng from 'assets/floor.png';
export default class CoordMapType {
  tileSize;
  type = 2;
  constructor(type) {
    this.tileSize = new window.google.maps.Size(2048, 2048);
    this.type = type;
  }
  getTile(coord, zoom, ownerDocument) {
    const bgColor = '#FFFFFF'; //#FFF7F0
    const lineColor = '#EAEAEA'; //#FFCFB4
    const div = ownerDocument.createElement("div");
    let size = Math.pow(2, zoom % 6) * 8;
    div.id = 'title_id'
    div.style.width = "2048px";
    div.style.height = "2048px";
    div.style.backgroundSize = `${size}px ${size}px`;
    // div.style.backgroundImage = floorPng;
    if (this.type === 1) {
      div.style.backgroundImage = `linear-gradient(to left, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, ${bgColor} 1px)`;
    } else if (this.type === 2) {
      div.style.backgroundImage = `linear-gradient(to left, ${bgColor} 1px, transparent 1px), linear-gradient(to bottom, ${bgColor} 1px, ${bgColor} 1px)`;
    }
    return div;
  }
  releaseTile(tile) { }
}