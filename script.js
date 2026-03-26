

document.addEventListener('DOMContentLoaded', () => {

  /* ─── CUSTOM CURSOR ─── */
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  let mouseX = 0, mouseY = 0;
  let trailX  = 0, trailY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animTrail() {
    trailX += (mouseX - trailX) * 0.13;
    trailY += (mouseY - trailY) * 0.13;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();

  // Cursor grow on hover
  const hoverTargets = 'a, button, .tab, .proj-card, .acard, .connect-card, .skill-card, .ach-item, input, textarea';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('big');
      cursorTrail.classList.add('big');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('big');
      cursorTrail.classList.remove('big');
    });
  });


  /* ─── NAVBAR ─── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });


  /* ─── HAMBURGER / MOBILE MENU ─── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const isOpen = mobileMenu.classList.contains('open');
    hamburger.querySelectorAll('span')[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    hamburger.querySelectorAll('span')[1].style.opacity  = isOpen ? '0' : '1';
    hamburger.querySelectorAll('span')[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mm-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
      document.body.style.overflow = '';
    });
  });


  /* ─── SMOOTH SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ─── TYPEWRITER EFFECT ─── */
  const phrases = [
    'Web Apps ⚡',
    'Open Source 🌍',
    'Cool Stuff 🚀',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const typeEl = document.getElementById('typewriter');

  function type() {
    if (!typeEl) return;
    const current = phrases[phraseIdx];

    if (!deleting) {
      typeEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      typeEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 55 : 95);
  }
  setTimeout(type, 800);


  /* ─── INTERSECTION OBSERVER (reveal + bars) ─── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));


  /* ─── STATS COUNTER ─── */
  let statsCounted = false;
  const statsSection = document.getElementById('stats');

  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !statsCounted) {
      statsCounted = true;
      document.querySelectorAll('.stat-val').forEach(el => {
        const target = parseInt(el.dataset.target);
        let count = 0;
        const step = Math.ceil(target / 50);
        const tick = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = count + (target >= 100 ? '+' : target >= 10 ? '+' : '+');
          if (count >= target) clearInterval(tick);
        }, 28);
      });
    }
  }, { threshold: 0.5 });

  if (statsSection) statsObserver.observe(statsSection);


  /* ─── PROJECT FILTER TABS ─── */
  const tabs   = document.querySelectorAll('.tab');
  const cards  = document.querySelectorAll('.proj-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.cat;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          // Re-animate
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity .4s ease, transform .4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.classList.add('hidden');
        }
      });

      // Handle featured card column span
      const featuredCard = document.querySelector('.proj-card.featured');
      if (featuredCard) {
        const visible = [...cards].filter(c => !c.classList.contains('hidden'));
        featuredCard.style.gridColumn = visible.length > 1 ? 'span 2' : 'span 1';
      }
    });
  });


  /* ─── CONTACT FORM SUBMISSION (Formspree) ─── */
  const contactForm = document.getElementById('contactForm');
  const sendBtn     = document.getElementById('sendBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Update button state
      const originalBtnText = sendBtn.innerHTML;
      sendBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
      sendBtn.disabled = true;

      const formData = new FormData(contactForm);
      
      try {
        // NOTE: User should replace 'mishravishal1921@gmail.com' with their Formspree ID if they want a custom endpoint, 
        // but Formspree also allows direct email submission for testing (it will ask to verify).
        // However, a real Formspree ID is better: https://formspree.io/f/your_id
        // For now, I'll use a placeholder or advise the user.
        // Let's use a generic fetch that the user can point to their ID.
        const response = await fetch('https://formspree.io/f/xvgzlowz', { // Placeholder ID - user should replace this
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          sendBtn.innerHTML = '<i class="bx bx-check"></i> Message Sent!';
          sendBtn.style.background = 'linear-gradient(135deg, #38d9a9, #20c997)';
          contactForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        sendBtn.innerHTML = '<i class="bx bx-error"></i> Error. Try Again.';
        sendBtn.style.background = '#ff4d4d';
        console.error('Submission error:', error);
      } finally {
        setTimeout(() => {
          sendBtn.innerHTML = originalBtnText;
          sendBtn.style.background = '';
          sendBtn.disabled = false;
        }, 3000);
      }
    });
  }


  /* ─── ACTIVE NAV LINK ON SCROLL ─── */
  const sections = document.querySelectorAll('section[id], div[id="stats"]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--accent)';
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => navObserver.observe(s));

  /* ─── SCROLL TO TOP BUTTON ─── */
  const topBtn = document.getElementById('topBtn');
  window.addEventListener('scroll', () => {
    if (!topBtn) return;
    if (window.scrollY > 520) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  }, { passive: true });

  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ─── CARD TILT EFFECT (subtle 3D) ─── */
  document.querySelectorAll('.proj-card, .acard, .connect-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-8px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s ease, border-color .3s, box-shadow .3s';
    });
  });


  /* ─── PAGE LOAD — initial hash scroll ─── */
  if (window.location.hash) {
    setTimeout(() => {
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 400);
  }

});
