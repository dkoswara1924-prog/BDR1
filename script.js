// Daftar Nama Siswa Kelas IV A
const daftarSiswa = [
  "Ahmad Abdul Fatih Najmuddin",
  "Alfariel Hanan Adiyatma",
  "Alifa Naufalin",
  "Aluna Nurhaeni",
  "Anastasya Putri",
  "Azahra Salsabila",
  "Dzakira Talita Zahra",
  "Fahira Shaqila Syahda",
  "Faiha Rikzatunnisa",
  "Faiz Rizki Syahputra",
  "Fatimah Az Zahra",
  "Gina Yatul Azqia",
  "Haris Amirul Jihad",
  "Hugo Irna",
  "Keanu Rama Julian",
  "M. Luthfi Al Kindi",
  "Melati Sofia",
  "Muhamad Azril Alfatih",
  "Muhammad Adib Aminullah",
  "Muhammad Arbiansyah Ridwan",
  "Muhammad Dzikri Jazli",
  "Muhammad Faahir Kamil",
  "Muhammad Ghatfan Albarra",
  "Muhammad Rifqi Muttaqin",
  "Nadheera Ashaluna Yumna Naladhifa",
  "Naura Athifa Khairunnisa",
  "Nouvan Maulana Yusuf",
  "Putri Nadillah",
  "Radit Pranata",
  "Rehan Aditya Pratama",
  "Rika Nayila Putri",
  "Shyren Aulia Zahra",
  "Silfa Karin Faidah",
  "Siti Nuraelia Putri",
  "Siti Sulis Sholehah",
  "Syahila Hairina",
  "TB. Muhammad Prayata Nusantara",
  "M. Zaki Annufus",
  "Zaki Zikrullah",
  "Zulfan Azhar Raihan"
];

// Muat daftar siswa ke Dropdown
const selectNama = document.getElementById('nama');
daftarSiswa.forEach(siswa => {
  const option = document.createElement('option');
  option.value = siswa;
  option.textContent = siswa;
  selectNama.appendChild(option);
});

// Ambil Data dari LocalStorage
const dataAbsen = JSON.parse(localStorage.getItem('dataAbsenKelas4A')) || [];

// Set Tanggal Hari Ini secara otomatis
document.getElementById('tanggal').valueAsDate = new Date();

// Handle Form Submit
document.getElementById('absenForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const fileInput = document.getElementById('fotoTugas');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      simpanData(evt.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    simpanData('');
  }
});

function simpanData(fotoBase64) {
  const dataBaru = {
    tanggal: document.getElementById('tanggal').value,
    nama: selectNama.value,
    kehadiran: document.getElementById('kehadiran').value,
    mapel: document.getElementById('mapel').value || '-',
    statusTugas: document.getElementById('statusTugas').value,
    fotoTugas: fotoBase64
  };

  dataAbsen.push(dataBaru);
  localStorage.setItem('dataAbsenKelas4A', JSON.stringify(dataAbsen));

  // Reset Input
  selectNama.value = '';
  document.getElementById('mapel').value = '';
  document.getElementById('fotoTugas').value = '';

  renderTabel();
}

// Fungsi Render Tabel Harian dan Rekapitulasi
function renderTabel() {
  const tbodyHarian = document.querySelector('#tabelHarian tbody');
  const tbodyRekap = document.querySelector('#tabelRekap tbody');

  tbodyHarian.innerHTML = '';
  tbodyRekap.innerHTML = '';

  const rekap = {};
  daftarSiswa.forEach(nama => {
    rekap[nama] = { Hadir: 0, Izin: 0, Sakit: 0, Alpa: 0, TugasSelesai: 0 };
  });

  dataAbsen.forEach(item => {
    // Tampilan Gambar di Tabel
    const fotoHTML = item.fotoTugas 
      ? `<a href="${item.fotoTugas}" target="_blank"><img src="${item.fotoTugas}" style="width:40px; height:40px; object-fit:cover; border-radius:5px;"></a>` 
      : '-';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.tanggal}</td>
      <td><strong>${item.nama}</strong></td>
      <td>${item.kehadiran}</td>
      <td>${item.mapel}</td>
      <td>${item.statusTugas === 'Sudah' ? '✅ Sudah Mengerjakan' : '❌ Belum Mengerjakan'}</td>
      <td>${fotoHTML}</td>
    `;
    tbodyHarian.prepend(row);

    if (rekap[item.nama]) {
      rekap[item.nama][item.kehadiran]++;
      if (item.statusTugas === 'Sudah') {
        rekap[item.nama].TugasSelesai++;
      }
    }
  });

  daftarSiswa.forEach(nama => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="text-align: left;"><strong>${nama}</strong></td>
      <td>${rekap[nama].Hadir}</td>
      <td>${rekap[nama].Izin}</td>
      <td>${rekap[nama].Sakit}</td>
      <td>${rekap[nama].Alpa}</td>
      <td>${rekap[nama].TugasSelesai} Tugas</td>
    `;
    tbodyRekap.appendChild(row);
  });
}

renderTabel();
