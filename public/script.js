
const sendImageBtn = document.getElementById('sendImageBtn');
const imageInput = document.getElementById('imageInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');

// Event listener for file input change
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      // Display image preview
      imagePreviewContainer.innerHTML = `<img src="${imageData}" class="img-preview" alt="Image Preview">`;
    };
    reader.readAsDataURL(file);
  }
});

// Event listener for send image button click
sendImageBtn.addEventListener('click', async () => {
  const file = imageInput.files[0];

  if (!file) {
    alert('Please select an image first!');
    return;
  }

  const formData = new FormData();
  formData.append('screenshot', file);

  try {
    const response = await fetch('http://localhost:3000/api/send-email', {
method: 'POST',
body: formData,
headers: {
'Accept': 'application/json'
},
mode: 'cors', // Explicitly enable CORS
credentials: 'include' // Include credentials if needed (e.g., cookies)
});


    const data = await response.json();

    if (response.ok) {
      alert('✅ Image sent successfully!');
    } else {
      alert('❌ Failed to send image');
    }
  } catch (error) {
    console.error('Error sending image:', error);
    alert('Failed to send image. Please try again.');
  }
});
