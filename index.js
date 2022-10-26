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
  let { workExperiences } = await loadResources();

  document.getElementById("workExperienceLoader").remove();
  createWorkExperienceCards(workExperiences);
};

async function loadResources() {
  // TODO: Remove artificial delay
  // const dummyLoad = await new Promise((resolve) => setTimeout(resolve, 1000));

  const workExperiencePromise = await fetch(
    "./resources/data/workExperience.json"
  );

  return {
    workExperiences: await workExperiencePromise.json(),
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
                <h4 class="card-title fw-bold"><i class="me-2 bi ${icon}"></i>${company}</h4>
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
