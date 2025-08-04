document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("clickOverlay");
  const video1 = document.getElementById("video1");

  overlay.addEventListener("click", () => {
    // Trick to unmute iframe YouTube video: reload with mute=0
    const src = video1.src.replace("mute=1", "mute=0&autoplay=1");
    video1.src = src;
    overlay.style.display = "none";
  });

  // Auto-scroll after a delay (simulate video end)
  setTimeout(() => {
    document.getElementById("video2-section").scrollIntoView({ behavior: "smooth" });
  }, 15000); // adjust ms as needed
});
