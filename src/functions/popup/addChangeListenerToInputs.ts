import { inputChangeListener } from './inputChangeListener';

export function addChangeListenerToInputs() {
    document.querySelectorAll('.original-text, .new-text').forEach(input => {
        input.removeEventListener('input', inputChangeListener);
        input.addEventListener('input', inputChangeListener);
    });
}