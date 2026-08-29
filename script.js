/* =========================================================
   Student Career Navigator - JavaScript
   Author: Hepsiba Alexseelan
   Stack: Vanilla JavaScript (no frameworks)
   ---------------------------------------------------------
   This file handles:
     1. Navbar background change on scroll
     2. Animated skill progress bars (run when scrolled into view)
     3. Career Readiness Score calculator (the unique feature)
     4. Contact form validation + success message
     5. Reveal-on-scroll animation helper
   ========================================================= */

/* Wait until the whole page is loaded before running anything */
window.addEventListener("DOMContentLoaded", function () {
  /* ----------------------------------------------------------
     1. NAVBAR: add solid background after scrolling down 60px
     ---------------------------------------------------------- */
  const navbar = document.getElementById("mainNav");

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll(); /* run once on load */

  /* ----------------------------------------------------------
     2. SKILL BARS: animate widths only when visible
     ---------------------------------------------------------- */
  const skillBars = document.querySelectorAll(".skill-card .progress-bar");

  /* Animate each bar to the percentage stored in data-skill */
  function animateSkillBars() {
    skillBars.forEach(function (bar) {
      const value = bar.getAttribute("data-skill");
      bar.style.width = value + "%";
    });
  }

  /* ----------------------------------------------------------
     3. REVEAL ON SCROLL: simple fade-up for sections
     ---------------------------------------------------------- */
  /* Add the reveal class to the main section containers */
  const revealTargets = document.querySelectorAll("section, header.hero-section");
  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
  });

  /* Use IntersectionObserver to add .visible when element enters screen */
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          /* If this is the skills section, fire the bar animation once */
          if (entry.target.id === "skills") {
            animateSkillBars();
          }
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach(function (el) {
    observer.observe(el);
  });

  /* ----------------------------------------------------------
     4. CAREER READINESS SCORE (UNIQUE FEATURE)
     ----------------------------------------------------------
     Each slider updates its live number label.
     The Calculate button computes the overall percentage
     and shows a friendly message based on the score.
     ---------------------------------------------------------- */

  /* Grab all the slider inputs and their value labels */
  const sliders = {
    tech:     { input: document.getElementById("scoreTech"),     label: document.getElementById("valTech") },
    comm:     { input: document.getElementById("scoreComm"),     label: document.getElementById("valComm") },
    problem:  { input: document.getElementById("scoreProblem"),  label: document.getElementById("valProblem") },
    projects: { input: document.getElementById("scoreProjects"), label: document.getElementById("valProjects") },
    certs:    { input: document.getElementById("scoreCerts"),    label: document.getElementById("valCerts") },
  };

  /* Update the small number next to each slider as it moves */
  Object.keys(sliders).forEach(function (key) {
    const item = sliders[key];
    item.input.addEventListener("input", function () {
      item.label.textContent = item.input.value;
    });
  });

  /* The button, number, label and message elements */
  const calcBtn     = document.getElementById("calcBtn");
  const scoreNumber = document.getElementById("scoreNumber");
  const scoreLabel  = document.getElementById("scoreLabel");
  const scoreMessage= document.getElementById("scoreMessage");
  const scoreRing   = document.getElementById("scoreRing");

  /* Main calculation function */
  function calculateCareerScore() {
    /* Read each slider value (1-10) and convert to a percentage */
    const values = Object.keys(sliders).map(function (key) {
      return parseInt(sliders[key].input.value, 10);
    });

    const sum = values.reduce(function (total, num) {
      return total + num;
    }, 0);

    /* 5 sliders x max 10 = 50 max -> convert to a percentage out of 100 */
    const percentage = Math.round((sum / 50) * 100);

    /* Show the number */
    scoreNumber.textContent = percentage;

    /* Fill the circular ring using a conic-gradient */
    const degrees = (percentage / 100) * 360;
    scoreRing.style.background =
      "conic-gradient(var(--accent) " + degrees + "deg, rgba(255,255,255,0.1) " + degrees + "deg)";

    /* Pick a friendly message based on the percentage */
    let label = "";
    let message = "";

    if (percentage >= 85) {
      label = "Outstanding! 🌟";
      message =
        "You are highly career-ready. Keep building real projects and you'll stand out to recruiters.";
    } else if (percentage >= 70) {
      label = "Great Potential!";
      message =
        "You're on a strong path. A few more projects or certifications will push you even further.";
    } else if (percentage >= 50) {
      label = "Good Progress";
      message =
        "You have a solid foundation. Focus on hands-on projects and communication to level up faster.";
    } else {
      label = "Just Getting Started";
      message =
        "Every expert was once a beginner. Keep practicing, build small projects, and your score will grow quickly!";
    }

    scoreLabel.textContent = label;
    scoreMessage.textContent = message;

    /* Smoothly scroll the result into view on small screens */
    scoreRing.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* Attach the function to the button */
  calcBtn.addEventListener("click", calculateCareerScore);

  /* ----------------------------------------------------------
     5. CONTACT FORM VALIDATION + SUCCESS MESSAGE
     ---------------------------------------------------------- */
  const contactForm  = document.getElementById("contactForm");
  const formSuccess  = document.getElementById("formSuccess");

  /* Helper: a simple email format check */
  function isValidEmail(email) {
    /* Basic pattern: something@something.something */
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  contactForm.addEventListener("submit", function (event) {
    /* Stop the page from refreshing when the form is submitted */
    event.preventDefault();

    /* Get the input fields */
    const name    = document.getElementById("cName");
    const email   = document.getElementById("cEmail");
    const subject = document.getElementById("cSubject");
    const message = document.getElementById("cMessage");

    /* Assume valid until a check fails */
    let isValid = true;

    /* Validate each field. If empty -> show Bootstrap invalid feedback */
    if (name.value.trim() === "") {
      name.classList.add("is-invalid");
      isValid = false;
    } else {
      name.classList.remove("is-invalid");
    }

    if (email.value.trim() === "" || !isValidEmail(email.value.trim())) {
      email.classList.add("is-invalid");
      isValid = false;
    } else {
      email.classList.remove("is-invalid");
    }

    if (subject.value.trim() === "") {
      subject.classList.add("is-invalid");
      isValid = false;
    } else {
      subject.classList.remove("is-invalid");
    }

    if (message.value.trim() === "") {
      message.classList.add("is-invalid");
      isValid = false;
    } else {
      message.classList.remove("is-invalid");
    }

    /* If everything is valid, show the success message and reset */
    if (isValid) {
      formSuccess.classList.remove("d-none");
      contactForm.reset();

      /* Hide the success message again after 5 seconds */
      setTimeout(function () {
        formSuccess.classList.add("d-none");
      }, 5000);
    } else {
      /* Make sure an old success message is hidden if re-submitting with errors */
      formSuccess.classList.add("d-none");
    }
  });

  /* ----------------------------------------------------------
     6. CLOSE MOBILE NAVBAR ON LINK CLICK
     ----------------------------------------------------------
     On small screens, clicking a nav link should close
     the collapsed Bootstrap menu automatically.
     ---------------------------------------------------------- */
  const navLinks = document.querySelectorAll("#navMenu .nav-link");
  const navCollapse = document.getElementById("navMenu");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      /* If the menu is open (it has the "show" class from Bootstrap), hide it */
      if (navCollapse.classList.contains("show")) {
        /* Bootstrap 5 exposes a Collapse instance on the element */
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });
});
