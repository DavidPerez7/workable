// Test directo a la API
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhc3BpcmFudGVAZXhhbXBsZS5jb20iLCJyb2xlIjoiQVNQSVJBTlRFIiwiaWF0IjoxNzM0Mzk4MDAwLCJleHAiOjE3MzQ0ODQ0MDB9.test";
fetch('http://localhost:8080/api/hoja-vida/2', {
  headers: { 'Authorization': 'Bearer ' + token }
})
.then(r => r.json())
.then(data => {
  console.log('HojaDeVida por ID:', JSON.stringify(data, null, 2));
  console.log('Estudios:', data.estudios);
  console.log('Experiencias:', data.experiencias);
});
