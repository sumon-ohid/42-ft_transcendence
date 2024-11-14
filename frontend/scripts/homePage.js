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

  // Create the navigation container
  const navContainer = document.createElement('div');
  navContainer.className = 'nav_container';
  navContainer.innerHTML = `
    <a href="index.html">
      <button id="nav-toggle" class="nav-toggle">
        <i class="fa-solid fa-house"></i>
      </button>
    </a>
    <a href="">
      <button id="nav-toggle" class="nav-toggle">
        <i class="fa-solid fa-user"></i>
      </button>
    </a>
    <a href="#" onclick="logout()">
      <button id="nav-toggle" class="nav-toggle">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </a>
    <!-- Mode switch -->
    <button id="mode-switch" class="nav-toggle">
      <i class="fas fa-moon"></i>
    </button>
  `;

  // Append the navigation container to the body
  document.body.appendChild(navContainer);

  // Push the new state to the history
  history.pushState({ page: 'options', previousContent: previousContent }, '', '/options');

  // mode  switch
    document.getElementById('mode-switch').addEventListener('click', function() {
      document.body.classList.toggle('light-mode');
      const icon = this.querySelector('i');
      if (document.body.classList.contains('light-mode')) {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
          localStorage.setItem('mode', 'light');
      } else {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
          localStorage.setItem('mode', 'dark');
      }
  });

  // Set initial mode based on localStorage
  document.addEventListener('DOMContentLoaded', function() {
      const savedMode = localStorage.getItem('mode');
      const modeSwitchIcon = document.getElementById('mode-switch').querySelector('i');
      if (savedMode === 'light') {
          document.body.classList.add('light-mode');
          modeSwitchIcon.classList.remove('fa-sun');
          modeSwitchIcon.classList.add('fa-moon');
      } else {
          document.body.classList.remove('light-mode');
          modeSwitchIcon.classList.remove('fa-moon');
          modeSwitchIcon.classList.add('fa-sun');
      }
  });

  document.getElementById('nav-toggle').addEventListener('click', function() {
      const navList = document.getElementById('nav-list');
      navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
  });

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