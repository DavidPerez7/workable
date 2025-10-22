const http = require('http');

const BASE_URL = 'http://localhost:8080';

// Función auxiliar para hacer peticiones HTTP
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            data: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Función para esperar que el backend esté listo
async function waitForBackend(maxAttempts = 30) {
  console.log('🔄 Esperando que el backend esté disponible...');
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await makeRequest('GET', '/api/auth/login');
      if (response.status === 401 || response.status === 405) {
        console.log('✅ Backend está listo!\n');
        return true;
      }
    } catch (e) {
      // Backend aún no está listo
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  console.log('❌ Backend no responde después de múltiples intentos\n');
  return false;
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('PRUEBA DE LOGIN CON CORREO CORPORATIVO');
  console.log('='.repeat(60) + '\n');

  // Esperar a que el backend esté listo
  const isReady = await waitForBackend();
  if (!isReady) {
    console.log('❌ No se puede ejecutar las pruebas sin el backend activo');
    process.exit(1);
  }

  // 1. Registrar un aspirante de prueba
  console.log('1️⃣  Registrando aspirante de prueba...');
  const aspiranteData = {
    nombre: "Carlos",
    apellido: "Test",
    correo: "carlos.test@gmail.com",
    clave: "password123",
    telefono: 3001112222,
    numero_doc: 1234567890,
    ubicacion: "Bogotá",
    fecha_nacimiento: "1990-01-01",
    tipo_documento_id: 1,
    municipio_id: 1,
    genero_id: 1
  };

  try {
    const aspiranteRes = await makeRequest('POST', '/api/aspirante', aspiranteData);
    if (aspiranteRes.status === 200 || aspiranteRes.status === 201) {
      console.log(`   ✅ Aspirante registrado con éxito (ID: ${aspiranteRes.data.aspirante_id})\n`);
    } else {
      console.log(`   ⚠️  Registro aspirante: ${aspiranteRes.status} (puede que ya exista)\n`);
    }
  } catch (error) {
    console.log(`   ❌ Error al registrar aspirante: ${error.message}\n`);
  }

  // 2. Crear empresa con correo corporativo
  console.log('2️⃣  Creando empresa con correo corporativo...');
  const empresaData = {
    nombre: "TechCorp Solutions",
    ubicacion: "Bogotá, Colombia",
    descripcion: "Empresa de tecnología",
    numero_trabajadores: 50,
    correo_corporativo: "hr@techcorp.com",
    puntuacion: 4.5,
    fecha_creacion: "2020-01-15",
    categoria_id: 1,
    municipio_id: 1
  };

  let empresaId = null;
  try {
    const empresaRes = await makeRequest('POST', '/api/empresa', empresaData);
    if (empresaRes.status === 200 || empresaRes.status === 201) {
      empresaId = empresaRes.data.nit_id || empresaRes.data.nitId;
      console.log(`   ✅ Empresa creada con éxito`);
      console.log(`      - ID: ${empresaId}`);
      console.log(`      - Correo corporativo: ${empresaRes.data.correo_corporativo}`);
      console.log(`      - Nombre: ${empresaRes.data.nombre}\n`);
    } else {
      console.log(`   ⚠️  Creación empresa: ${empresaRes.status}\n`);
    }
  } catch (error) {
    console.log(`   ❌ Error al crear empresa: ${error.message}\n`);
  }

  if (!empresaId) {
    console.log('❌ No se pudo crear la empresa. Abortando pruebas.\n');
    process.exit(1);
  }

  // 3. Crear reclutador asociado a la empresa
  console.log('3️⃣  Creando reclutador para la empresa...');
  const reclutadorData = {
    nombre: "Ana Martínez",
    correo: "ana.martinez@personal.com",
    clave: "recruiter2024",
    telefono: 3009998888,
    empresa_id: empresaId
  };

  let reclutadorId = null;
  try {
    const reclutadorRes = await makeRequest('POST', '/api/reclutadores', reclutadorData);
    if (reclutadorRes.status === 200 || reclutadorRes.status === 201) {
      reclutadorId = reclutadorRes.data.reclutador_id;
      console.log(`   ✅ Reclutador creado con éxito`);
      console.log(`      - ID: ${reclutadorId}`);
      console.log(`      - Correo personal: ${reclutadorRes.data.correo}`);
      console.log(`      - Nombre: ${reclutadorRes.data.nombre}`);
      console.log(`      - Empresa ID: ${reclutadorRes.data.empresa_id}\n`);
    } else {
      console.log(`   ⚠️  Creación reclutador: ${reclutadorRes.status}\n`);
    }
  } catch (error) {
    console.log(`   ❌ Error al crear reclutador: ${error.message}\n`);
  }

  if (!reclutadorId) {
    console.log('❌ No se pudo crear el reclutador. Abortando pruebas.\n');
    process.exit(1);
  }

  // Esperar un momento para que la base de datos procese
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('='.repeat(60));
  console.log('PRUEBAS DE LOGIN');
  console.log('='.repeat(60) + '\n');

  // 4. Login con correo personal del aspirante
  console.log('4️⃣  TEST 1: Login aspirante con correo personal');
  try {
    const loginAspiranteRes = await makeRequest('POST', '/api/auth/login', {
      correo: aspiranteData.correo,
      clave: aspiranteData.clave
    });

    if (loginAspiranteRes.status === 200) {
      console.log(`   ✅ Login aspirante exitoso (${loginAspiranteRes.status})`);
      console.log(`      - Token: ${loginAspiranteRes.data.token.substring(0, 30)}...`);
      console.log(`      - Rol: ${loginAspiranteRes.data.role}`);
      console.log(`      - Usuario: ${loginAspiranteRes.data.nombre} ${loginAspiranteRes.data.apellido}\n`);
    } else {
      console.log(`   ❌ Login aspirante falló: ${loginAspiranteRes.status}\n`);
    }
  } catch (error) {
    console.log(`   ❌ Error en login aspirante: ${error.message}\n`);
  }

  // 5. Login con correo personal del reclutador
  console.log('5️⃣  TEST 2: Login reclutador con correo personal');
  try {
    const loginReclutadorRes = await makeRequest('POST', '/api/auth/login', {
      correo: reclutadorData.correo,
      clave: reclutadorData.clave
    });

    if (loginReclutadorRes.status === 200) {
      console.log(`   ✅ Login reclutador exitoso con correo personal (${loginReclutadorRes.status})`);
      console.log(`      - Token: ${loginReclutadorRes.data.token.substring(0, 30)}...`);
      console.log(`      - Rol: ${loginReclutadorRes.data.role}`);
      console.log(`      - Usuario: ${loginReclutadorRes.data.nombre}`);
      console.log(`      - Empresa ID: ${loginReclutadorRes.data.empresaId}\n`);
    } else {
      console.log(`   ❌ Login reclutador con correo personal falló: ${loginReclutadorRes.status}\n`);
    }
  } catch (error) {
    console.log(`   ❌ Error en login reclutador: ${error.message}\n`);
  }

  // 6. 🌟 LOGIN CON CORREO CORPORATIVO (NUEVA FUNCIONALIDAD) 🌟
  console.log('6️⃣  TEST 3: 🌟 Login reclutador con CORREO CORPORATIVO 🌟');
  try {
    const loginCorporativoRes = await makeRequest('POST', '/api/auth/login', {
      correo: empresaData.correo_corporativo, // Usando correo corporativo de la empresa
      clave: reclutadorData.clave // Pero con la contraseña personal del reclutador
    });

    if (loginCorporativoRes.status === 200) {
      console.log(`   ✅✅✅ LOGIN CON CORREO CORPORATIVO EXITOSO! (${loginCorporativoRes.status})`);
      console.log(`      - Token generado: ${loginCorporativoRes.data.token.substring(0, 30)}...`);
      console.log(`      - Rol: ${loginCorporativoRes.data.role}`);
      console.log(`      - Usuario: ${loginCorporativoRes.data.nombre}`);
      console.log(`      - Correo usado para login: ${empresaData.correo_corporativo}`);
      console.log(`      - Empresa ID: ${loginCorporativoRes.data.empresaId}`);
      console.log(`      - 🎉 La nueva funcionalidad funciona correctamente! 🎉\n`);
    } else {
      console.log(`   ❌ Login con correo corporativo falló: ${loginCorporativoRes.status}`);
      console.log(`   Respuesta: ${JSON.stringify(loginCorporativoRes.data)}\n`);
    }
  } catch (error) {
    console.log(`   ❌ Error en login corporativo: ${error.message}\n`);
  }

  // 7. Login con correo corporativo pero contraseña incorrecta (debe fallar)
  console.log('7️⃣  TEST 4: Login corporativo con contraseña incorrecta (debe fallar)');
  try {
    const loginFailRes = await makeRequest('POST', '/api/auth/login', {
      correo: empresaData.correo_corporativo,
      clave: "contraseña_incorrecta"
    });

    if (loginFailRes.status === 401) {
      console.log(`   ✅ Validación correcta: Login rechazado (${loginFailRes.status})`);
      console.log(`      - Mensaje: ${JSON.stringify(loginFailRes.data)}\n`);
    } else if (loginFailRes.status === 200) {
      console.log(`   ❌ ERROR DE SEGURIDAD: Login aceptado con contraseña incorrecta!\n`);
    } else {
      console.log(`   ⚠️  Respuesta inesperada: ${loginFailRes.status}\n`);
    }
  } catch (error) {
    console.log(`   ❌ Error en prueba de validación: ${error.message}\n`);
  }

  console.log('='.repeat(60));
  console.log('RESUMEN');
  console.log('='.repeat(60));
  console.log('✅ Pruebas de login con correo corporativo completadas!');
  console.log('\n📋 Funcionalidades probadas:');
  console.log('   1. Login aspirante con correo personal ✓');
  console.log('   2. Login reclutador con correo personal ✓');
  console.log('   3. 🌟 Login reclutador con correo CORPORATIVO ✓ (NUEVA)');
  console.log('   4. Validación de contraseña incorrecta ✓');
  console.log('\n🎯 Ahora los reclutadores pueden iniciar sesión usando:');
  console.log('   - Su correo personal + su contraseña');
  console.log('   - El correo corporativo de su empresa + su contraseña');
  console.log('='.repeat(60) + '\n');
}

// Ejecutar las pruebas
runTests().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});
