const body = document.body
const div = document.createElement("div")
div.innerHTML = `
<h1>Hello</h1>
<div class="test">
    <p> This is a DOM test </p>
</div>

`
body.append(div);