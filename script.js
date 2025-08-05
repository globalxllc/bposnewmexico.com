const vid2 = document.getElementById('video2');
const mapImg = document.getElementById('nm-county-map');
vid2.addEventListener('ended', () => {
  vid2.style.display = 'none';
  mapImg.style.display = 'block';
});
