/**
 * HERIZON | Marketing & Branding Portfolio Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll state
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Scroll Reveal / Fade-up Animation
  const fadeElements = document.querySelectorAll('.fade-up');
  const revealOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once visible
      }
    });
  };

  const observerOptions = {
    root: null, // Viewport
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: '0px 0px -50px 0px' // Offset trigger point slightly
  };

  const scrollObserver = new IntersectionObserver(revealOnScroll, observerOptions);
  fadeElements.forEach(element => {
    scrollObserver.observe(element);
  });

  // 4. Case Studies Category Filtering
  const filterTabs = document.querySelectorAll('.filter-tab');
  const caseStudies = document.querySelectorAll('.case-study-item');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      filterTabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      caseStudies.forEach((study, index) => {
        const studyCategory = study.getAttribute('data-category');
        
        if (filterValue === 'all' || studyCategory === filterValue) {
          // Show case study
          study.classList.remove('hidden-tab');
          // Add entrance transition
          study.style.opacity = '0';
          setTimeout(() => {
            study.style.opacity = '1';
          }, 50);
        } else {
          // Hide case study
          study.classList.add('hidden-tab');
        }
      });

      // Refresh scroll animations for remaining visible elements
      setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
      }, 100);
    });
  });
});
