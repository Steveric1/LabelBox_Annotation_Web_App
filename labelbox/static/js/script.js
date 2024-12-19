const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const image = document.getElementById("image");
const submitBtn = document.getElementById("submit-btn");

// Declare variables globally
let startX = null, startY = null, currentX = null, currentY = null, drawing = false;

// Adjust canvas size to match the displayed image size
function resizeCanvas() {
    const rect = image.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

// Resize canvas when the image loads
image.onload = resizeCanvas;

// Start drawing
canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
});

// Draw rectangle while moving the mouse
canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    currentX = e.clientX - rect.left;
    currentY = e.clientY - rect.top;

    // Clear canvas and redraw the image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Draw annotation rectangle
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, width, height);
});

// Stop drawing
canvas.addEventListener("mouseup", () => {
    drawing = false;
});

// Handle form submission
submitBtn.addEventListener("click", () => {
    const form = document.getElementById("annotation-form");

    // Ensure all variables are defined
    if (startX === null || startY === null || currentX === null || currentY === null) {
        alert("Please draw an annotation first");
        return;
    }

    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    form.querySelector("input[name='x']").value = startX;
    form.querySelector("input[name='y']").value = startY;
    form.querySelector("input[name='width']").value = width;
    form.querySelector("input[name='height']").value = height;

    fetch("/save_annotation/", {
        method: "POST",
        body: new FormData(form),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log("Server response:", data);
        if (data.annotation_id) {
            alert(`${data.message}  Annotated Data: (ID: ${data.annotation_id} 
                X: ${data.x} Y: ${data.y} Width: ${data.width} Height: ${data.height})`);
        } else {
            alert(data.message);
        }

        // Clear the canvas and reset variables
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        startX = startY = currentX = currentY = null; // Reset all variables
        window.location.reload();  // Load the next image
    })
    .catch((error) => console.error(error));
});
