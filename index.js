const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

window.onload = async () => {
  // Enable Bootsrap Tooltips
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  let { workExperiences, skills } = await loadResources();

  document.getElementById("workExperienceLoader").remove();
  createWorkExperienceCards(workExperiences);

  createSkillProgressBars(skills.languages, "languages");
  createSkillProgressBars(skills.technologies, "technologies");
  createSkillProgressBars(skills.toolsAndapplications, "toolsAndApplications");

  setupShareModal();
  document.getElementById("sharePage").onclick = () => {
    if (navigator.share) {
      navigator.share({ url: window.location.href });
    } else {
      showShareModal();
    }
  };
};

async function loadResources() {
  // TODO: Remove artificial delay
  const dummyLoad = await new Promise((resolve) => setTimeout(resolve, 1000));

  const workExperiencePromise = await fetch(
    "./resources/data/workExperience.json"
  );

  const skillsPromise = await fetch("./resources/data/skills.json");

  return {
    workExperiences: await workExperiencePromise.json(),
    skills: await skillsPromise.json(),
  };
}

function createWorkExperienceCard(workItem) {
  let { company, jobTitle, startDate, endDate, description, skills, icon } =
    workItem;

  startDate = new Date(startDate);
  endDate = endDate == null ? endDate : new Date(endDate);

  const startDateText = `${
    months[startDate.getMonth()]
  } ${startDate.getFullYear()}`;
  const endDateText =
    endDate == null
      ? "Present"
      : `${months[endDate.getMonth()]} ${endDate.getFullYear()}`;

  let skillsHTML = skills
    .map(
      (skill) =>
        `<span class="badge rounded-pill text-bg-success">${skill}</span>`
    )
    .join("\n");

  return `
    <div class="col d-flex align-items-stretch">
        <div class="card mb-4">
            <div class="card-body">
                <h4 class="card-title fw-bold"><i class="me-2 ${icon}"></i>${company}</h4>
                <h6 class="card-text fw-bold">${jobTitle}</h6>
                <span class="card-subtitle text-muted"><time>${startDateText}</time> - ${endDateText}</span>
                <p class="card-text fw-lighter">
                    ${description}
                </p>
            </div>
            <div class="card-footer">
                ${skillsHTML}
            </div>
        </div>
    </div>
    `;
}

function createWorkExperienceCards(workExperiences) {
  let workExperienceArea = document.getElementById("workExperienceArea");
  workExperienceArea.innerHTML = workExperiences
    .map((experience) => createWorkExperienceCard(experience))
    .join("\n");
}

function createSkillProgressBar(skill) {
  let { name, rating, icon } = skill;

  let skillStr = "";
  let skillIconHtml = Array(5)
    .fill(0)
    .map(
      (_, index) =>
        `<i class="bi bi-star-fill ${
          index >= 5 - rating ? "" : "text-warning"
        }"></i>`
    )
    .join(" ");
  let skillValue = 0;
  if (rating == 0) {
    skillStr = "Proficient";
    skillValue = 100;
  } else if (rating == 1) {
    skillStr = "Advanced";
    skillValue = 75;
  } else if (rating == 2) {
    skillStr = "Intermediate";
    skillValue = 50;
  } else if (rating == 3) {
    skillStr = "Novice";
    skillValue = 25;
  }

  return `
    <div class="d-flex align-items-center">
      <i class="fs-4 me-3 ${icon}"></i>
      <div class="d-block d-sm-none">
        <span class="me-2">${name}</span>
        <span> ${skillIconHtml}</span>
      </div>
      <div class="progress d-none d-sm-flex flex-grow-1" style="height: 1.5rem;">
        <div class="progress-bar w-${skillValue}  px-3 bg-success fw-bold d-flex flex-row justify-content-between align-items-center" role="progressbar" aria-valuenow="${skillValue}" aria-valuemin="0" aria-valuemax="100">
          <span>
              ${name}
          </span>
          <span>
              ${skillStr}
          </span>
        </div>
      </div>
    </div>
  `;
}

function createSkillProgressBars(skills, subskillID) {
  skills.sort((a, b) => {
    return a.rating == b.rating
      ? a.name.localeCompare(b.name)
      : a.rating - b.rating;
  });

  let subskillArea = document.getElementById(subskillID);
  subskillArea.innerHTML = skills
    .map((skill) => createSkillProgressBar(skill))
    .join("\n");
}

function setupShareModal() {
  const shareModalDiv = document.getElementById("shareModal");

  shareModalDiv.addEventListener("show.bs.modal", () => console.log("Showing"));
  shareModalDiv.addEventListener("shown.bs.modal", () => console.log("Shown"));
  shareModalDiv.addEventListener("hide.bs.modal", () => console.log("Hiding"));
  shareModalDiv.addEventListener("hidden.bs.modal", () =>
    console.log("Hidden")
  );

  shareModalDiv.querySelector("#modalShareButton").onclick = () =>
    console.log("Shared!");
}

function showShareModal() {
  const shareModalDiv = document.getElementById("shareModal");
  const shareModalBS = bootstrap.Modal.getOrCreateInstance(shareModalDiv);
  shareModalBS.show();
}
