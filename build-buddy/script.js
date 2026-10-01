const buddyContainer = document.getElementById("buddy-container");
const buddyBubble = document.getElementById("buddy-bubble");
const buddyImage = document.getElementById("buddy-image");
const primaryAction = document.getElementById("primary-action");

function resetAnimationClasses() {
  buddyImage.classList.remove("float", "bounce", "wiggle", "shake");
}

function showBuddy(status) {
  buddyContainer.classList.remove("hidden");
  resetAnimationClasses();

  if (status === "READY") {
    buddyImage.src = "buddy-ready.png";
    buddyBubble.innerHTML = "Yay! Release is READY 🎉<br>No major risk detected.";
    primaryAction.textContent = "Awesome!";
    primaryAction.style.background = "#22c55e";
    buddyImage.classList.add("bounce");
  }

  else if (status === "REVIEW REQUIRED") {
    buddyImage.src = "buddy-review.png";
    buddyBubble.innerHTML = "Hmm... REVIEW REQUIRED 🤔<br>Please double-check before release.";
    primaryAction.textContent = "Review Now";
    primaryAction.style.background = "#f59e0b";
    buddyImage.classList.add("wiggle");
  }

  else if (status === "BLOCK RELEASE") {
    buddyImage.src = "buddy-critical.png";
    buddyBubble.innerHTML = "STOP! High-risk release detected 🚨";
    primaryAction.textContent = "Fix Now";
    primaryAction.style.background = "#ef4444";
    buddyImage.classList.add("shake");
  }

  else {
    buddyImage.src = "buddy-ready.png";
    buddyBubble.innerHTML = "Build Buddy is watching your release...";
    primaryAction.textContent = "OK";
    primaryAction.style.background = "#22c55e";
    buddyImage.classList.add("float");
  }
}

function hideBuddy() {
  buddyContainer.classList.add("hidden");
}

/* Optional default state on page load */
//showBuddy("BLOCK RELEASE");


const N8N_STATUS_URL =
    "https://chinchuchirakkal.app.n8n.cloud/webhook/build-buddy-latest";

let lastBuildNumber = null;

async function checkReleaseStatus() {
  try {
    const response = await fetch(N8N_STATUS_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    console.log("Build Buddy received:", result);

    if (result.status !== "COMPLETE") {
      return;
    }

    if (result.buildNumber === lastBuildNumber) {
      return;
    }

    lastBuildNumber = result.buildNumber;

    showBuddy(result.recommendation);

  } catch (error) {
    console.log("Build Buddy waiting for n8n...", error);
  }
}

setInterval(checkReleaseStatus, 3000);

checkReleaseStatus();