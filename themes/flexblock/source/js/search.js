(function() {
  // 获取URL中的搜索关键词
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
    return '';
  }

  // 加载搜索索引
  function loadIndex(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/content.json', true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var searchData = JSON.parse(xhr.responseText);
        callback(searchData);
      }
    };
    xhr.send();
  }

  // 搜索函数
  function search(keyword, data) {
    if (!keyword) return [];
    
    keyword = keyword.trim().toLowerCase();
    var results = [];
    var posts = data.posts;

    posts.forEach(function(post) {
      // 搜索标题
      if (post.title && post.title.toLowerCase().indexOf(keyword) > -1) {
        results.push(post);
        return;
      }
      
      // 搜索标签
      if (post.tags && post.tags.length > 0) {
        for (var i = 0; i < post.tags.length; i++) {
          if (post.tags[i].name.toLowerCase().indexOf(keyword) > -1) {
            results.push(post);
            return;
          }
        }
      }
      
      // 搜索分类
      if (post.categories && post.categories.length > 0) {
        for (var i = 0; i < post.categories.length; i++) {
          if (post.categories[i].name.toLowerCase().indexOf(keyword) > -1) {
            results.push(post);
            return;
          }
        }
      }
      
      // 搜索内容中的标题（h1-h6）
      if (post.content && post.content.indexOf('#') > -1) {
        var contentLower = post.content.toLowerCase();
        var headings = contentLower.match(/#+\s+(.*)/g);
        if (headings) {
          for (var i = 0; i < headings.length; i++) {
            if (headings[i].toLowerCase().indexOf(keyword) > -1) {
              results.push(post);
              return;
            }
          }
        }
      }
    });
    
    return results;
  }

  // 显示搜索结果
  function displayResults(results, keyword) {
    var searchResultContainer = document.getElementById('search-result');
    var noResultContainer = document.getElementById('no-result');
    var searchKeywordContainer = document.getElementById('search-keyword');
    var searchCountContainer = document.getElementById('search-count');
    
    // 显示搜索关键词
    searchKeywordContainer.textContent = keyword;
    
    // 显示搜索结果数量
    searchCountContainer.textContent = '(' + results.length + ' 条结果)';
    
    // 如果没有结果，显示无结果提示
    if (results.length === 0) {
      searchResultContainer.style.display = 'none';
      noResultContainer.style.display = 'block';
      return;
    }
    
    // 显示搜索结果
    searchResultContainer.style.display = 'block';
    noResultContainer.style.display = 'none';
    
    var html = '';
    results.forEach(function(post) {
      html += '<div class="article-item layout-padding">';
      html += '<article class="card-container article-card content-padding--large soft-size--large soft-style--box">';
      
      // 封面图
      if (post.cover) {
        html += '<div class="card-cover" style="background-image: url(' + post.cover + ')"></div>';
      }
      
      // 文章信息区域
      html += '<div class="card-text">';
      
      // 标题
      if (post.link) {
        html += '<a href="' + post.link + '" itemprop="url" target="_blank">';
        html += '<h2 class="card-text--title">' + post.title + '</h2>';
        html += '</a>';
      } else {
        html += '<a href="/' + post.path + '" itemprop="url">';
        html += '<h2 class="card-text--title">' + post.title + '</h2>';
        html += '</a>';
      }
      
      // 发布日期
      html += '<div class="card-text--row">';
      html += '<span>发布于</span>';
      html += '<time>' + new Date(post.date).toLocaleDateString() + '</time>';
      html += '</div>';
      
      // 分类
      if (post.categories && post.categories.length > 0) {
        html += '<ul class="wrap-list ' + (post.cover ? 'dark' : 'light') + '">';
        post.categories.forEach(function(category) {
          html += '<li><a href="/categories/' + category.slug + '/">📒 ' + category.name + '</a></li>';
        });
        html += '</ul>';
      }
      
      // 标签
      if (post.tags && post.tags.length > 0) {
        html += '<ul class="wrap-list ' + (post.cover ? 'dark' : 'light') + '">';
        post.tags.forEach(function(tag) {
          html += '<li><a href="/tags/' + tag.slug + '/">🏷️ ' + tag.name + '</a></li>';
        });
        html += '</ul>';
      }
      
      html += '</div>'; // 关闭 card-text
      html += '</article>'; // 关闭 article
      html += '</div>'; // 关闭 article-item
    });
    
    searchResultContainer.innerHTML = html;
  }

  // 主函数
  function init() {
    var keyword = getQueryVariable('q');
    if (!keyword) {
      return;
    }
    
    document.title = '搜索：' + keyword + ' - ' + document.title;
    
    loadIndex(function(data) {
      var results = search(keyword, data);
      displayResults(results, keyword);
    });
  }

  // 页面加载完成后执行
  document.addEventListener('DOMContentLoaded', init);
})(); 