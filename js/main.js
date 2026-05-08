document.addEventListener('DOMContentLoaded', () => {
  // ========== 暗/亮色主题切换 ==========
  const toggleBtn = document.getElementById('theme-toggle');
  
  toggleBtn.addEventListener('click', () => {
    const htmlEl = document.documentElement;
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // ========== 语言切换下拉菜单（收起/展开） ==========
  const langToggle = document.getElementById('lang-toggle');
  const langDropdown = document.getElementById('lang-dropdown');

  if (langToggle && langDropdown) {
    // 点击按钮切换下拉菜单展开/收起
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('open');
    });

    // 点击页面其他地方收起下拉菜单
    document.addEventListener('click', () => {
      langDropdown.classList.remove('open');
    });

    langDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // ========== 语言切换逻辑 ==========
  const getCurrentLang = () => {
    const pathMatch = window.location.pathname.match(/^\/(zh-CN|en|ru)\//);
    if (pathMatch) return pathMatch[1];
    const saved = localStorage.getItem('lang');
    if (saved) return saved;
    return 'zh-CN'; // 默认中文
  };

  const currentLang = getCurrentLang();

  // 标记当前语言为 active
  const langLinks = document.querySelectorAll('.lang-dropdown li a');
  langLinks.forEach(link => {
    if (link.getAttribute('data-lang') === currentLang) {
      link.classList.add('active');
    }
  });

  // 点击语言选项时切换
  langLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetLang = link.getAttribute('data-lang');
      if (targetLang === currentLang) {
        langDropdown.classList.remove('open');
        return;
      }

      // 保存语言偏好
      localStorage.setItem('lang', targetLang);

      // 构造新 URL：将当前路径中的语言前缀替换
      const currentPath = window.location.pathname;
      let newPath;
      const langPrefixRegex = /^\/(zh-CN|en|ru)(\/|$)/;
      if (langPrefixRegex.test(currentPath)) {
        // 已有语言前缀 → 替换
        newPath = currentPath.replace(langPrefixRegex, '/' + targetLang + '$2');
      } else {
        // 无语言前缀（根路径）→ 添加前缀
        newPath = '/' + targetLang + currentPath;
      }

      window.location.href = newPath + window.location.search;
    });
  });
});
