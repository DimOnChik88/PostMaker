console.log(11);

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const massagesElement = document.querySelector('.userMessages');
let API_URL = 'http://localhost:5000/userMessages';

loadingElement.style.display = '';
listAllUserMessages();

form.addEventListener('submit', event => {
    massagesElement.innerHTML = '';
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const message = formData.get('message');
    const userMessage = {
        name,
        message
    };
    form.style.display = 'none';
    loadingElement.style.display = '';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(userMessage),
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.json())
        .then(createdUserMessage => {
            form.reset();
            setTimeout(() => {
                form.style.display = '';
            },3000);
            listAllUserMessages();
        });
});

function listAllUserMessages() {
    fetch(API_URL)
        .then(res => res.json())
        .then(messages => {
            messages.reverse();
            messages.forEach(userMessage => {
                const div = document.createElement('div');

                const header = document.createElement('h3');
                header.textContent = userMessage.name;

                const content = document.createElement('p');
                content.textContent = userMessage.message;

                const date = document.createElement('small');
                date.textContent = userMessage.created;

                div.appendChild(header);
                div.appendChild(content);
                div.appendChild(date);

                massagesElement.appendChild(div);
            });
            loadingElement.style.display = 'none';

        })
}
