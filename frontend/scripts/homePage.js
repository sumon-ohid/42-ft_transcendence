function runHomePageScript() {
  // Save the current content
  const previousContent = document.body.innerHTML;

  // Add blur effect to the body
  document.body.classList.add('blur-background');

  // Clear the current content
  document.body.innerHTML = '';

  // Create a new container for the options
  const container = document.createElement('div');
  container.id = 'home-container';

  // Create the options
const options = ['Play', 'Profile', 'Leaderboard'];
options.forEach(option => {
  // Create a container for each button
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'option-container';

  // Create the button
  const button = document.createElement('button');
  button.className = 'option-button';
  button.textContent = option;
  button.onclick = () => handleOptionClick(option);

  // Append the button to the container
  buttonContainer.appendChild(button);

  // Append the container to the main container
  container.appendChild(buttonContainer);
});

  // Append the container to the body
  document.body.appendChild(container);

  // Push the new state to the history
  history.pushState({ page: 'options', previousContent: previousContent }, '', '/options');
}

function handleOptionClick(option) {
  console.log(`${option} button clicked`);
  // Add your logic here to handle each option
}

window.onpopstate = function(event) {
  if (event.state && event.state.page === 'options') {
    // Restore the previous content
    document.body.innerHTML = event.state.previousContent;
    document.body.classList.remove('blur-background');
  }
};
