// Create a new style element
const style = document.createElement('style');

// Add the CSS rules inside the style element
style.innerHTML = `
    .video-js--controls-overlay {
        display: none !important;
    }

    .vjs-control-bar {
        opacity: 0.0 !important;
    }
`;

// Append the style element to the head of the document
document.head.appendChild(style);



// Use the window load event to ensure the script runs when the page is fully loaded
window.addEventListener('load', function() {
    // Step 1: Search for the video element
    const videoElement = document.querySelector('video'); // Select the first video element found

    if (videoElement) {
        // Step 2: Get the ID of the video element
        const videoId = videoElement.id;

        // Step 3: Initialize the Video.js player using the found ID
        const player = videojs(videoId);

        // Playback control variables
        const frameDuration = 1 / 30; // Assuming 30 FPS
        const skipFrames2 = 2;
        const skipFrames10 = 10;
        const skipDuration2 = frameDuration * skipFrames2;
        const skipDuration10 = frameDuration * skipFrames10;

        // Loop variables
        let loopEnabled = false;
        let startPoint = 0; // In seconds
        let endPoint = player.duration(); // Default to the full duration

        // Status for keyboard shortcuts
        let kbShortcutsActive = true;

        // Create a status display
        const statusDisplay = document.createElement('div');
        statusDisplay.style.position = 'fixed';
        statusDisplay.style.display = 'none';
        statusDisplay.style.bottom = '50%';
        statusDisplay.style.left = '10px';
        statusDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        statusDisplay.style.color = 'white';
        statusDisplay.style.padding = '5px 10px';
        statusDisplay.style.borderRadius = '5px';
        statusDisplay.style.zIndex = '1000';
        statusDisplay.style.fontSize = '14px';
        document.body.appendChild(statusDisplay);
        updateStatusDisplay();

        // Create markers
        const createMarker = (time, color) => {
            const marker = document.createElement('div');
            marker.style.position = 'absolute';
            marker.style.height = '100%';
            marker.style.width = '2px';
            marker.style.backgroundColor = color;
            marker.style.top = '0';
            marker.style.transform = 'translateX(-50%)';
            marker.style.zIndex = '1000';
            marker.classList.add('custom-marker');
            return marker;
        };

        const updateMarkers = () => {
            const controlBar = player.el().querySelector('.vjs-control-bar');
            const progressControl = player.el().querySelector('.vjs-progress-control');

            // Clear existing markers
            const existingMarkers = controlBar.querySelectorAll('.custom-marker');
            existingMarkers.forEach(marker => marker.remove());

            // Create new markers if looping is enabled
            if (loopEnabled) {
                const duration = player.duration();
                const startMarker = createMarker(startPoint / duration * 100 + '%', 'red');
                const endMarker = createMarker(endPoint / duration * 100 + '%', 'green');
                startMarker.style.left = `${startPoint / duration * 100}%`;
                endMarker.style.left = `${endPoint / duration * 100}%`;
                progressControl.appendChild(startMarker);
                progressControl.appendChild(endMarker);
            }
        };

        // Update status display function
        function updateStatusDisplay() {
            statusDisplay.textContent = `Keyboard Shortcuts: ${kbShortcutsActive ? 'Active' : 'Inactive'}`;
        }

        // Handle keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Check if the focused element is an input, textarea, or a child of .course_lesson_note_body or a <form>
    const activeElement = document.activeElement;
    const isInNoteBody = activeElement.closest('.course_lesson_note_body') !== null;
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

                switch(event.key) {
                    
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
			                const pipButton = document.querySelector('.vjs-picture-in-picture-control');
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
                        console.log('Playback speed slowed down to:', player.playbackRate());
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
                    case 'a': // Jump to start point
                        player.currentTime(startPoint);
                        player.play();
                        console.log('Jumped to start point:', startPoint);
                        break;
                    case 'e': // Toggle loop
                        loopEnabled = !loopEnabled;
                        console.log('Loop enabled:', loopEnabled);
                        updateMarkers();
                        break;
                    case 'Escape': // Trigger the cancel autoplay action
                        const cancelAutoplayButton = document.querySelector('[data-action="click->video-js--autoplay-next#cancelAutoplay"]');
                        if (cancelAutoplayButton) {
                            cancelAutoplayButton.click();
                            console.log('Triggered cancel autoplay action');
                        } else {
                            console.log('Cancel autoplay button not found.');
                        }
                        event.preventDefault();
                        break;
                    case 'Enter': // Trigger the next URL link action
                        const nextUrlLink = document.querySelector('[data-video-js--autoplay-next-target="nextUrlLink"]');
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
        });

        // Loop logic
        player.on('timeupdate', function() {
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
    modules.forEach(module => {
        const toggleButton = module.querySelector('[data-action*="toggleWithHeightAnimation"]');
        if (toggleButton && !module.querySelector('.js-content.hidden')) {
            toggleButton.click(); // Collapse the section if it's open
        }
    });
};

// Function to open all sections
const openAllSections = () => {
    const modules = document.querySelectorAll('.js-course-module'); // Adjust this selector if needed
    modules.forEach(module => {
        const toggleButton = module.querySelector('[data-action*="toggleWithHeightAnimation"]');
        if (toggleButton && module.querySelector('.js-content.hidden')) {
            toggleButton.click(); // Expand the section if it's closed
        }
    });
};

// Handle keyboard shortcuts
document.addEventListener('keydown', function(event) {
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
document.addEventListener('keydown', function(event) {
    // Check for Ctrl key and N or P
    if (event.ctrlKey) {
        let targetLink;

        if (event.key === 'n') { // Ctrl + N for right angle
            // Find the next link with the right angle icon
            const rightLinks = document.querySelectorAll('a.t-btn.t-btn-secondary-gray.t-btn-md.t-btn-icon-only i.fa-angle-right');

            if (rightLinks.length > 0) {
                targetLink = rightLinks[0].parentElement; // Get the parent <a> element
            }
        } else if (event.key === 'p') { // Ctrl + P for left angle
            // Find the previous link with the left angle icon
            const leftLinks = document.querySelectorAll('a.t-btn.t-btn-secondary-gray.t-btn-md.t-btn-icon-only i.fa-angle-left');

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


