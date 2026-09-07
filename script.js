const URL_SCRIPT = 'https://script.google.com/macros/s/AKfycbxpso6Tp5Gic9VoB5FlLohlC_ddUHsp1TtM-eWzUXupZy-PAchnCmNC9V0qZISCNCaXbw/exec';

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

// Set Tanggal Hari Ini secara otomatis
document.getElementById('tanggal').valueAsDate = new Date();

// Handle Form Submit
document.getElementById('absenForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const fileInput = document.getElementById('fotoTugas');
  const file = fileInput.files[0];
  const btnSubmit = e.target.querySelector('button[type="submit"]');
  
  btnSubmit.disabled = true;
  btnSubmit.textContent = '⏳ Mengirim Data...';

  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.src = event.target.result;
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const scaleFactor = MAX_WIDTH / img.width;
        
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleFactor;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
        kirimKeGoogleSheets(compressedBase64, btnSubmit);
      };
    };
    reader.readAsDataURL(file);
  } else {
    kirimKeGoogleSheets('', btnSubmit);
  }
});

function kirimKeGoogleSheets(fotoBase64, btnSubmit) {
  const payload = {
    tanggal: document.getElementById('tanggal').value,
    nama: selectNama.value,
    kehadiran: document.getElementById('kehadiran').value,
    mapel: document.getElementById('mapel').value || '-',
    statusTugas: document.getElementById('statusTugas').value,
    fotoTugas: fotoBase64
  };

  fetch(URL_SCRIPT, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    alert('✅ Data dan Foto Berhasil Terkirim!');
    selectNama.value = '';
    document.getElementById('mapel').value = '';
    document.getElementById('fotoTugas').value = '';
    
    // Refresh tabel rekapitulasi
    ambilDataGoogleSheets();
  })
  .catch(err => {
    alert('❌ Gagal mengirim data. Coba cek koneksi internetmu.');
  })
  .finally(() => {
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Simpan Data';
  });
}

function ambilDataGoogleSheets() {
  fetch(URL_SCRIPT)
    .then(res => res.json())
    .then(data => {
      renderTabel(data);
    })
    .catch(err => console.error("Gagal memuat data rekap:", err));
}

function renderTabel(dataAbsen) {
  const tbodyHarian = document.querySelector('#tabelHarian tbody');
  const tbodyRekap = document.querySelector('#tabelRekap tbody');

  tbodyHarian.innerHTML = '';
  tbodyRekap.innerHTML = '';

  const rekap = {};
  daftarSiswa.forEach(nama => {
    rekap[nama] = { Hadir: 0, Izin: 0, Sakit: 0, Alpa: 0, TugasSelesai: 0 };
  });

  dataAbsen.forEach(rowArray => {
    const [tanggal, nama, kehadiran, mapel, statusTugas, fotoTugas] = rowArray;

    const fotoHTML = fotoTugas 
      ? `<a href="${fotoTugas}" target="_blank"><img src="${fotoTugas}" style="width:45px; height:45px; object-fit:cover; border-radius:6px; border:1px solid #ccc;"></a>` 
      : '-';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${tanggal}</td>
      <td><strong>${nama}</strong></td>
      <td>${kehadiran}</td>
      <td>${mapel}</td>
      <td>${statusTugas === 'Sudah' ? '✅ Sudah Mengerjakan' : '❌ Belum Mengerjakan'}</td>
      <td>${fotoHTML}</td>
    `;
    tbodyHarian.prepend(row);

    if (rekap[nama]) {
      rekap[nama][kehadiran]++;
      if (statusTugas === 'Sudah') {
        rekap[nama].TugasSelesai++;
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

// Muat data saat halaman pertama kali dibuka
ambilDataGoogleSheets();
