(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // 主标题逐字渐显（等 DOM 就绪后再执行，避免动画/渐变不出现）
  const heroTitle = document.querySelector('.hero-title');
  const buildCharSpans = (text, startIndex, stepSeconds, extraClass = '') => {
    const frag = document.createDocumentFragment();
    let idx = startIndex;
    for (const ch of text) {
      if (ch === '\n') continue;
      if (ch === ' ') {
        const s = document.createElement('span');
        s.className = 'reveal-char reveal-space';
        s.style.animationDelay = `${(idx * stepSeconds).toFixed(3)}s`;
        s.textContent = '\u00A0';
        frag.appendChild(s);
        idx += 1;
        continue;
      }

      const span = document.createElement('span');
      span.className = `reveal-char${extraClass ? ' ' + extraClass : ''}`;
      span.style.animationDelay = `${(idx * stepSeconds).toFixed(3)}s`;
      span.textContent = ch;
      frag.appendChild(span);
      idx += 1;
    }
    return { frag, nextIndex: idx };
  };

  const applyHeroTitleReveal = () => {
    if (!heroTitle) return;

    const gradEl = heroTitle.querySelector('.grad');
    if (!gradEl) return;

    const plainText = (heroTitle.childNodes[0]?.textContent || '').trimEnd();
    const gradText = gradEl.textContent || '';

    // 清空并重建：普通部分（打字机逐字）+ 空格 + 渐变整句（一句出现，渐变流动）
    heroTitle.textContent = '';

    const step = 0.08; // 打字机速度：每个字间隔（秒）
    let index = 0;

    const plain = buildCharSpans(plainText, index, step);
    heroTitle.appendChild(plain.frag);
    index = plain.nextIndex;

    const gap = buildCharSpans(' ', index, step);
    heroTitle.appendChild(gap.frag);
    index = gap.nextIndex;

    // “流动的节奏”逐字不同颜色，不统一渐变
    const charColors = ['#f4a574', '#f0a890', '#f0a0b8', '#d8a8e0', '#b8a0e8'];
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'grad-svg reveal-char');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.animationDelay = `${(index * step).toFixed(3)}s`;
    svg.setAttribute('viewBox', '0 0 520 72');
    svg.setAttribute('preserveAspectRatio', 'xMinYMid meet');
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('y', '58');
    text.setAttribute('font-size', '72');
    text.setAttribute('font-weight', '900');
    text.setAttribute('font-family', 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif');
    let x = 0;
    for (let i = 0; i < gradText.length; i++) {
      const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.setAttribute('x', x);
      tspan.setAttribute('fill', charColors[i % charColors.length]);
      tspan.textContent = gradText[i];
      text.appendChild(tspan);
      x += 104;
    }
    svg.appendChild(text);
    heroTitle.appendChild(svg);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHeroTitleReveal);
  } else {
    applyHeroTitleReveal();
  }

  // 安装包下载地址：用 GitHub Releases 上传 exe 后，复制该文件的下载链接填到这里（见 DOWNLOAD-ON-WEBSITE.md）
  // 例如：'https://github.com/wuyanzu03/Pomor/releases/download/v1.0.0/Pomor.Timer.Setup.1.0.0.exe'
  const DOWNLOAD_URL = 'https://github.com/wuyanzu03/Pomor/releases/download/v1.0.0/Pomor.Timer.exe';

  const btn = document.getElementById('btnDownload');
  const meta = document.getElementById('btnMeta');
  const copy = document.getElementById('btnCopy');

  const setReady = (url) => {
    if (!btn || !meta) return;
    btn.href = url;
    btn.removeAttribute('aria-disabled');
    btn.classList.remove('disabled');
    meta.textContent = '（Windows x64）';
  };

  const setNotReady = () => {
    if (!btn || !meta) return;
    btn.href = '#';
    btn.setAttribute('aria-disabled', 'true');
    btn.classList.add('disabled');
    meta.textContent = '（即将上线）';
  };

  if (DOWNLOAD_URL) setReady(DOWNLOAD_URL);
  else setNotReady();

  if (copy) {
    copy.addEventListener('click', async () => {
      const url = DOWNLOAD_URL || location.href;
      try {
        await navigator.clipboard.writeText(url);
        copy.textContent = '已复制';
        setTimeout(() => (copy.textContent = '复制下载链接'), 900);
      } catch {
        // 旧浏览器/权限问题：降级到 prompt
        window.prompt('复制链接：', url);
      }
    });
  }

  if (btn) {
    btn.addEventListener('click', (e) => {
      if (!DOWNLOAD_URL) {
        e.preventDefault();
        window.alert('下载链接还没配置。等你提供公网域名/安装包地址后，我帮你替换。');
      }
    });
  }

  // 彩蛋：点击 Pomor 满 5 次后播放音乐 + 烟花绽放；播放结束后重置计数；音量为一半
  const POMOR_CLICK_THRESHOLD = 5;
  const POMOR_MUSIC_FILENAME = 'assets/Standard%20recording%201.mp3';
  const POMOR_MUSIC_VOLUME = 0.3;
  const FIREWORK_BURST_SPAN_MS = 10000;
  const FIREWORK_COLORS = ['#f97316', '#ec4899', '#a855f7', '#fbbf24', '#22d3ee'];
  let pomorClickCount = 0;
  let pomorMusicPlayed = false;

  function getPomorMusicUrl() {
    const base = location.href.replace(/\/[^/]*$/, '/');
    return base + POMOR_MUSIC_FILENAME;
  }

  function startFireworkEffect() {
    const canvas = document.createElement('canvas');
    canvas.id = 'pomor-firework-canvas';
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const particles = [];
    function makeBurst(x, y) {
      const count = 60 + Math.floor(Math.random() * 40);
      const speed = 4 + Math.random() * 4;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const vx = Math.cos(angle) * speed * (0.6 + Math.random() * 0.8);
        const vy = Math.sin(angle) * speed * (0.6 + Math.random() * 0.8);
        particles.push({
          x,
          y,
          vx,
          vy,
          color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
          life: 1,
          decay: 0.008 + Math.random() * 0.008
        });
      }
    }

    const burstSchedule = [];
    const burstCount = 22;
    for (let i = 0; i < burstCount; i++) {
      burstSchedule.push({
        t: Math.random() * FIREWORK_BURST_SPAN_MS,
        x: w * 0.15 + Math.random() * w * 0.7,
        y: h * 0.2 + Math.random() * h * 0.5
      });
    }
    burstSchedule.sort((a, b) => a.t - b.t);
    const startTime = Date.now();
    let rafId;

    function tick() {
      const elapsed = Date.now() - startTime;
      ctx.fillStyle = 'rgba(6,9,19,0.12)';
      ctx.fillRect(0, 0, w, h);
      while (burstSchedule.length && burstSchedule[0].t <= elapsed) {
        const b = burstSchedule.shift();
        makeBurst(b.x, b.y);
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.08;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (elapsed < FIREWORK_BURST_SPAN_MS || particles.length > 0) {
        rafId = requestAnimationFrame(tick);
      } else {
        canvas.remove();
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  function setupPomorEasterEgg() {
    const els = document.querySelectorAll('.brand, .brand-mini');
    if (!els.length) return;
    els.forEach((el) => {
      el.addEventListener('click', () => {
        pomorClickCount += 1;
        if (pomorClickCount >= POMOR_CLICK_THRESHOLD && !pomorMusicPlayed) {
          pomorMusicPlayed = true;
          startFireworkEffect();
          const audio = new Audio(getPomorMusicUrl());
          audio.volume = POMOR_MUSIC_VOLUME;
          audio.addEventListener('ended', () => {
            pomorClickCount = 0;
            pomorMusicPlayed = false;
          });
          audio.addEventListener('error', () => {
            pomorMusicPlayed = false;
            window.alert('音乐加载失败：请确认 docs/assets/Standard recording 1.mp3 已推送到 GitHub，且文件名正确。');
          });
          audio.play().catch(() => {
            pomorMusicPlayed = false;
            window.alert('音乐未播放：请确认已将 Standard recording 1.mp3 放到 docs/assets/ 并已推送到 GitHub。');
          });
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPomorEasterEgg);
  } else {
    setupPomorEasterEgg();
  }
})();

