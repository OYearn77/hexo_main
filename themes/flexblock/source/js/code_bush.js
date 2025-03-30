document.addEventListener('DOMContentLoaded', function() {
  // 查找所有代码块
  const codeBlocks = document.querySelectorAll('figure.highlight');
  
  codeBlocks.forEach(function(block, i) {
    // 尝试获取语言信息
    let languageName = "code";
    
    // 方法1: 从class中获取语言
    const classes = block.className.split(' ');
    for (const cls of classes) {
      if (cls.startsWith('language-')) {
        languageName = cls.replace('language-', '');
        break;
      }
    }
    
    // 方法2: 从内部代码元素获取语言
    if (languageName === "code") {
      const codeElement = block.querySelector('code');
      if (codeElement && codeElement.className) {
        const codeClasses = codeElement.className.split(' ');
        for (const cls of codeClasses) {
          if (cls.startsWith('language-')) {
            languageName = cls.replace('language-', '');
            break;
          }
        }
      }
    }
    
    // 方法3: 尝试从figcaption获取语言
    const figcaption = block.querySelector('figcaption');
    if (figcaption && languageName === "code") {
      languageName = figcaption.textContent.trim();
    }
    
    // 方法4: 从代码内容尝试检测语言
    if (languageName === "code") {
      const codeText = block.textContent || '';
      
      // 检测C语言代码
      if (codeText.includes('#include <stdio.h>') || 
          codeText.includes('#include <stdlib.h>') || 
          codeText.includes('int main(') || 
          codeText.includes('void main(') ||
          /volatile\s+(int|float|char|double)/.test(codeText) ||
          /\#define\s+\w+/.test(codeText) ||
          /\#ifndef\s+\w+/.test(codeText) ||
          /\#endif/.test(codeText) ||
          /struct\s+\w+\s*\{/.test(codeText) ||
          /typedef\s+struct/.test(codeText) ||
          (codeText.includes('//') && 
           (codeText.includes('int ') || codeText.includes('void ') || 
            codeText.includes('char ') || codeText.includes('float ') || 
            codeText.includes('double ') || codeText.includes('unsigned ')) &&
           !codeText.includes('class ') && !codeText.includes('import '))) {
        languageName = 'c';
      }
      // 检测MATLAB代码
      else if (/function\s+(\[[\w\s,]+\]\s*=\s*)?[\w\d_]+\(.*\)/.test(codeText) || 
              /^\s*%.*/.test(codeText) ||
              /end(\s*%.*)?$/.test(codeText) ||
              /plot\(.*\)/.test(codeText) ||
              /figure\(.*\)/.test(codeText) ||
              /^\s*for\s+\w+\s*=/.test(codeText) ||
              /disp\(.*\)/.test(codeText) ||
              (codeText.includes('%') && codeText.includes('end') && 
               !codeText.includes(';') && !codeText.includes('//') && 
               !codeText.includes('/*') && !codeText.includes('*/')) ||
              (codeText.includes('[]') && codeText.includes('=') && codeText.includes(':'))){
        languageName = 'matlab';
      }
      // 检测Java代码
      else if (codeText.includes('public class') || 
          codeText.includes('private ') || 
          codeText.includes('protected ') ||
          (codeText.includes('import java.') && codeText.includes(';')) ||
          /\@Override\s+public/.test(codeText)) {
        languageName = 'java';
      }
      // 检测Python代码
      else if (codeText.includes('def ') || 
               codeText.includes('import ') && !codeText.includes(';') ||
               codeText.includes('from ') && codeText.includes(' import ') ||
               codeText.includes('class ') && codeText.includes(':') ||
               /print\s*\(/.test(codeText)) {
        languageName = 'python';
      }
      // 检测JavaScript代码
      else if (codeText.includes('function ') || 
               codeText.includes('const ') || 
               codeText.includes('let ') ||
               codeText.includes('=>') ||
               /document\./.test(codeText) ||
               /console\.log/.test(codeText)) {
        languageName = 'javascript';
      }
      // 检测HTML代码
      else if (codeText.includes('<html') || 
               codeText.includes('<head') ||
               codeText.includes('<meta') ||
               codeText.includes('<title') ||
               codeText.includes('<div') || 
               codeText.includes('<body') ||
               codeText.includes('<script') ||
               codeText.includes('<link') ||
               codeText.includes('<style') ||
               codeText.includes('<input') ||
               codeText.includes('<button') ||
               codeText.includes('<form') ||
               codeText.includes('<img') ||
               codeText.includes('<a href') ||
               codeText.includes('<p>') ||
               codeText.includes('<span') ||
               codeText.includes('<ul>') ||
               codeText.includes('<li>') ||
               codeText.includes('<!DOCTYPE') ||
               (codeText.includes('<') && codeText.includes('</') && codeText.includes('>') && 
                !codeText.includes('cout') && !codeText.includes('cin'))) {
        languageName = 'html';
      }
      // 检测CSS代码
      else if ((codeText.includes('{') && codeText.includes('}') && codeText.includes(':') && 
                !codeText.includes('function') && !codeText.includes('class') && 
                !codeText.includes('if') && !codeText.includes('else')) ||
               codeText.includes('@media') ||
               codeText.includes('@keyframes') ||
               codeText.includes('@import') ||
               codeText.includes('@font-face') ||
               /\.[\w-]+\s*\{/.test(codeText) ||
               /#[\w-]+\s*\{/.test(codeText) ||
               /\[[\w-]+[\^$*|~]?=["']?[^"']*["']?\]/.test(codeText) ||
               /display\s*:\s*(flex|grid|block|inline|none)/.test(codeText) ||
               /position\s*:\s*(relative|absolute|fixed|sticky)/.test(codeText) ||
               /margin(\-(top|right|bottom|left))?\s*:/.test(codeText) ||
               /padding(\-(top|right|bottom|left))?\s*:/.test(codeText) ||
               /color\s*:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^\)]+\)|hsla?\([^\)]+\))/.test(codeText) ||
               /background(\-(color|image|position|size))?\s*:/.test(codeText)) {
        languageName = 'css';
      }
      // 检测SQL代码
      else if (codeText.toUpperCase().includes('SELECT ') || 
               codeText.toUpperCase().includes('FROM ') ||
               codeText.toUpperCase().includes('INSERT INTO') ||
               codeText.toUpperCase().includes('CREATE TABLE')) {
        languageName = 'sql';
      }
    }
    
    // 创建包装容器
    const wrapper = document.createElement('div');
    wrapper.className = 'highlight-wrapper';
    
    // 创建代码头部
    const header = document.createElement('div');
    header.className = 'code-header';
    
    // 添加语言标签
    const language = document.createElement('span');
    language.className = 'code-language';
    language.textContent = languageName;
    header.appendChild(language);
    
    // 添加复制按钮
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.setAttribute('data-clipboard-target', `#code-${i}`);
    copyButton.innerHTML = '<svg class="copy-icon" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg>复制';
    header.appendChild(copyButton);
    
    // 添加内容容器
    const content = document.createElement('div');
    content.className = 'code-content';
    
    // 将原始代码块移动到content中
    content.appendChild(block.cloneNode(true));
    
    // 给代码内容添加ID
    const codeElement = content.querySelector('table') || content.querySelector('pre') || content.querySelector('code');
    if (codeElement) {
      codeElement.id = `code-${i}`;
    }
    
    // 将新元素添加到包装器中
    wrapper.appendChild(header);
    wrapper.appendChild(content);
    
    // 替换原始代码块
    block.parentNode.replaceChild(wrapper, block);
  });
  
  // 初始化复制功能
  if (typeof ClipboardJS !== 'undefined') {
    const clipboard = new ClipboardJS('.copy-button');
    
    clipboard.on('success', function(e) {
      const original = e.trigger.innerHTML;
      // 双对勾图标 SVG + 已复制文本
      const successIcon = '<svg class="success-icon" viewBox="0 0 16 16" fill="#4caf50" style="width: 16px; height: 16px; margin-right: 4px;"><path d="M8.97 4.97a.75.75 0 011.07 1.05l-3.99 4.99a.75.75 0 01-1.08.02L2.324 8.384a.75.75 0 111.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 01.02-.022zm-.92 5.14l.92.92a.75.75 0 001.079-.02l3.992-4.99a.75.75 0 10-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"></path></svg>';
      e.trigger.innerHTML = successIcon + '已复制';
      setTimeout(function() {
        e.trigger.innerHTML = original;
      }, 2000);
      e.clearSelection();
    });
    
    clipboard.on('error', function(e) {
      const original = e.trigger.innerHTML;
      // 错误图标 SVG + 复制失败文本
      const errorIcon = '<svg class="error-icon" viewBox="0 0 16 16" fill="#f44336" style="width: 16px; height: 16px; margin-right: 4px;"><path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14.4c-3.5 0-6.4-2.9-6.4-6.4S4.5 1.6 8 1.6s6.4 2.9 6.4 6.4-2.9 6.4-6.4 6.4zm3.2-8L8 9.6 4.8 6.4 3.6 7.6 6.8 10.8 3.6 14l1.2 1.2L8 12l3.2 3.2 1.2-1.2-3.2-3.2 3.2-3.2-1.2-1.2z"></path></svg>';
      e.trigger.innerHTML = errorIcon + '复制失败';
      setTimeout(function() {
        e.trigger.innerHTML = original;
      }, 2000);
    });
  } else {
    console.error('ClipboardJS 未加载，复制功能将不可用');
  }
});

