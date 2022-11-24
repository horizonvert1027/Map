import { getPositiveAngle } from "utils/cameras";

export default class ImageOverlay extends window.google.maps.OverlayView {
  div;
  src;
  points;
  opacity;
  constructor(points, src, opacity) {
    super();
    this.points = points;
    this.src = src;
    this.opacity = opacity;
  }
  onAdd() {
    this.div = document.createElement("div");
    this.div.style.borderStyle = "none";
    this.div.style.borderWidth = "0px";
    this.div.style.position = "absolute";

    const img = document.createElement("img");
    img.src = this.src;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.position = "absolute";
    this.div.appendChild(img);

    const panes = this.getPanes();
    panes.overlayLayer.appendChild(this.div);
  }
  draw() {
    const overlayProjection = this.getProjection();
    const rotation = getPositiveAngle(this.points.nw, this.points.ne) - 90;
    const nw = overlayProjection.fromLatLngToDivPixel(new window.google.maps.LatLng(this.points.nw.lat, this.points.nw.lng));
    const sw = overlayProjection.fromLatLngToDivPixel(new window.google.maps.LatLng(this.points.sw.lat, this.points.sw.lng));
    const ne = overlayProjection.fromLatLngToDivPixel(new window.google.maps.LatLng(this.points.ne.lat, this.points.ne.lng));
    const width = Math.sqrt(Math.pow(Math.abs(nw.y - ne.y), 2) + Math.pow(Math.abs(nw.x - ne.x), 2));
    const height = Math.sqrt(Math.pow(Math.abs(nw.y - sw.y), 2) + Math.pow(Math.abs(nw.x - sw.x), 2));
    const left = (ne.x + sw.x) / 2 - width / 2;
    const top = (ne.y + sw.y) / 2 - height / 2;

    if (this.div) {
      this.div.style.left = left + "px";
      this.div.style.top = top + "px";
      this.div.style.width = width + "px";
      this.div.style.height = height + "px";
      this.div.style.opacity = this.opacity;
      this.div.style.transform = `rotate(${rotation}deg)`;
    }
  }
  setPoints(points) {
    this.points = points;
  }
  setOpacity(opacity) {
    this.opacity = opacity;
  }
  onRemove() {
    if (this.div) {
      this.div.parentNode.removeChild(this.div);
      delete this.div;
    }
  }
}