  // Create the modal and its components
const createModal = () => {
    // Create the modal container
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.style.display = 'none'; // Hidden by default
    modal.style.position = 'fixed';
    modal.style.zIndex = '999';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.overflow = 'auto';
    modal.style.paddingTop = '100px';

    // Create the modal content
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.margin = 'auto';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '500px';
    modalContent.style.position = 'relative';
    modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

    // Create the close button (X)
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '';
    closeBtn.style.color = '#aaa';
    closeBtn.style.fontSize = '28px';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.position = 'absolute';
    closeBtn.style.right = '20px';
    closeBtn.style.top = '20px';
    closeBtn.style.cursor = 'pointer';

    // Add the close button to modal content
    modalContent.appendChild(closeBtn);

    // Add the title and categorized list
    modalContent.innerHTML += `
        <h2 style="font-size: 24px; margin-bottom: 20px; text-align: center;">Keyboard Shortcuts</h2>
        <div>
            <h3 style="font-size: 20px; color: #333;">Looping:</h3>
            <ul style="list-style-type: none; padding-left: 20px;">
                <li><span style="font-weight: bold;">s</span>: Start Point</li>
                <li><span style="font-weight: bold;">d</span>: End Point & Start Loop</li>
                <li><span style="font-weight: bold;">e</span>: Toggle Loop ON/OFF</li>
            </ul>

            <h3 style="font-size: 20px; color: #333;">Frame by Frame:</h3>
            <ul style="list-style-type: none; padding-left: 20px;">
                <li><span style="font-weight: bold;">h</span>: Move Back by 10 Frames</li>
                <li><span style="font-weight: bold;">j</span>: Move Back by 2 Frames</li>
                <li><span style="font-weight: bold;">l</span>: Move Forward by 2 Frames</li>
                <li><span style="font-weight: bold;">;</span>: Move Forward by 10 Frames</li>
            </ul>

            <h3 style="font-size: 20px; color: #333;">Speed Control:</h3>
            <ul style="list-style-type: none; padding-left: 20px;">
                <li><span style="font-weight: bold;">u</span>: Slow Down Playback Speed</li>
                <li><span style="font-weight: bold;">o</span>: Speed Up Playback Speed</li>
                <li><span style="font-weight: bold;">i</span>: Set Playback Speed to 1x</li>
            </ul>

            <h3 style="font-size: 20px; color: #333;">General:</h3>
            <ul style="list-style-type: none; padding-left: 20px;">
                <li><span style="font-weight: bold;">k</span>: Toggle Play/Pause</li>
                <li><span style="font-weight: bold;">p</span>: Toggle Picture-in-Picture</li>
                <li><span style="font-weight: bold;">Escape</span>: Trigger Cancel Autoplay Action</li>
                <li><span style="font-weight: bold;">Enter</span>: Trigger Next URL Link Action</li>
                <li><span style="font-weight: bold;">Command + 0 (Mac) / Ctrl + 0 (Windows/Linux)</span>: Open this Modal</li>
            </ul>
        </div>
    `;

    // Add the modal content to modal
    modal.appendChild(modalContent);

    // Append the modal to the body
    document.body.appendChild(modal);

    // Function to open the modal
    const openModal = () => {
        modal.style.display = 'block';
    };

    // Function to close the modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Close the modal when the 'X' is clicked
    closeBtn.addEventListener('click', () => {
        closeModal();
    });

    // Close the modal when clicking outside of the modal content (on the overlay)
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Return the function to open/close the modal
    return { openModal, closeModal };
};

// Create the modal and the function to open/close it
const { openModal, closeModal } = createModal();

// Create a "Hotkeys" button
const button = document.createElement('button');
button.textContent = 'Hotkeys';
button.style.position = 'fixed'; // Fixed position to stay at the same spot
button.style.bottom = '20px'; // 20px from the bottom
button.style.left = '20px'; // 20px from the left
button.style.padding = '10px 20px'; // Padding for size
button.style.fontSize = '16px'; // Font size for the button
button.style.backgroundColor = '#4CAF50'; // Green background color
button.style.color = 'white'; // White text color
button.style.border = 'none'; // Remove border
button.style.borderRadius = '5px'; // Rounded corners
button.style.cursor = 'pointer'; // Pointer cursor on hover
button.style.zIndex = '1000'; // Ensure button stays above other content

// Toggle the modal when the "Hotkeys" button is clicked
button.addEventListener('click', () => {
    if (modal.style.display === 'block') {
        closeModal();
    } else {
        openModal();
    }
});

// Append the button to the body
document.body.appendChild(button);

// Keyboard shortcut functionality
window.addEventListener('keydown', (event) => {
    // Check for "Command + 0" or "Ctrl + 0"
    if ((event.key === '0' && (event.metaKey || event.ctrlKey))) {
        event.preventDefault(); // Prevent default browser action
        if (modal.style.display === 'block') {
            closeModal();
        } else {
            openModal();
        }
    }

    // Close modal on Escape key press
    if (event.key === 'Escape') {
        closeModal();
    }
});
