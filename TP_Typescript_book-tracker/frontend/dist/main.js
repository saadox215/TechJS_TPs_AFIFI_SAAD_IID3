(async function(){
  const api = 'http://localhost:4000/api/books';

  function el(tag, props = {}, ...children){
    const e = document.createElement(tag);
    Object.entries(props).forEach(([k,v]) => { if(k==='class') e.className=v; else e.setAttribute(k,v); });
    children.forEach(c => { if(typeof c === 'string') e.appendChild(document.createTextNode(c)); else e.appendChild(c); });
    return e;
  }

  async function fetchBooks(){
    const r = await fetch(api);
    return r.ok ? await r.json() : [];
  }

  async function render(){
    const books = await fetchBooks();
    const list = document.getElementById('booksList');
    list.innerHTML = '';
    let totalRead = 0, finished = 0;
    books.forEach(b => {
      const percent = b.pages ? Math.round((b.pagesRead||0)/b.pages*100) : 0;
      totalRead += (b.pagesRead||0);
      if(b.finished) finished++;
      const card = el('div', { class: 'bg-white rounded-xl shadow-md p-4' },
        el('h3', { class: 'font-semibold' }, b.title || '—'),
        el('p', {}, 'Auteur: ' + (b.author||'-')),
        el('p', {}, 'Progression: ' + percent + '%'),
        el('p', {}, 'Pages: ' + (b.pages||0) + ' — Lu: ' + (b.pagesRead||0)),
      );
      // actions
      const inc = el('button', { class: 'px-2 py-1 bg-green-500 text-white rounded mt-2' }, '+1 page');
      inc.onclick = async () => {
        await fetch(api + '/' + b._id, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ pagesRead: Math.min((b.pagesRead||0)+1,b.pages) })});
        render();
      };
      const del = el('button', { class: 'px-2 py-1 bg-red-500 text-white rounded mt-2 ml-2' }, 'Suppr');
      del.onclick = async () => { if(confirm('Supprimer?')){ await fetch(api + '/' + b._id, { method:'DELETE' }); render(); } };
      card.appendChild(inc); card.appendChild(del);
      list.appendChild(card);
    });
    document.getElementById('statTotal').textContent = String(books.length);
    document.getElementById('statPages').textContent = String(totalRead);
    document.getElementById('statFinished').textContent = String(finished);
  }

  document.getElementById('bookForm').onsubmit = async (ev) => {
    ev.preventDefault();
    const fd = new FormData(ev.target);
    const data = {
      title: fd.get('title'),
      author: fd.get('author'),
      pages: Number(fd.get('pages')),
      pagesRead: Number(fd.get('pagesRead') || 0),
      status: fd.get('status'),
      price: Number(fd.get('price') || 0),
      format: fd.get('format'),
      suggestedBy: fd.get('suggestedBy')
    };
    await fetch(api, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
    ev.target.reset();
    render();
  };

  await render();
})();
