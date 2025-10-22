(async () => {
  const base = 'http://localhost:8080';
  const fetch = globalThis.fetch || require('node-fetch');

  try {
    console.log('1) Register aspirante');
    let res = await fetch(base + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: 'TestA',
        ape: 'User',
        corr: 'testaspirante@example.com',
        ubi: 'Ciudad',
        tel: 123456789,
        feNa: '1990-01-01',
        cla: 'pass1234',
        tipDoc_id: 1,
        munici_id: 1,
        genero_id: 1,
        numDoc: '123456'
      })
    });
    console.log('Aspirante register status:', res.status);
    console.log(await res.text());

    console.log('\n2) Create empresa');
    // Use the DTO field names expected by the backend: nom, ubi, desc, numTrab, correoCorp, cat_id, munici_id
    res = await fetch(base + '/api/empresa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: 'Emp Test',
        ubi: 'Ciudad',
        desc: 'desc',
        numTrab: 10,
        correoCorp: 'hr@emp.test',
        cat_id: 1,
        munici_id: 1
      })
    });
    console.log('Empresa status:', res.status);
    let empJson = null;
    try { empJson = await res.json(); } catch(e) { console.log('Empresa response not JSON'); }
    console.log('Empresa response:', empJson);
    const empId = empJson ? (empJson.nitId || empJson.nit_id || empJson.id || empJson.nitId) : null;
    console.log('empresa id:', empId);

    if (empId) {
      console.log('\n3) Create reclutador');
      res = await fetch(base + '/api/reclutadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: 'RecTest',
          clave: 'rcpass',
          corr: 'reclutador@example.com',
          tel: 987654321,
          empresa_id: Number(empId)
        })
      });
      console.log('Reclutador status:', res.status);
      try { console.log('Reclutador response:', await res.json()); } catch(e) { console.log('Reclutador response not JSON'); }
    } else {
      console.log('No se obtuvo empresa id; salteando creación de reclutador que requiere empresa_id');
    }

    console.log('\n4) Login aspirante');
    res = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: 'testaspirante@example.com', clave: 'pass1234' })
    });
    console.log('Aspirante login status:', res.status);
    try { console.log('Aspirante login response:', await res.json()); } catch(e) { console.log(await res.text()); }

    if (empId) {
      console.log('\n5) Login reclutador');
      res = await fetch(base + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: 'reclutador@example.com', clave: 'rcpass' })
      });
      console.log('Reclutador login status:', res.status);
      try { console.log('Reclutador login response:', await res.json()); } catch(e) { console.log(await res.text()); }
    }

  } catch (err) {
    console.error('Script error:', err);
  }
})();
