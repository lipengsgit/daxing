
export function getArea() {
  return localStorage.getItem('area') || '';
}

export function setArea(area) {
  return localStorage.setItem('area', area);
}
