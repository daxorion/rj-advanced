// RJ Player Advanced
// Create a new style element
const style = document.createElement('style');

// Add the CSS rules inside the style element
style.innerHTML = `
    .video-js--controls-overlay {
        display: none !important;
    }

    .vjs-control-bar {
        opacity: 0.8 !important;
    }
    
  

   /* Custom styles for when the user is inactive */
.video-js.vjs-user-active {
    padding-bottom: 100px !important;
    
}

.video-js.vjs-user-inactive {
    padding-bottom: 100px !important;
    
}


`;

// Append the style element to the head of the document
document.head.appendChild(style);

// Use the window load event to ensure the script runs when the page is fully loaded
window.addEventListener('load', function () {
    // Step 1: Search for the video element
    const videoElement = document.querySelector('video'); // Select the first video element found

    if (videoElement) {
        // Step 2: Get the ID of the video element
        const videoId = videoElement.id;

        // Step 3: Initialize the Video.js player using the found ID
        const player = videojs(videoId);

        // Initialize mirroring state
        let isMirrored = false;

        // Function to toggle mirroring
        const toggleMirror = () => {
            isMirrored = !isMirrored;
            if (isMirrored) {
                videoElement.style.transform = 'scaleX(-1)'; // Mirror the video horizontally
                console.log('Video mirrored');
            } else {
                videoElement.style.transform = 'scaleX(1)'; // Reset the mirror effect
                console.log('Video unmirrored');
            }
        };
        
        

        // Playback control variables
        const frameDuration = 1 / 30; // Assuming 30 FPS
        const skipFrames2 = 2;
        const skipFrames10 = 10;
        const skipDuration2 = frameDuration * skipFrames2;
        const skipDuration10 = frameDuration * skipFrames10;

        let loopEnabled = false;
				let startPoint = 0; // In seconds
				let endPoint = player.duration() - .01; // Default to 1 second before the end of the video

        // Status for keyboard shortcuts
        let kbShortcutsActive = true;



// Create a parent container for both elements
const parentDiv = document.createElement('div');
parentDiv.style.position = 'fixed';
parentDiv.style.display = 'flex';
parentDiv.style.bottom = '10px';
parentDiv.style.left = '10px';
parentDiv.style.zIndex = '1000';

// Create the status display
const statusDisplay = document.createElement('div');
statusDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
statusDisplay.style.color = 'white';
statusDisplay.style.padding = '5px 10px';
statusDisplay.style.borderRadius = '5px';
statusDisplay.style.fontSize = '14px';
statusDisplay.style.cursor = 'pointer'; // Make clickable

// Add an event listener to toggle hotkeys on click
statusDisplay.addEventListener('click', function() {
    kbShortcutsActive = !kbShortcutsActive; // Toggle the hotkeys active state
    updateStatusDisplay(); // Update the status display text
});
parentDiv.appendChild(statusDisplay);
updateStatusDisplay();

// Create the question mark link element
const questionMarkButton = document.createElement('div');
questionMarkButton.textContent = '?';  // Display question mark
questionMarkButton.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
questionMarkButton.style.color = 'white';
questionMarkButton.style.padding = '5px 10px';
questionMarkButton.style.borderRadius = '5px';
questionMarkButton.style.fontSize = '14px';
questionMarkButton.style.cursor = 'pointer'; // Make clickable
questionMarkButton.style.marginLeft = '5px'; // Space between the buttons

// Add an event listener to navigate to a link when clicked
questionMarkButton.addEventListener('click', function() {
    window.location.href = '/courses/109836-welcome-to-rhythm-juice/lessons/1854278-03-04-lesson-player-advanced-controls';  // Replace with your desired link
    console.log('Navigating to the help page');
});
parentDiv.appendChild(questionMarkButton);

// Append the parent div to the body
document.body.appendChild(parentDiv);




        

        // Create markers
        const createMarker = (time, color) => {
		    const marker = document.createElement('div');
		    marker.style.position = 'absolute';
		    marker.style.width = '0';  // No width
		    marker.style.height = '0'; // No height
		    marker.style.borderLeft = '7.5px solid transparent'; // Half the width of the base
		    marker.style.borderRight = '7.5px solid transparent'; // Half the width of the base
		    marker.style.borderTop = `15px solid ${color}`; // Set the color and height of the triangle
		    marker.style.bottom = '0';
		    marker.style.transform = 'translateX(-50%)';
		    marker.style.zIndex = '1000';
		    marker.classList.add('custom-marker');
		    return marker;
		};

        const updateMarkers = () => {
            const controlBar = player.el().querySelector('.vjs-control-bar');
            const progressControl = player
                .el()
                .querySelector('.vjs-progress-control');

            // Clear existing markers
            const existingMarkers = controlBar.querySelectorAll('.custom-marker');
            existingMarkers.forEach((marker) => marker.remove());

            // Create new markers if looping is enabled
            if (loopEnabled) {
                const duration = player.duration();
                const startMarker = createMarker(
                    (startPoint / duration) * 100 + '%',
                    'green'
                );
                const endMarker = createMarker(
                    (endPoint / duration) * 100 + '%',
                    'red'
                );
                startMarker.style.left = `${(startPoint / duration) * 100}%`;
                endMarker.style.left = `${(endPoint / duration) * 100}%`;
                progressControl.appendChild(startMarker);
                progressControl.appendChild(endMarker);
            }
        };

        // Update status display function
        function updateStatusDisplay() {
            statusDisplay.textContent = `Adv Hotkeys: ${kbShortcutsActive ? 'Active' : 'Inactive'}`;
        }

        // Handle keyboard shortcuts
        document.addEventListener('keydown', function (event) {
            // Check if the focused element is an input, textarea, or a child of .course_lesson_note_body or a <form>
            const activeElement = document.activeElement;
            const isInNoteBody =
                activeElement.closest('.course_lesson_note_body') !== null;
            const isInForm = activeElement.closest('form') !== null;

            if (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                isInNoteBody ||
                isInForm
            ) {
                return; // Exit if inside an input field, textarea, course lesson note body, or any <form>
            }

            // Check if keyboard shortcuts are active
            if (kbShortcutsActive) {
                const currentTime = player.currentTime();
                let playbackRate = player.playbackRate();

                switch (event.key) {
                    case 'k': // Z to toggle play/pause for pip
                        event.preventDefault(); // Prevent scrolling the page

                        // Check if PIP is active
                        if (document.pictureInPictureElement) {
                            // If in PIP mode, toggle the play/pause state
                            if (player.paused()) {
                                player.play();
                                console.log('Video played in PIP mode');
                            } else {
                                player.pause();
                                console.log('Video paused in PIP mode');
                            }
                        } else {
                            // Normal mode, toggle play/pause
                            if (player.paused()) {
                                player.play();
                                console.log('Video played');
                            } else {
                                player.pause();
                                console.log('Video paused');
                            }
                        }
                        break;

                    case 'p': // Click Picture-in-Picture button
                        const pipButton = document.querySelector(
                            '.vjs-picture-in-picture-control'
                        );
                        if (pipButton) {
                            pipButton.click();
                            console.log('Picture-in-Picture toggled');
                        } else {
                            console.log('Picture-in-Picture button not found.');
                        }
                        event.preventDefault();
                        break;
                    case 'h': // Move back by ten frames
                        player.currentTime(Math.max(0, currentTime - skipDuration10));
                        event.preventDefault();
                        break;
                    case 'j': // Move back by two frames
                        player.currentTime(Math.max(0, currentTime - skipDuration2));
                        event.preventDefault();
                        break;
                    case 'l': // Move forward by two frames
                        player.currentTime(currentTime + skipDuration2);
                        event.preventDefault();
                        break;
                    case ';': // Move forward by ten frames
                        player.currentTime(currentTime + skipDuration10);
                        event.preventDefault();
                        break;
                    case 'u': // Slow down the playback speed
                        playbackRate = Math.max(0.1, playbackRate - 0.1);
                        player.playbackRate(parseFloat(playbackRate.toFixed(1)));
                        console.log(
                            'Playback speed slowed down to:',
                            player.playbackRate()
                        );
                        event.preventDefault();
                        break;
                    case 'o': // Speed up the playback speed
                        playbackRate = Math.min(3.0, playbackRate + 0.1);
                        player.playbackRate(parseFloat(playbackRate.toFixed(1)));
                        console.log('Playback speed sped up to:', player.playbackRate());
                        event.preventDefault();
                        break;
                    case 'i': // Set playback speed to 1
                        player.playbackRate(1.0);
                        console.log('Playback speed reset to 1.0');
                        event.preventDefault();
                        break;
                    case 's': // Set start point
                        startPoint = currentTime;
                        console.log('Start point set to:', startPoint);
                        updateMarkers();
                        break;
                    case 'd': // Set end point and start loop
                        endPoint = currentTime;
                        loopEnabled = true;
                        console.log('End point set to:', endPoint);
                        updateMarkers();
                        break;
                    case 'w': // Jump to start point
                        player.currentTime(startPoint);
                        player.play();
                        console.log('Jumped to start point:', startPoint);
                        break;
                    case 'e': // Toggle loop
                        loopEnabled = !loopEnabled;
                        console.log('Loop enabled:', loopEnabled);
                        updateMarkers();
                        break;
                    case 'r': // Reset loop
                        startPoint = 0;
                        console.log('Start point set to:', startPoint);
                        updateMarkers();
                        endPoint = player.duration() - .2;
                        loopEnabled = true;
                        console.log('End point set to:', endPoint);
                        updateMarkers();
                        break;
                    case 'Escape': // Trigger the cancel autoplay action
                        const cancelAutoplayButton = document.querySelector(
                            '[data-action="click->video-js--autoplay-next#cancelAutoplay"]'
                        );
                        if (cancelAutoplayButton) {
                            cancelAutoplayButton.click();
                            player.play();
                            console.log('Triggered cancel autoplay action');
                        } else {
                            console.log('Cancel autoplay button not found.');
                        }
                        event.preventDefault();
                        break;
                    case 'Enter': // Trigger the next URL link action
                        const nextUrlLink = document.querySelector(
                            '.button_to'
                        );
                        if (nextUrlLink) {
                            nextUrlLink.click();
                            console.log('Triggered next URL link action');
                        } else {
                            console.log('Next URL link not found.');
                        }
                        event.preventDefault();
                        break;
                }
            }

            // Toggle keyboard shortcuts
            if (event.metaKey && event.key === '7') {
                kbShortcutsActive = !kbShortcutsActive;
                updateStatusDisplay();
                event.preventDefault(); // Prevent default behavior for the toggle
            }

            // Toggle mirror with 'm'
            if (event.key == 'y') {
                event.preventDefault(); // Prevent default behavior
                toggleMirror(); // Call the mirror toggle function
            }
        });

        // Loop logic
        player.on('timeupdate', function () {
            if (loopEnabled && player.currentTime() >= endPoint) {
                player.currentTime(startPoint);
                player.play();
            }
        });

        console.log('Video player initialized with ID:', videoId);
    } else {
        console.log('No video element found on the page.');
    }
});













// module toggle

// Function to close all sections
const closeAllSections = () => {
    const modules = document.querySelectorAll('.js-course-module'); // Adjust this selector if needed
    modules.forEach((module) => {
        const toggleButton = module.querySelector(
            '[data-action*="toggleWithHeightAnimation"]'
        );
        if (toggleButton && !module.querySelector('.js-content.hidden')) {
            toggleButton.click(); // Collapse the section if it's open
        }
    });
};

// Function to open all sections
const openAllSections = () => {
    const modules = document.querySelectorAll('.js-course-module'); // Adjust this selector if needed
    modules.forEach((module) => {
        const toggleButton = module.querySelector(
            '[data-action*="toggleWithHeightAnimation"]'
        );
        if (toggleButton && module.querySelector('.js-content.hidden')) {
            toggleButton.click(); // Expand the section if it's closed
        }
    });
};

// Handle keyboard shortcuts for section toggling
document.addEventListener('keydown', function (event) {
    // Close all sections when Ctrl + C is pressed
    if (event.ctrlKey && event.key === 'c') {
        closeAllSections();
    }

    // Open all sections when Ctrl + O is pressed
    if (event.ctrlKey && event.key === 'o') {
        openAllSections();
    }
});

// next previous

// Listen for the keydown event
document.addEventListener('keydown', function (event) {
    // Check for Ctrl key and N or P
    if (event.ctrlKey) {
        let targetLink;

        if (event.key === 'n') {
            // Ctrl + N for right angle
            // Find the next link with the right angle icon
            const rightLinks = document.querySelectorAll(
                'a.t-btn.t-btn-secondary-gray.t-btn-md.t-btn-icon-only i.fa-angle-right'
            );

            if (rightLinks.length > 0) {
                targetLink = rightLinks[0].parentElement; // Get the parent <a> element
            }
        } else if (event.key === 'p') {
            // Ctrl + P for left angle
            // Find the previous link with the left angle icon
            const leftLinks = document.querySelectorAll(
                'a.t-btn.t-btn-secondary-gray.t-btn-md.t-btn-icon-only i.fa-angle-left'
            );

            if (leftLinks.length > 0) {
                targetLink = leftLinks[leftLinks.length - 1].parentElement; // Get the last parent <a> element
            }
        }

        // If a target link was found, navigate to it
        if (targetLink) {
            window.location.href = targetLink.href; // Navigate to the link
            event.preventDefault(); // Prevent default action
        }
    }
});


// Webcam Functionality

// Function to create the initial "Launch Webcam Mirror" link
function createLaunchLink() {
  const launchLink = document.createElement('a');
  launchLink.href = '#';
  launchLink.innerText = 'Launch Webcam Mirror';
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
