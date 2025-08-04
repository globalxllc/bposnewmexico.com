document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("clickOverlay");
  const video1 = document.getElementById("video1");

  overlay.addEventListener("click", () => {
    video1.muted = false;
    overlay.style.display = "none";
  });

  // Auto-scroll immediately to second video after first ends
  video1.addEventListener("ended", () => {
    document.getElementById("video2-section").scrollIntoView({ behavior: "smooth" });
  });
});
