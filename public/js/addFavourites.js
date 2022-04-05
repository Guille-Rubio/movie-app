const buttons = document.getElementsByClassName("addFavBtn")

for (i = 0; i < buttons.length; i++) {
    let id = buttons[i].value
    buttons[i].addEventListener("click", async () => {
        
        await fetch('/addfavourite', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id
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
    })
}