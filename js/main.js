document.addEventListener('DOMContentLoaded', () => {
  // ========== 暗/亮色主题切换 ==========
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const htmlEl = document.documentElement;
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // ========== 语言切换下拉菜单（收起/展开） ==========
  const langToggle = document.getElementById('lang-toggle');
  const langDropdown = document.getElementById('lang-dropdown');

  if (langToggle && langDropdown) {
    // 点击按钮：切换展开/收起
    langToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      var isOpen = langDropdown.classList.contains('open');
      if (isOpen) {
        langDropdown.classList.remove('open');
      } else {
        langDropdown.classList.add('open');
      }
    });

    // 点击下拉菜单内部不收起
    langDropdown.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    // 点击页面任意其他位置收起
    document.addEventListener('click', function() {
      langDropdown.classList.remove('open');
    });
  }

  // ========== 语言切换逻辑 ==========
  function getCurrentLang() {
    // 从 URL 路径检测语言前缀
    var path = window.location.pathname;
    var match = path.match(/^\/(zh-CN|en|ru)(\/|$)/);
    if (match) return match[1];
    // fallback: localStorage
    var saved = localStorage.getItem('lang');
    if (saved) return saved;
    return 'zh-CN';
  }

  var currentLang = getCurrentLang();

  // 标记当前语言为 active
  var langLinks = document.querySelectorAll('.lang-dropdown li a');
  for (var i = 0; i < langLinks.length; i++) {
    if (langLinks[i].getAttribute('data-lang') === currentLang) {
      langLinks[i].classList.add('active');
    }

    // 绑定点击事件
    langLinks[i].addEventListener('click', function() {
      var targetLang = this.getAttribute('data-lang');
      if (targetLang === currentLang) {
        // 同语言，仅收起菜单
        if (langDropdown) langDropdown.classList.remove('open');
        return;
      }

      // 保存语言偏好
      localStorage.setItem('lang', targetLang);

      // 构造新 URL
      var currentPath = window.location.pathname;
      var regex = /^\/(zh-CN|en|ru)(\/|$)/;
      var newPath;
      if (regex.test(currentPath)) {
        newPath = currentPath.replace(regex, '/' + targetLang + '$2');
      } else {
        newPath = '/' + targetLang + currentPath;
      }

      window.location.href = newPath + window.location.search;
    });
  }
});
