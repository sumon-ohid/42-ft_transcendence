
async function fetchUsername() {
    try {
        const response = await fetch('/api/get-username/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
            }
        });
        const data = await response.json();
        if (data.username.length > 6)
          data.username = data.username.substring(0, 6);
        return data.username || "Guest";
    } catch (error) {
        console.error('Error fetching username:', error);
        return "Guest";
    }
}

async function fetchProfilePicture() {
    try {
        const response = await fetch('/api/get-profile-picture/');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.photo || '/../static/images/11475215.jpg';
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        return '/../static/images/11475215.jpg';
    }
}

async function userProfile() {
    saveCurrentPage('userProfile');
    history.replaceState({ page: 'userProfile' }, '', '#userProfile');
  
    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    // Fetch username and profile picture asynchronously
    // This solves the reload problem which was showing 
    // default value first the fetch value from user.
    const [username, profilePicture] = await Promise.all([fetchUsername(), fetchProfilePicture()]);

    // Create a new div element and add content
    const div = document.createElement("div");
    div.className = "settings-container";
    div.innerHTML = ` 
            <div class="round">
                <div class="profile-pic">
                    <img id="profile-picture" src="${profilePicture}" alt="Picture">
                </div>
            </div>
            <div class="inside-wel">
                <div class="temp">
                    <p>No history...</p>
                </div>
            </div>
            <div class="quit-game" onclick="homePage()">
                <h1>BACK</h1>
            </div>
            <span id="user-name" class="badge text-bg-secondary">${username}</span>
            <span id="add-friend" class="badge text-bg-primary">Add Friend</span>
            <span id="block" class="badge text-bg-danger">Block</span>
    `;
    body.appendChild(div);

    // Player history
    fetch('/api/get-play-history/')
        .then(response => response.json())
        .then(data => {
            const historyContainer = document.querySelector('.inside-wel');
            
            if (data.length != 0) {
                historyContainer.innerHTML = '';
                data.slice(-5).forEach(record => {
                    const recordElement = document.createElement('div');
                    recordElement.className = 'history-record';
                    let result = record.win ? 'Win' : 'Lose';
                    const resultClass = result === 'Win' ? 'badge text-bg-info' : 'badge text-bg-warning';
                    recordElement.innerHTML = `
                    <div>
                        <span class="badge text-bg-light">
                            <p>Date: ${new Date(record.date).toLocaleDateString()}</p>
                        </span>
                    </div>
                    <div>
                        <span class="badge text-bg-primary">
                            <p>Score: ${record.score}</p>
                        </span>
                    </div>
                    <div>
                        <span class="${resultClass}">
                            <p>Result: ${result}</p>
                        </span>
                    </div>
                    `;
                    historyContainer.appendChild(recordElement);
                });

                const welContainer = document.querySelector('.wel-container');
                const recent = document.createElement('h2');
                recent.innerText = "recent history";
                welContainer.appendChild(recent);
            }
        })
        .catch(error => {
            console.error('Error fetching play history:', error);
        });
}

function getCSRFToken() {
    // const metaToken = document.querySelector('meta[name="csrf-token"]');
    // if (metaToken) {
    //     return metaToken.content;
    // }
    const csrfCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] : null;
}
