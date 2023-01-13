const button = document.getElementsByClassName("favbtn");

for (let i = 0; i < button.length; i++) {

    button[i].addEventListener('click', async function (e) {
        console.log("click en " + button[i])
        await fetch('/removefavourite', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: button[i].value
            })
        })
            .then(function (response) {
                if (response.ok) {
                    console.log('Click was recorded');
                    return;
                }
                throw new Error('Request failed.');
            })
            .catch(function (error) {
                console.log(error);
            });
    });

}