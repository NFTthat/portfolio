import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Clip-path Reveal Animation
  const revealElements = document.querySelectorAll('.reveal-text');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('clip-hidden');
        entry.target.classList.add('clip-reveal');
        // Optional: unobserve after revealing if we only want it to happen once
        // revealObserver.unobserve(entry.target);
      } else {
        // Optional: remove this if you don't want it to hide again when scrolling up
        entry.target.classList.add('clip-hidden');
        entry.target.classList.remove('clip-reveal');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 2. Scroll-Linked Opacity for Timeline
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  // Using a custom scroll event to calculate distance to center of screen
  // for smoother opacity transitions rather than discrete IntersectionObserver steps
  const updateTimelineOpacity = () => {
    const windowCenter = window.innerHeight / 2;
    
    timelineItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const distanceToCenter = Math.abs(windowCenter - itemCenter);
      
      // If within 150px of center, full opacity, else fade out to 0.3
      if (distanceToCenter < 150) {
        item.style.opacity = '1';
        item.style.transform = 'scale(1.05)';
      } else {
        item.style.opacity = '0.3';
        item.style.transform = 'scale(1)';
      }
    });
  };

  window.addEventListener('scroll', updateTimelineOpacity, { passive: true });
  updateTimelineOpacity(); // initial call

  // 3. Magnetic Button Interaction
  const magneticButtons = document.querySelectorAll('.magnetic-btn');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Translate the button slightly towards the cursor
      // Reduced the multiplier for a subtler effect
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      // Reset position when cursor leaves with a cubic-bezier ease (handled in CSS)
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
  // 4. Mobile Menu Toggle & Scroll Effect
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const hamburgerSpans = menuToggle.querySelectorAll('span:not(.uppercase)'); 
  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
      mobileMenu.classList.remove('translate-x-full');
      hamburgerSpans[0].style.transform = 'translateY(3px) rotate(45deg)';
      hamburgerSpans[1].style.transform = 'translateY(-3px) rotate(-45deg)';
      document.body.style.overflow = 'hidden';
      menuToggle.classList.add('bg-white', 'text-black');
      menuToggle.classList.remove('bg-black', 'text-white');
      hamburgerSpans.forEach(s => s.classList.replace('bg-white', 'bg-black'));
    } else {
      mobileMenu.classList.add('translate-x-full');
      hamburgerSpans[0].style.transform = 'translateY(0) rotate(0)';
      hamburgerSpans[1].style.transform = 'translateY(0) rotate(0)';
      document.body.style.overflow = 'auto';
      
      // Only reset to black if we are scrolled down
      if (window.scrollY > 50) {
        menuToggle.classList.add('bg-black', 'text-white');
        menuToggle.classList.remove('bg-white', 'text-black');
        hamburgerSpans.forEach(s => s.classList.replace('bg-black', 'bg-white'));
      } else {
        menuToggle.classList.add('bg-transparent', 'text-black');
        menuToggle.classList.remove('bg-white', 'bg-black', 'text-white');
        hamburgerSpans.forEach(s => s.classList.replace('bg-white', 'bg-black'));
      }
    }
  };

  menuToggle.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu();
    });
  });

  // Scroll effect for menu toggle
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 150) {
      // Make it fixed/floating (Centered)
      menuToggle.parentElement.classList.add('fixed', 'top-8', 'left-1/2', '-translate-x-1/2', 'z-[110]');
      menuToggle.parentElement.classList.remove('md:hidden'); 
      menuToggle.classList.add('bg-black', 'text-white', 'shadow-2xl');
      menuToggle.classList.remove('bg-transparent', 'text-black');
      hamburgerSpans.forEach(s => s.classList.replace('bg-black', 'bg-white'));
      menuToggle.style.transform = 'scale(0.9)';
    } else {
      // Back in header
      menuToggle.parentElement.classList.remove('fixed', 'top-8', 'left-1/2', '-translate-x-1/2', 'z-[110]');
      menuToggle.classList.remove('bg-black', 'text-white', 'shadow-2xl');
      menuToggle.classList.add('bg-transparent', 'text-black');
      hamburgerSpans.forEach(s => s.classList.replace('bg-white', 'bg-black'));
      menuToggle.style.transform = 'scale(1)';
    }

    // Hide on scroll down, show on scroll up (only when floating)
    if (scrollY > 500 && !isMenuOpen) {
      if (scrollY > lastScroll) {
        menuToggle.style.transform = 'translateY(-150%)';
      } else {
        menuToggle.style.transform = 'translateY(0) scale(0.9)';
      }
    }
    lastScroll = scrollY;
  }, { passive: true });

  // 5. Booking Modal Functionality
  const bookServiceBtn = document.getElementById('book-service-btn');
  const bookingModal = document.getElementById('booking-modal');
  const closeBookingModal = document.getElementById('close-booking-modal');
  const bookingForm = document.getElementById('booking-form');
  const bookingSuccess = document.getElementById('booking-success');

  if (bookServiceBtn && bookingModal && closeBookingModal) {
    const openModal = (e) => {
      e.preventDefault();
      bookingModal.classList.remove('hidden');
      bookingModal.classList.add('flex');
      // trigger reflow for transitions
      void bookingModal.offsetWidth;
      bookingModal.classList.remove('opacity-0');
      bookingModal.querySelector('.bg-primary').classList.remove('translate-y-8');
      bookingModal.querySelector('.bg-primary').classList.add('translate-y-0');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      bookingModal.classList.add('opacity-0');
      bookingModal.querySelector('.bg-primary').classList.add('translate-y-8');
      bookingModal.querySelector('.bg-primary').classList.remove('translate-y-0');
      
      setTimeout(() => {
        bookingModal.classList.remove('flex');
        bookingModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Reset state after close
        if (bookingForm && bookingSuccess) {
          bookingForm.reset();
          bookingForm.classList.remove('hidden');
          bookingSuccess.classList.add('hidden');
        }
      }, 300);
    };

    bookServiceBtn.addEventListener('click', openModal);
    closeBookingModal.addEventListener('click', closeModal);
    
    // Close on overlay click
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeModal();
      }
    });

    // Handle form submit
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate submit request
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerText = 'SUBMITTING...';
        
        setTimeout(() => {
          bookingForm.classList.add('hidden');
          bookingSuccess.classList.remove('hidden');
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }, 1200);
      });
    }
  }

});
