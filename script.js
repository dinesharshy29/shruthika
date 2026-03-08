/* ══════════════════════
     STATE
  ══════════════════════ */
  let currentScreen = 'screen-0';
  let noClickCount  = 0;

  /* ══════════════════════
     NAVIGATE
  ══════════════════════ */
  function goToScreen(id) {
    if (currentScreen === id) return;
    document.getElementById(currentScreen).classList.remove('active');
    const tgt = document.getElementById(id);
    tgt.classList.add('active','screen-enter');
    currentScreen = id;
    setTimeout(() => tgt.classList.remove('screen-enter'), 600);

    if (id === 'screen-final') launchConfetti();
    if (id === 'screen-msg')   startFloatingHearts();
  }

  /* ══════════════════════
     NO BUTTON RUNS AWAY
  ══════════════════════ */
  function handleNo() {
    noClickCount++;
    const btn = document.getElementById('no-btn');
    const dx  = (Math.random() - 0.5) * 340;
    const dy  = (Math.random() - 0.5) * 200;
    btn.style.transform = `translate(${dx}px,${dy}px)`;

    if (noClickCount >= 3) {
      goToScreen('screen-no');
      noClickCount = 0;
      setTimeout(() => { btn.style.transform = ''; }, 200);
    }
  }

  function resetAndGoBack() {
    noClickCount = 0;
    document.getElementById('no-btn').style.transform = '';
    goToScreen('screen-1');
  }

  /* ══════════════════════
     FLOATING HEARTS
  ══════════════════════ */
  function startFloatingHearts() {
    const c = document.getElementById('floatingHearts');
    c.innerHTML = '';
    ['❤️','💖','💗','💕','🌸','💝','🌷'].forEach(sym => {
      for (let j = 0; j < 2; j++) {
        const h = document.createElement('div');
        h.className = 'heart';
        h.textContent = sym;
        h.style.cssText = `
          left:${Math.random()*96}%;
          font-size:${10+Math.random()*17}px;
          animation-duration:${3+Math.random()*4}s;
          animation-delay:${Math.random()*5}s;
        `;
        c.appendChild(h);
      }
    });
  }

  /* ══════════════════════
     CONFETTI
  ══════════════════════ */
  const s = document.createElement('style');
  s.textContent = `@keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}`;
  document.head.appendChild(s);

  function launchConfetti() {
    const c = document.getElementById('confettiContainer');
    const cols = ['#ff6b9d','#ffd700','#87ceeb','#98fb98','#dda0dd','#f0e68c','#ff8c94','#b0e0e6'];
    for (let i = 0; i < 90; i++) {
      setTimeout(() => {
        const p = document.createElement('div');
        const sz = 5 + Math.random() * 9;
        p.style.cssText = `
          position:absolute;
          width:${sz}px;height:${sz}px;
          background:${cols[Math.floor(Math.random()*cols.length)]};
          border-radius:${Math.random()>.45?'50%':'3px'};
          left:${Math.random()*100}%;top:-12px;
          animation:confettiFall ${1.2+Math.random()*2.5}s linear forwards;
        `;
        c.appendChild(p);
        setTimeout(() => p.remove(), 4000);
      }, i * 45);
    }
  }

  /* ══════════════════════
     BOOT
  ══════════════════════ */
  startFloatingHearts();
  setTimeout(() => goToScreen('screen-1'), 2500);