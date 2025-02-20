document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');

  document.body.addEventListener('click', async (event) => {

    const link = event.target.closest('.nav-link');
    if (link) {
      event.preventDefault();

      const url = link.getAttribute('href');
      try {
        const response = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
        if (response.ok) {
          const html = await response.text();

          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const newContent = doc.querySelector('main#content').innerHTML;
          const newTitle = doc.querySelector('title').innerText; 

          content.innerHTML = newContent; 
          document.title = newTitle; 
          window.history.pushState({}, newTitle, url);
        } else {
          console.error('Failed to fetch the page:', response.statusText);
        }
      } catch (error) {
        console.error('Error during navigation:', error);
      }
    }
  });

  window.addEventListener('popstate', async () => {
    const url = window.location.pathname;
    try {
      const response = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      if (response.ok) {
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('main#content').innerHTML;
        const newTitle = doc.querySelector('title').innerText;

        content.innerHTML = newContent;
        document.title = newTitle; 
      } else {
        console.error('Failed to fetch the page during popstate:', response.statusText);
      }
    } catch (error) {
      console.error('Error during popstate navigation:', error);
    }
  });
});
