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
let dataAbsen = JSON.parse(localStorage.getItem('dataAbsenKelas4A')) || [];

// Set Tanggal Hari Ini secara otomatis
document.getElementById('tanggal').valueAsDate = new Date();

// Handle Form Submit
document.getElementById('absenForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const fileInput = document.getElementById('fotoTugas');
  const file = fileInput.files[0];

  if (file) {
    // Kompresi Gambar
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.src = event.target.result;
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400; // Ukuran lebar diturunkan agar hemat memori
        const scaleFactor = MAX_WIDTH / img.width;
        
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleFactor;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Kompresi kualitas gambar ke 60%
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        simpanData(compressedBase64);
      };
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

  try {
    dataAbsen.push(dataBaru);
    localStorage.setItem('dataAbsenKelas4A', JSON.stringify(dataAbsen));
    
    // Reset Input
    selectNama.value = '';
    document.getElementById('mapel').value = '';
    document.getElementById('fotoTugas').value = '';

    renderTabel();
    alert('Data berhasil disimpan!');
  } catch (error) {
    alert('Memori penyimpanan penuh. Coba simpan tanpa foto atau hapus riwayat browser.');
  }
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
