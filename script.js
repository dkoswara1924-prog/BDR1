const dataAbsen = JSON.parse(localStorage.getItem('dataAbsenKelas4A')) || [];

document.getElementById('tanggal').valueAsDate = new Date();

document.getElementById('absenForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const dataBaru = {
    tanggal: document.getElementById('tanggal').value,
    nama: document.getElementById('nama').value.trim(),
    kehadiran: document.getElementById('kehadiran').value,
    mapel: document.getElementById('mapel').value || '-',
    statusTugas: document.getElementById('statusTugas').value,
    linkTugas: document.getElementById('linkTugas').value || '#'
  };

  dataAbsen.push(dataBaru);
  localStorage.setItem('dataAbsenKelas4A', JSON.stringify(dataAbsen));

  document.getElementById('nama').value = '';
  document.getElementById('mapel').value = '';
  document.getElementById('linkTugas').value = '';

  renderTabel();
});

function renderTabel() {
  const tbodyHarian = document.querySelector('#tabelHarian tbody');
  const tbodyRekap = document.querySelector('#tabelRekap tbody');

  tbodyHarian.innerHTML = '';
  tbodyRekap.innerHTML = '';

  const rekap = {};

  dataAbsen.forEach(item => {
    // Tabel Harian
    const row = document.createElement('tr');
    const linkHTML = item.linkTugas !== '#' 
      ? `<a href="${item.linkTugas}" target="_blank">🔗 Buka</a>` 
      : '-';

    row.innerHTML = `
      <td>${item.tanggal}</td>
      <td><strong>${item.nama}</strong></td>
      <td>${item.kehadiran}</td>
      <td>${item.mapel}</td>
      <td>${item.statusTugas === 'Sudah' ? '✅ Sudah' : '❌ Belum'}</td>
      <td>${linkHTML}</td>
    `;
    tbodyHarian.prepend(row);

    // Hitung Rekapitulasi
    if (!rekap[item.nama]) {
      rekap[item.nama] = { Hadir: 0, Izin: 0, Sakit: 0, Alpa: 0, TugasSelesai: 0 };
    }
    rekap[item.nama][item.kehadiran]++;
    if (item.statusTugas === 'Sudah') {
      rekap[item.nama].TugasSelesai++;
    }
  });

  // Render Rekapitulasi
  Object.keys(rekap).forEach(nama => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${nama}</strong></td>
      <td>${rekap[nama].Hadir}</td>
      <td>${rekap[nama].Izin}</td>
      <td>${rekap[nama].Sakit}</td>
      <td>${rekap[nama].Alpa}</td>
      <td>${rekap[nama].TugasSelesai} Akses</td>
    `;
    tbodyRekap.appendChild(row);
  });
}

renderTabel();
