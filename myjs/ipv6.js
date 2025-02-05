// Hexo 专用 IPv6 智能跳转
document.addEventListener('DOMContentLoaded', function() {
  const ipv6LinkHandler = function(e) {
    e.preventDefault();
    
    // 配置参数（与主题设置一致）
    const config = {
      defaultUrl: 'https://alist.4330413.xyz:4330', // IPv4 地址
      ipv6Url: 'https://ipv6.0564.eu.org:4330',     // IPv6 地址
      testEndpoint: 'https://ipv6-only.4330413.xyz/test.jpg' // 自建检测点
    };

    // 检测逻辑
    const img = new Image();
    img.src = config.testEndpoint + '?t=' + Date.now(); // 防止缓存
    
    img.onload = () => window.location.href = config.ipv6Url; // IPv6 可用
    img.onerror = () => window.location.href = config.defaultUrl; // 回退 IPv4
    
    // 超时保险（3秒）
    setTimeout(() => {
      if (!img.complete) window.location.href = config.defaultUrl;
    }, 3000);
  };

  // 绑定所有带 #ipv6-check 的链接
  document.querySelectorAll('a[href="#ipv6-check"]').forEach(link => {
    link.addEventListener('click', ipv6LinkHandler);
  });
});
