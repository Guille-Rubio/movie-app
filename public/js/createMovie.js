const posterInput = document.querySelector('#poster');
const posterPreview = document.querySelector('#poster-preview');

posterInput.addEventListener('input', () => {
    posterPreview.src = posterInput.value;
    posterPreview.style.display = 'block';


});

const hideImg = ()=>{
    posterPreview.style.display = 'none';
};

