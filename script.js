const input = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');

input.addEventListener('change', () => {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = () => {
    preview.src = reader.result;
    preview.style.display = "block";

    preview.onload = () => {
      analyzeImage();
    }
  };
});


function analyzeImage() {
  const ctx = canvas.getContext('2d');
  canvas.width = preview.naturalWidth;
  canvas.height = preview.naturalHeight;

  ctx.drawImage(preview, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const brightness = getBrightness(imgData);

  let message = "";

  if (brightness < 40) {
    message = "⚠️ L'ambiente è troppo buio! Accendi una luce calda.";
  } else if (brightness < 90) {
    message = "🟡 L'ambiente è un po' buio. Meglio più luce.";
  } else if (brightness < 180) {
    message = "🟢 Luminosità buona! Ambiente ottimale.";
  } else {
    message = "⚠️ Troppo luminoso! Evita luci dirette negli occhi.";
  }

  result.textContent = `Luminosità: ${brightness.toFixed(1)} → ${message}`;
}


function getBrightness(imgData) {
  const data = imgData.data;
  let sum = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];

    // Formula standard luminanza percepita
    const brightness = 0.2126*r + 0.7152*g + 0.0722*b;
    sum += brightness;
  }

  return sum / (data.length / 4);
}
