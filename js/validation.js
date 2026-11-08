// CIT2011 IA2. Registration form validation and avatar upload.

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const avatarInput = document.getElementById('avatarInput');
    const dropzone = document.getElementById('dropzone');
    const avatarPrompt = document.getElementById('avatarPrompt');
    const avatarError = document.getElementById('avatarError');

    if (!form || !avatarInput || !dropzone) {
        console.error('Registration form elements are missing.');
        return;
    }

    let base64Avatar = '';
    let isReading = false;

    dropzone.addEventListener('click', (event) => {
        if (event.target !== avatarInput) {
            avatarInput.click();
        }
    });

    dropzone.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            avatarInput.click();
        }
    });

    avatarInput.addEventListener('change', handleFileSelect);

    function handleFileSelect(event) {
        const file = event.target.files[0];
        avatarError.textContent = '';
        base64Avatar = '';

        if (!file) {
            avatarPrompt.textContent = 'Drag and drop or click to upload';
            return;
        }

        const validTypes = ['image/jpeg', 'image/png'];

        if (!validTypes.includes(file.type)) {
            avatarError.textContent = 'Please upload a JPG or PNG image.';
            avatarInput.value = '';
            return;
        }

        if (file.size >= 500 * 1024) {
            avatarError.textContent = 'The image must be smaller than 500KB.';
            avatarInput.value = '';
            return;
        }

        const reader = new FileReader();
        isReading = true;
        avatarPrompt.textContent = 'Reading image...';

        reader.onload = (loadEvent) => {
            base64Avatar = loadEvent.target.result;
            isReading = false;
            avatarPrompt.textContent = `Selected: ${file.name}`;
        };

        reader.onerror = () => {
            avatarError.textContent = 'Unable to read the image. Please try again.';
            avatarInput.value = '';
            base64Avatar = '';
            isReading = false;
            avatarPrompt.textContent = 'Drag and drop or click to upload';
        };

        reader.readAsDataURL(file);
    }

    dropzone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropzone.classList.remove('drag-over');

        const file = event.dataTransfer.files[0];
        if (!file) return;

        const transfer = new DataTransfer();
        transfer.items.add(file);
        avatarInput.files = transfer.files;
        handleFileSelect({ target: avatarInput });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        document.querySelectorAll('.error-msg').forEach((item) => {
            item.textContent = '';
        });

        let isValid = true;
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const github = document.getElementById('github').value.trim();

        if (!fullName) {
            document.getElementById('nameError').textContent = 'Full name is required.';
            isValid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            document.getElementById('emailError').textContent = 'Enter a valid email address.';
            isValid = false;
        }

        if (!/^@[A-Za-z0-9-]{1,39}$/.test(github)) {
            document.getElementById('githubError').textContent = 'Enter a valid GitHub username beginning with @.';
            isValid = false;
        }

        if (!base64Avatar) {
            avatarError.textContent = isReading
                ? 'Wait for the image to finish loading.'
                : 'Please upload an avatar.';
            isValid = false;
        }

        if (!isValid || isReading) return;

        const ticketPayload = {
            fullName: fullName,
            email: email,
            github: github,
            avatar: base64Avatar,
            ticketNumber: '#' + Math.floor(10000 + Math.random() * 90000)
        };

        try {
            localStorage.setItem('codingConfUser', JSON.stringify(ticketPayload));
            window.location.href = 'ticket.html';
        } catch (error) {
            console.error('Unable to save registration:', error);
            avatarError.textContent = 'Unable to save registration. Try a smaller image or clear browser storage.';
        }
    });
});