(() => {
  'use strict';

  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('.primary-nav');

  const savedTheme = localStorage.getItem('still-moving-theme');
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
  setTheme(initialTheme);

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('still-moving-theme', theme);
    themeButton?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0c1714' : '#f4f8f6');
  }

  themeButton?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  menuButton?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 10), { passive: true });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

  // Expandable learning modules
  document.querySelectorAll('.module-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.module-card');
      const panel = card.querySelector('.module-panel');
      const willOpen = !card.classList.contains('active');

      document.querySelectorAll('.module-card').forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.classList.remove('active');
          otherCard.querySelector('.module-toggle')?.setAttribute('aria-expanded', 'false');
          const otherPanel = otherCard.querySelector('.module-panel');
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      card.classList.toggle('active', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
      panel.hidden = !willOpen;
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item button').forEach(button => {
    button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      answer.hidden = expanded;
    });
  });

  // Video/media placeholder modal
  const mediaModal = document.getElementById('media-modal');
  const modalTitle = document.getElementById('modal-title');
  let previouslyFocused = null;

  function openModal(title) {
    previouslyFocused = document.activeElement;
    modalTitle.textContent = title || 'Teaching video';
    mediaModal.hidden = false;
    document.body.classList.add('modal-open');
    mediaModal.querySelector('.modal-close')?.focus();
  }

  function closeModal() {
    mediaModal.hidden = true;
    document.body.classList.remove('modal-open');
    previouslyFocused?.focus();
  }

  document.querySelectorAll('[data-title], .play-button').forEach(button => {
    button.addEventListener('click', event => {
      const title = button.dataset.title || button.closest('[data-video-title]')?.dataset.videoTitle || 'Program video';
      openModal(title);
    });
  });
  mediaModal?.querySelectorAll('[data-close-modal]').forEach(item => item.addEventListener('click', closeModal));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mediaModal && !mediaModal.hidden) closeModal();
  });

  // Simulated audio player. Replace with real <audio> sources when files are available.
  const audioPlayer = document.getElementById('audio-player');
  const audioTitle = document.getElementById('audio-title');
  const audioPlay = document.getElementById('audio-play');
  const audioTime = document.getElementById('audio-time');
  const audioProgress = document.getElementById('audio-track-progress');
  const audioNames = {
    'body-scan': 'Full body sensory meditation',
    'breath-control': 'Gentle coherent breathing',
    'motor-imagery': 'Imagining easeful movement',
    'attention': 'Focused attention meditation',
    'walking': 'Walking with awareness'
  };
  let audioPlaying = false;
  let audioSeconds = 0;
  let audioInterval = null;
  const demoAudioLength = 180;

  function updateAudioUI() {
    const minutes = Math.floor(audioSeconds / 60).toString().padStart(2, '0');
    const seconds = (audioSeconds % 60).toString().padStart(2, '0');
    audioTime.textContent = `${minutes}:${seconds}`;
    audioProgress.style.width = `${Math.min(100, (audioSeconds / demoAudioLength) * 100)}%`;
  }

  function stopAudioTimer() {
    clearInterval(audioInterval);
    audioInterval = null;
  }

  document.querySelectorAll('.audio-resource').forEach(button => {
    button.addEventListener('click', () => {
      stopAudioTimer();
      audioPlaying = false;
      audioSeconds = 0;
      updateAudioUI();
      audioTitle.textContent = audioNames[button.dataset.audio] || 'Guided meditation';
      audioPlay.textContent = '▶';
      audioPlayer.hidden = false;
    });
  });

  audioPlay?.addEventListener('click', () => {
    audioPlaying = !audioPlaying;
    audioPlay.textContent = audioPlaying ? '❚❚' : '▶';
    audioPlay.setAttribute('aria-label', audioPlaying ? 'Pause audio' : 'Play audio');
    if (audioPlaying) {
      audioInterval = setInterval(() => {
        audioSeconds += 1;
        if (audioSeconds >= demoAudioLength) {
          audioSeconds = 0;
          audioPlaying = false;
          audioPlay.textContent = '▶';
          stopAudioTimer();
        }
        updateAudioUI();
      }, 1000);
    } else {
      stopAudioTimer();
    }
  });

  document.querySelector('.audio-close')?.addEventListener('click', () => {
    stopAudioTimer();
    audioPlaying = false;
    audioPlayer.hidden = true;
  });

  // Breath pacer
  const patternSelect = document.getElementById('pacer-pattern');
  const lengthSelect = document.getElementById('session-length');
  const pacerRings = document.getElementById('pacer-rings');
  const pacerInstruction = document.getElementById('pacer-instruction');
  const pacerCount = document.getElementById('pacer-count');
  const pacerSubtext = document.getElementById('pacer-subtext');
  const pacerTimer = document.getElementById('pacer-timer');
  const pacerProgressBar = document.getElementById('pacer-progress-bar');
  const startPacerButton = document.getElementById('start-pacer');
  const resetPacerButton = document.getElementById('reset-pacer');
  const soundCues = document.getElementById('sound-cues');

  let pacerRunning = false;
  let pacerPaused = false;
  let pacerInterval = null;
  let sessionElapsed = 0;
  let currentPhase = 'inhale';
  let phaseCount = 1;
  let phaseDuration = 0;
  let audioContext = null;

  function getSessionLength() { return Number(lengthSelect.value); }
  function getPattern() {
    const [inhale, exhale] = patternSelect.value.split(',').map(Number);
    return { inhale, exhale };
  }
  function formatTime(seconds) {
    return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.max(0, seconds % 60).toString().padStart(2, '0')}`;
  }
  function updatePacerTimer() {
    const total = getSessionLength();
    const remaining = Math.max(0, total - sessionElapsed);
    pacerTimer.textContent = formatTime(remaining);
    pacerProgressBar.style.width = `${Math.min(100, (sessionElapsed / total) * 100)}%`;
  }
  function playCue(frequency = 440) {
    if (!soundCues.checked) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.35);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.36);
    } catch (_) { /* Sound is optional. */ }
  }
  function setPhase(phase) {
    const pattern = getPattern();
    currentPhase = phase;
    phaseDuration = pattern[phase];
    phaseCount = 1;
    pacerInstruction.textContent = phase === 'inhale' ? 'Breathe in' : 'Breathe out';
    pacerSubtext.textContent = phase === 'inhale' ? 'Gently expand' : 'Slowly soften';
    pacerRings.classList.remove('active-inhale', 'active-exhale');
    void pacerRings.offsetWidth;
    pacerRings.style.setProperty('--inhale-duration', `${pattern.inhale}s`);
    pacerRings.style.setProperty('--exhale-duration', `${pattern.exhale}s`);
    pacerRings.classList.add(phase === 'inhale' ? 'active-inhale' : 'active-exhale');
    pacerCount.textContent = phaseCount;
    playCue(phase === 'inhale' ? 420 : 330);
  }
  function tickPacer() {
    sessionElapsed += 1;
    if (phaseCount >= phaseDuration) {
      // Full phase has been shown (1..phaseDuration) — switch to the other phase, count restarts at 1.
      setPhase(currentPhase === 'inhale' ? 'exhale' : 'inhale');
    } else {
      phaseCount += 1;
      pacerCount.textContent = phaseCount;
    }
    updatePacerTimer();
    if (sessionElapsed >= getSessionLength()) finishPacer();
  }
  function finishPacer() {
    clearInterval(pacerInterval);
    pacerRunning = false;
    pacerPaused = false;
    pacerRings.classList.remove('active-inhale', 'active-exhale');
    pacerInstruction.textContent = 'Complete';
    pacerCount.textContent = '✓';
    pacerSubtext.textContent = 'Return to your natural breath';
    startPacerButton.innerHTML = '<span>▶</span> Start again';
    updatePacerTimer();
    playCue(520);
  }
  function resetPacer() {
    clearInterval(pacerInterval);
    pacerRunning = false;
    pacerPaused = false;
    sessionElapsed = 0;
    pacerRings.classList.remove('active-inhale', 'active-exhale');
    pacerInstruction.textContent = 'Ready';
    pacerCount.textContent = '—';
    pacerSubtext.textContent = 'Find a comfortable position';
    startPacerButton.innerHTML = '<span>▶</span> Start practice';
    updatePacerTimer();
  }
  function beginPacer() {
    if (!pacerRunning) {
      if (sessionElapsed >= getSessionLength()) sessionElapsed = 0;
      pacerRunning = true;
      pacerPaused = false;
      startPacerButton.innerHTML = '<span>❚❚</span> Pause';
      setPhase('inhale');
      pacerInterval = setInterval(tickPacer, 1000);
      return;
    }

    if (!pacerPaused) {
      pacerPaused = true;
      clearInterval(pacerInterval);
      pacerRings.style.animationPlayState = 'paused';
      pacerInstruction.textContent = 'Paused';
      pacerSubtext.textContent = 'Resume when ready';
      startPacerButton.innerHTML = '<span>▶</span> Resume';
    } else {
      pacerPaused = false;
      pacerRings.style.animationPlayState = 'running';
      startPacerButton.innerHTML = '<span>❚❚</span> Pause';
      // Resume where we left off — don't reset the phase/count, just continue the single clock.
      pacerInterval = setInterval(tickPacer, 1000);
    }
  }

  startPacerButton?.addEventListener('click', beginPacer);
  resetPacerButton?.addEventListener('click', resetPacer);
  lengthSelect?.addEventListener('change', resetPacer);
  patternSelect?.addEventListener('change', resetPacer);
  updatePacerTimer();

  // Prevent placeholder publication links from jumping to the top.
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', event => event.preventDefault());
  });

  document.getElementById('current-year').textContent = new Date().getFullYear();
})();
