function login() {
    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    // Create a new div element and add content to it
    const div = document.createElement("div");
    div.innerHTML = ` 
        
    `;
    body.appendChild(div);
}

//--- To test
// function login() {
//     console.log("Login function executed");
//     window.location.href = '../index.html';
// }
