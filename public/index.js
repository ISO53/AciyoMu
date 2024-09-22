document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("take-picture-button").addEventListener("click", () => {
        document.getElementById("take-picture-div").style.display = "flex";
    });

    document.getElementById("choose-joker-button").addEventListener("click", () => {
        document.getElementById("choose-joker-div").style.display = "flex";
    });

    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const photo = document.getElementById("photo");
    const captureButton = document.getElementById("camera-feed");

    // Request access to the user's camera
    const constraints = {
        video: {
            facingMode: "environment", // Use 'user' for front-facing camera, 'environment' for back-facing
        },
    };

    // Start the video stream
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.error("Error accessing the camera: ", err);
        });

    // Capture the image when the button is clicked
    captureButton.addEventListener("click", () => {
        photo.style.zIndex = "2";
        document.getElementById("choose-joker-button").disabled = false;

        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas image to a data URL and display it in the photo element
        const dataURL = canvas.toDataURL("image/png");
        photo.src = dataURL;

        // Stop the camera stream
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());

        // Clear the video source
        video.srcObject = null;
    });

    // Enable the button when both selectors have values
    const numberSelector = document.getElementById("jokerNumber");
    const colorSelector = document.getElementById("jokerColor");
    const confirmButton = document.getElementById("confirmJoker");

    function checkSelectors() {
        if (numberSelector.value !== "" && colorSelector.value !== "") {
            confirmButton.disabled = false;
        } else {
            confirmButton.disabled = true;
        }
    }

    // Add event listeners to enable/disable the button
    numberSelector.addEventListener("change", checkSelectors);
    colorSelector.addEventListener("change", checkSelectors);

    let selectedNumber = null;
    let selectedColor = null;

    const jokerNumbers = [];
    for (let i = 1; i <= 13; i++) {
        const jokerNumber = document.createElement("div");
        jokerNumber.className = "number";
        jokerNumber.innerHTML = i;
        jokerNumbers.push(jokerNumber);
    }

    const jokerNumbersDiv = document.getElementById("jokerNumber");
    for (let i = 0; i < jokerNumbers.length; i++) {
        jokerNumbers[i].addEventListener("click", () => {
            jokerNumbers.forEach((jokerNumber) => jokerNumber.classList.remove("selected"));
            jokerNumbers[i].classList.add("selected");
            selectedNumber = i;
            if (selectedColor != null && selectedNumber != null) {
                document.getElementById("confirmJoker").disabled = false;
            }
        });
        jokerNumbersDiv.appendChild(jokerNumbers[i]);
    }

    const jokerColors = [];
    const colors = ["red", "yellow", "blue", "black"];
    for (let i = 0; i < 4; i++) {
        const jokerColor = document.createElement("div");
        jokerColor.className = "color";
        jokerColor.style.backgroundColor = colors[i];
        jokerColors.push(jokerColor);
    }

    const jokerColorsDiv = document.getElementById("jokerColor");
    for (let i = 0; i < jokerColors.length; i++) {
        jokerColors[i].addEventListener("click", () => {
            jokerColors.forEach((jokerColor) => jokerColor.classList.remove("selected"));
            jokerColors[i].classList.add("selected");
            selectedColor = colors[i];

            if (selectedColor != null && selectedNumber != null) {
                document.getElementById("confirmJoker").disabled = false;
            }
        });
        jokerColorsDiv.appendChild(jokerColors[i]);
    }

    document.getElementById("confirmJoker").addEventListener("click", () => {
        document.getElementById("getResultsButton").disabled = false;
    });

    document.getElementById("getResultsButton").addEventListener("click", () => {
        // Prepare the data to send to the backend
        const data = {
            image: photo.src, // Send the base64 image data
            number: selectedNumber,
            color: selectedColor,
        };

        // Send a POST request to the backend
        fetch("https://aciyomu-iso53s-projects.vercel.app/api/process-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log("Processing result: ", result);
                let image = document.createElement("img");
                image.src = result.processedImage;
                document.getElementById("get-results-div").appendChild(image);
            })
            .catch((error) => {
                console.error("Error processing the image: ", error);
            });
    });
});
