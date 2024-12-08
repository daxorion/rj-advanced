// RJ Player Advanced
// Create a new style element
const style = document.createElement('style');

// Add the CSS rules inside the style element
style.innerHTML = `
    .video-js--controls-overlay {
        display: none !important;
    }

    .vjs-control-bar {
     //  opacity: .2 !important;
        background: #00000030 !important;
    }

		.video-js {
			//padding-top: -25px !important;
		}


   /* Custom styles for when the user is inactive */
.video-js.vjs-user-active {
    padding-bottom: 50px !important;
   // transition: padding-bottom 0.1s ease-in-out; /* Smooth transition */
}

.video-js.vjs-user-inactive {
   padding-bottom: 50px !important;
  //  transition: padding-bottom 0.4s ease-in-out; /* Smooth transition */
}


/* Instructions sliding panel */
#instructionsPanel {
    position: fixed;
    top: 0;
    font-family: Arial, Helvetica, sans-serif;
    right: -300px; /* Initially off-screen */
    width: 260px;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    transition: right 0.3s ease;
    z-index: 1001;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

#instructionsPanel h2, h3 {
    margin: 0 0 0 0;
    
}

#instructionsPanel button {
    margin: 20px;
    background-color: #ff4c4c;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
}

#instructionsPanel ul {
    list-style-type: none;
    padding: 0;
    font-size: 1em;
}

/* Style the shortcut key blocks */
.hotkey {
    display: inline-block;
    background-color: #f0f0f0; /* Light grey background */
    padding: 4px 6px; /* Add some padding to the block */
    margin: 2px 5px; /* Space between each key */
    border-radius: 5px; /* Rounded corners */
    font-family: Arial, Helvetica, sans-serif; /* Sans-serif font */
    min-width: 10px;
    color: #333; /* Dark text color for contrast */
    font-size: 1em; /* Adjust size as needed */
    text-align: center; /* Center the text within the block */
}




`;

// Append the style element to the head of the document
document.head.appendChild(style);

// Use the window load event to ensure the script runs when the page is fully loaded
window.addEventListener('load', function () {
	// Step 1: Check localStorage for the hotkeys state
	let kbShortcutsActive = localStorage.getItem('hotkeysActive') === 'true'; // 'true' or 'false' from localStorage

	// Step 2: Search for the video element
	const videoElement = document.querySelector('video'); // Select the first video element found

	if (videoElement) {
		// Step 3: Get the ID of the video element
		const videoId = videoElement.id;

		// Step 4: Initialize the Video.js player using the found ID
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
		let endPoint = player.duration() - 0.01; // Default to 1 second before the end of the video

		// Status display logic
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
		statusDisplay.addEventListener('click', function () {
			kbShortcutsActive = !kbShortcutsActive; // Toggle the hotkeys active state
			localStorage.setItem('hotkeysActive', kbShortcutsActive); // Save the state to localStorage
			updateStatusDisplay(); // Update the status display text and color
		});

		parentDiv.appendChild(statusDisplay);
		updateStatusDisplay();

		// Function to update the status display text and color
		function updateStatusDisplay() {
			if (kbShortcutsActive) {
				statusDisplay.textContent = 'Adv Hotkeys: Active';
				statusDisplay.style.backgroundColor = '#32cd32b0'; // Light green for active
			} else {
				statusDisplay.textContent = 'Adv Hotkeys: Inactive';
				statusDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'; // Grey for inactive
			}
		}

		// Create the question mark link element (for opening instructions)
		const questionMarkButton = document.createElement('div');
		questionMarkButton.textContent = '?'; // Display question mark
		questionMarkButton.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
		questionMarkButton.style.color = 'white';
		questionMarkButton.style.padding = '5px 10px';
		questionMarkButton.style.borderRadius = '5px';
		questionMarkButton.style.fontSize = '14px';
		questionMarkButton.style.cursor = 'pointer'; // Make clickable
		questionMarkButton.style.marginLeft = '5px'; // Space between the buttons

		// Add an event listener to toggle the sliding instructions panel
		questionMarkButton.addEventListener('click', function () {
			const instructionsPanel = document.getElementById('instructionsPanel');
			if (instructionsPanel.style.right === '0px') {
				instructionsPanel.style.right = '-300px'; // Slide out
			} else {
				instructionsPanel.style.right = '0px'; // Slide in
			}
		});

		parentDiv.appendChild(questionMarkButton);

		// Append the parent div to the body
		document.body.appendChild(parentDiv);

		// Create the sliding instructions panel
		const instructionsPanel = document.createElement('div');
		instructionsPanel.id = 'instructionsPanel'; // Give it an ID for styling and reference
		instructionsPanel.innerHTML = `
<h2>Advanced Player Hotkeys</h2>
<h4>Use these hotkeys on your laptop. Learn more <a href="/courses/109836-welcome-to-rhythm-juice/lessons/1868165-03-03-lesson-player-hotkeys" style="color:red;">here.</a></h4>

<h3>Playback Controls</h3>
<ul>
    <li><span class="hotkey">k</span> Play/Pause</li>
    <li><span class="hotkey">j</span> Back 2 frames</li>
    <li><span class="hotkey">h</span> Back 10 frames</li>
    <li><span class="hotkey">l</span> Forward 2 frames</li>
    <li><span class="hotkey">;</span> Forward 10 frames</li>
</ul>

<h3>Speed Controls</h3>
<ul>
    <li><span class="hotkey">u</span> Slow Down</li>
    <li><span class="hotkey">o</span> Speed Up</li>
    <li><span class="hotkey">i</span> 1x (Reset)</li>
</ul>

<h3>Looping Controls</h3>
<ul>
    <li><span class="hotkey">s</span> Set Start Point</li>
    <li><span class="hotkey">d</span> Set End Point & Loop</li>
    <li><span class="hotkey">w</span> Jump to Start Point</li>
    <li><span class="hotkey">e</span> Loop On/Off</li>
    <li><span class="hotkey">r</span> Reset Loop/Repeat Video</li>
</ul>

<h3>Miscellaneous Controls</h3>
<ul>
    <li><span class="hotkey">b</span> Dim Control Bar</li>
    <li><span class="hotkey">p</span> Toggle Picture-in-Picture</li>
    <li><span class="hotkey">y</span> Toggle Mirror</li>
    <li><span class="hotkey">command+7</span> Hotkey Toggle</li>
</ul>

<h3>End Screen</h3>
<ul>
    <li><span class="hotkey">Escape</span> Repeat Video</li>
    <li><span class="hotkey">Enter</span> Complete & Continue</li>
</ul>

<button id="closeInstructions">Close</button>


        `;
		document.body.appendChild(instructionsPanel);

		// Close button for instructions panel
		document
			.getElementById('closeInstructions')
			.addEventListener('click', function () {
				instructionsPanel.style.right = '-300px'; // Slide out the panel
			});

		// Create markers
		const createMarker = (time, color) => {
			const marker = document.createElement('div');
			marker.style.position = 'absolute';
			marker.style.width = '0'; // No width
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
						endPoint = player.duration() - 0.2;
						loopEnabled = true;
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
						endPoint = player.duration() - 0.2;
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
						const nextUrlLink = document.querySelector('.button_to');
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
				localStorage.setItem('hotkeysActive', kbShortcutsActive); // Save the state to localStorage
				updateStatusDisplay();
				event.preventDefault(); // Prevent default behavior for the toggle
			}

			// Toggle mirror with 'y'
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
	launchLink.addEventListener(
		'mouseenter',
		() => (launchLink.style.textDecoration = 'underline')
	);
	launchLink.addEventListener(
		'mouseleave',
		() => (launchLink.style.textDecoration = 'none')
	);

	launchLink.addEventListener('click', function (event) {
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
	var existingElement = document.querySelector(
		'[id^="video-js--theater-mode-toggle"]'
	);

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
		navigator.mediaDevices
			.getUserMedia({ video: { width: 1080, height: 720 } })
			.then(function (stream) {
				videoElement.srcObject = stream;
				videoElement.play();
			})
			.catch(function (error) {
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
		closeButton.addEventListener(
			'mouseenter',
			() => (closeButton.style.opacity = '1')
		);
		closeButton.addEventListener(
			'mouseleave',
			() => (closeButton.style.opacity = '0.5')
		);

		closeButton.addEventListener('click', function () {
			// Stop the webcam stream
			var stream = videoElement.srcObject;
			if (stream) {
				var tracks = stream.getTracks();
				tracks.forEach((track) => track.stop()); // Stop all tracks of the stream
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

		mirrorButton.addEventListener('click', function () {
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

		pipButton.addEventListener('click', function () {
			if (videoElement.requestPictureInPicture) {
				videoElement.style.objectFit = 'cover'; // Ensure no black bars
				newDiv.style.display = 'none'; // Hide the div during PiP
				videoElement.requestPictureInPicture().catch(function (error) {
					console.error('Error with Picture-in-Picture:', error);
				});
			} else {
				alert('Your browser does not support Picture-in-Picture.');
			}
		});

		newDiv.appendChild(pipButton); // Add the PiP button

		// Event listener to detect when PiP is closed
		videoElement.addEventListener('leavepictureinpicture', function () {
			newDiv.style.display = 'block'; // Show the parent div again after PiP
		});

		// Event listener to maintain the aspect ratio on resize
		newDiv.addEventListener('resize', function () {
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

		resetButton.addEventListener('click', function () {
			// First, call the "Close Webcam" action
			var stream = videoElement.srcObject;
			if (stream) {
				var tracks = stream.getTracks();
				tracks.forEach((track) => track.stop()); // Stop all tracks of the stream
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
	const existingElement = document.querySelector(
		'[id^="video-js--theater-mode-toggle"]'
	);
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



document.addEventListener('keydown', function (event) {
    if (event.key === 'b') {
        // Prevent the default action (like scrolling)
        event.preventDefault();

        // Find the control bar element
        const controlBar = document.querySelector('.vjs-control-bar');

        if (controlBar) {
            // Toggle opacity
            let currentOpacity = window.getComputedStyle(controlBar).opacity;

            if (currentOpacity === '0.2') {
                // Set opacity to 1 if it's currently 0.2
                controlBar.style.opacity = '1';
                localStorage.setItem('controlBarOpacity', '1'); // Save setting
            } else {
                // Set opacity to 0.2 if it's not 0.2
                controlBar.style.opacity = '0.2';
                localStorage.setItem('controlBarOpacity', '0.2'); // Save setting
            }
        }
    }
});

// Apply saved opacity setting from localStorage when the page loads
window.addEventListener('load', function() {
    const savedOpacity = localStorage.getItem('controlBarOpacity');
    if (savedOpacity) {
        const controlBar = document.querySelector('.vjs-control-bar');
        if (controlBar) {
            controlBar.style.opacity = savedOpacity;
        }
    }
});





