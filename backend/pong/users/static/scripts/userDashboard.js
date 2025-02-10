async function userDashboard() {
  saveCurrentPage("userDashboard");

  if (!userIsLoggedIn()) {
    navigateTo("#login");
    return;
  }

  const body = document.body;

  // Remove all child elements of the body
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }

  const div = document.createElement("div");
  div.className = "settings-container";
  div.innerHTML = /*html*/ `
        <h2>Dashboard</h2>
        <canvas id="gamePlayChart" width="250" height="100"></canvas>
        <canvas id="winLoseChart" width="300" height="200"></canvas>
        <div class="quit-game" onclick="navigateTo('#homePage')">
            <h1>BACK</h1>
        </div>
    `;
  body.appendChild(div);

  // Fetch play history and render charts
  const username = localStorage.getItem("loggedInUser");
  fetch(`/api/get-play-history/${username}`)
    .then((response) => response.json())
    .then((data) => {
      renderGamePlayChart(data);
      renderWinLoseChart(data);
    })
    .catch((error) => {
      console.error("Error fetching play history:", error);
    });
}

function renderGamePlayChart(data) {
  const ctx = document.getElementById("gamePlayChart").getContext("2d");
  const labels = data.map((entry) => new Date(entry.date).toISOString());
  const scores = data.map((entry) => entry.score);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Game Scores",
          data: scores,
          borderColor: "rgb(0, 183, 255)",
          backgroundColor: "rgba(0, 183, 255, 0.2)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
          },
          ticks: {
            color: "white",
            font: {
              family: "Sour Gummy",
            },
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "white",
            font: {
              family: "Sour Gummy",
            },
            stepSize: 1, // Ensure full numbers only
            callback: function (value) {
              if (value % 1 === 0) {
                return value;
              }
            },
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "white",
            font: {
              family: "Sour Gummy",
            },
          },
        },
      },
    },
  });
}

function renderWinLoseChart(data) {
  const ctx = document.getElementById("winLoseChart").getContext("2d");
  const winCount = data.filter((entry) => entry.win).length;
  const loseCount = data.filter((entry) => entry.lose).length;
  const totalCount = winCount + loseCount;

  let winPercent = 0;
  let losePercent = 0;

  if (totalCount > 0) {
    winPercent = ((winCount / totalCount) * 100).toFixed(2);
    losePercent = ((loseCount / totalCount) * 100).toFixed(2);
  }

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: [`Wins (${winPercent}%)`, `Loses (${losePercent}%)`],
      datasets: [
        {
          data: [winCount, loseCount],
          backgroundColor: ["rgb(86, 230, 230)", "rgb(255, 99, 133)"],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "white",
            font: {
              family: "Sour Gummy",
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const label = tooltipItem.label || "";
              const value = tooltipItem.raw || 0;
              return `${label}: ${value}`;
            },
          },
        },
      },
    },
  });
}
