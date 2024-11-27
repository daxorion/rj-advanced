/
// Function to create the initial "Launch Webcam" link
function createLaunchLink() {
  const launchLink = document.createElement('a');
  launchLink.href = '#';
  launchLink.innerText = 'Launch Webcam';
  launchLink.style.fontSize = '14px';
  launchLink.style.color = '#007bff';
  launchLink.style.textDecoration = 'none';
  launchLink.style.cursor = 'pointer';

  // Hover effect for the link
  launchLink.addEventListener('mouseenter', () => launchLink.style.textDecoration = 'underline');
  launchLink.addEventListener('mouseleave', () => launchLink.style.textDecoration = 'none');

  launchLink.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    startWebcamExperience(launchLink); // Start the webcam experience when clicked
  });

  return launchLink;
}

// Function to start the webcam experience (trigger original script)
function startWebcamExperience(launchLink) {
  // Hide the "Launch Webcam" link
  launchLink.style.display = 'none';

  // Create a new div for the video container
  var newDiv = document.createElement('div');
  newDiv.classList.add('responsive-div');
  newDiv.style.position = 'relative';
  newDiv.style.width = '540'; // Initial width (you can change this as needed)
  newDiv.style.height = `${(540 * 9) / 16}px`; // Initial height based on the 16:9 aspect ratio
  newDiv.style.resize = 'vertical';
  newDiv.style.overflow = 'hidden';
  newDiv.style.minWidth = '200px'; // Minimum width
  newDiv.style.minHeight = '112px'; // Minimum height to maintain 16:9 ratio
  newDiv.style.cursor = 'se-resize'; // Cursor style for resize
  newDiv.style.background = 'black'; // Set Color

  // Find the existing element by ID prefix
  var existingElement = document.querySelector('[id^="video-js--theater-mode-toggle"]');
  
  if (existingElement) {
    existingElement.parentNode.insertBefore(newDiv, existingElement); // Insert the new div before the existing element

    // Create the video element for the webcam
    var videoElement = document.createElement('video');
    videoElement.style.position = 'absolute';
    videoElement.style.top = '0';
    videoElement.style.left = '0';
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    newDiv.appendChild(videoElement); // Append the video element to the div

    // Request access to the user's webcam
    navigator.mediaDevices.getUserMedia({ video: { width: 1080, height: 720 } })
      .then(function(stream) {
        videoElement.srcObject = stream;
        videoElement.play();
      })
      .catch(function(error) {
        console.error('Error accessing webcam: ', error);
      });

    // Create the "Close Webcam" button
    var closeButton = document.createElement('button');
    closeButton.innerText = 'Close Webcam';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '2px 4px';
    closeButton.style.fontSize = '10px';
    closeButton.style.opacity = '0.5';
    closeButton.style.backgroundColor = '#dc3545';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';

    // Hover effect for the close button
    closeButton.addEventListener('mouseenter', () => closeButton.style.opacity = '1');
    closeButton.addEventListener('mouseleave', () => closeButton.style.opacity = '0.5');

    closeButton.addEventListener('click', function() {
      // Stop the webcam stream
      var stream = videoElement.srcObject;
      if (stream) {
        var tracks = stream.getTracks();
        tracks.forEach(track => track.stop()); // Stop all tracks of the stream
      }

      // Remove the webcam div and show the "Launch Webcam" link again
      newDiv.remove();
      launchLink.style.display = 'inline-block'; // Show the "Launch Webcam" link again
    });

    newDiv.appendChild(closeButton); // Add the close button to the div

    // Create the mirror and PiP buttons (as per the original script)
    var mirrorButton = document.createElement('button');
    mirrorButton.innerText = 'Toggle Mirror';
    mirrorButton.style.position = 'absolute';
    mirrorButton.style.top = '40px';
    mirrorButton.style.right = '10px';
    mirrorButton.style.padding = '2px 4px';
    mirrorButton.style.fontSize = '10px';
    mirrorButton.style.opacity = '0.5';
    mirrorButton.style.backgroundColor = '#007bff';
    mirrorButton.style.color = '#fff';
    mirrorButton.style.border = 'none';
    mirrorButton.style.borderRadius = '5px';
    mirrorButton.style.cursor = 'pointer';

    mirrorButton.addEventListener('click', function() {
      // Toggle mirror effect
      if (videoElement.style.transform === 'scaleX(-1)') {
        videoElement.style.transform = ''; // Reset transform
      } else {
        videoElement.style.transform = 'scaleX(-1)'; // Flip horizontally
      }
    });

    newDiv.appendChild(mirrorButton); // Add the mirror button

    var pipButton = document.createElement('button');
    pipButton.innerText = 'PiP';
    pipButton.style.position = 'absolute';
    pipButton.style.top = '70px';
    pipButton.style.right = '10px';
    pipButton.style.padding = '2px 4px';
    pipButton.style.fontSize = '10px';
    pipButton.style.opacity = '0.5';
    pipButton.style.backgroundColor = '#28a745';
    pipButton.style.color = '#fff';
    pipButton.style.border = 'none';
    pipButton.style.borderRadius = '5px';
    pipButton.style.cursor = 'pointer';

    pipButton.addEventListener('click', function() {
      if (videoElement.requestPictureInPicture) {
        videoElement.style.objectFit = 'cover'; // Ensure no black bars
        newDiv.style.display = 'none'; // Hide the div during PiP
        videoElement.requestPictureInPicture()
          .catch(function(error) {
            console.error('Error with Picture-in-Picture:', error);
          });
      } else {
        alert('Your browser does not support Picture-in-Picture.');
      }
    });

    newDiv.appendChild(pipButton); // Add the PiP button

    // Event listener to detect when PiP is closed
    videoElement.addEventListener('leavepictureinpicture', function() {
      newDiv.style.display = 'block'; // Show the parent div again after PiP
    });

    // Event listener to maintain the aspect ratio on resize
    newDiv.addEventListener('resize', function() {
      const aspectRatio = 16 / 9;
      const width = newDiv.offsetWidth;
      const newHeight = width / aspectRatio;
      newDiv.style.height = `${newHeight}px`;
    });

    // Create the "Reset Webcam" button (new button below PiP)
    var resetButton = document.createElement('button');
    resetButton.innerText = 'Reset Webcam';
    resetButton.style.position = 'absolute';
    resetButton.style.top = '100px'; // Position it below PiP button
    resetButton.style.right = '10px';
    resetButton.style.padding = '2px 4px';
    resetButton.style.fontSize = '10px';
    resetButton.style.opacity = '0.5';
    resetButton.style.backgroundColor = '#ffc107'; // Yellow color for reset
    resetButton.style.color = '#fff';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '5px';
    resetButton.style.cursor = 'pointer';

    resetButton.addEventListener('click', function() {
      // First, call the "Close Webcam" action
      var stream = videoElement.srcObject;
      if (stream) {
        var tracks = stream.getTracks();
        tracks.forEach(track => track.stop()); // Stop all tracks of the stream
      }

      // Remove the webcam div
      newDiv.remove();

      // Then, immediately launch the webcam again by calling startWebcamExperience
      startWebcamExperience(launchLink);
    });

    newDiv.appendChild(resetButton); // Add the reset button
  } else {
    console.error('No element found with the specified prefix.');
  }
}

// Initialize the page with the "Launch Webcam" link
function initialize() {
  const existingElement = document.querySelector('[id^="video-js--theater-mode-toggle"]');
  if (existingElement) {
    const launchLink = createLaunchLink();
    existingElement.parentNode.insertBefore(launchLink, existingElement); // Insert the "Launch Webcam" link
  } else {
    console.error('No element found with the specified prefix.');
  }
}

// Call the initialize function to set everything up
initialize();
//
