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

  // 部署到官网后：把下面改成你上传安装包后的公网下载地址（见项目根目录 DEPLOY.md）
  // 例如：'https://你的域名/download/Pomor-Timer-Setup-1.0.0.exe'
  const DOWNLOAD_URL = '';

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
})();

