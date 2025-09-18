import { momentsService } from './moments-service.js';

export function initModal() {
    const fab = document.getElementById('fab-add-moment');
    const modal = document.getElementById('add-moment-modal');

    if (!fab || !modal) {
        console.error('Modal or FAB not found');
        return;
    }

    const closeModalBtn = document.getElementById('close-modal-btn');
    const uploadComputerBtn = document.getElementById('upload-computer-btn');
    const uploadDriveBtn = document.getElementById('upload-drive-btn');
    const takePhotoBtn = document.getElementById('take-photo-btn');
    const uploadFormContainer = document.getElementById('upload-form-container');
    const uploadForm = document.getElementById('upload-form');
    const imageInput = document.getElementById('image-input');
    const captionInput = document.getElementById('caption-input');

    fab.addEventListener('click', () => modal.classList.remove('hidden'));
    
    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    if (uploadComputerBtn) {
        uploadComputerBtn.addEventListener('click', () => {
            if(uploadFormContainer) uploadFormContainer.classList.remove('hidden');
        });
    }

    if (uploadDriveBtn) {
        uploadDriveBtn.addEventListener('click', () => {
            alert('Funcionalidade ainda não implementada.');
        });
    }

    if (takePhotoBtn) {
        takePhotoBtn.addEventListener('click', () => {
            alert('Funcionalidade ainda não implementada.');
        });
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const imageFile = imageInput.files[0];
            const caption = captionInput.value;

            if (imageFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    momentsService.addMoment(e.target.result, caption);
                    modal.classList.add('hidden');
                    uploadForm.reset();
                    if(uploadFormContainer) uploadFormContainer.classList.add('hidden');
                    document.dispatchEvent(new CustomEvent('momentsUpdated'));
                };
                reader.readAsDataURL(imageFile);
            }
        });
    }
}
