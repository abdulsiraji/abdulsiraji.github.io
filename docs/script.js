document.addEventListener('DOMContentLoaded', function() {
    // --- Menu Burger ---
    const burgerButton = document.querySelector('.menu-burger');
    const menuNav = document.querySelector('.menu-nav');

    burgerButton.addEventListener('click', () => {
        burgerButton.classList.toggle('active');
        menuNav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // --- Waktu ---
    function displayTime(id, offset) {
        const element = document.getElementById(id);
        setInterval(function() {
            const now = new Date();
            const time = new Date(now.getTime() + offset * 60 * 60 * 1000);
            const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
            element.querySelector('span').textContent = time.toLocaleTimeString('id-ID', options);
        }, 1000);
    }

    displayTime('clock-wib', 7);
    displayTime('clock-wita', 8);

    // --- Fungsi Validasi ---
    function validateForm(data, formId) {
        const errors = [];
        // Tambahkan validasi di sini sesuai kebutuhan formulir Anda
        // Contoh validasi untuk field yang wajib diisi:
        for (const field in data) {
            if (data[field] === "" || data[field] === undefined) {
                errors.push(`Field '${field}' harus diisi.`);
            }
        }
        return errors;
    }

    // --- Menampilkan Pesan Error ---
    function displayErrors(errors, formId) {
        const errorContainer = document.getElementById(`${formId}-errors`);
        errorContainer.innerHTML = '';
        if (errors.length > 0) {
            const errorList = document.createElement('ul');
            errors.forEach(error => {
                const item = document.createElement('li');
                item.textContent = error;
                errorList.appendChild(item);
            });
            errorContainer.appendChild(errorList);
            errorContainer.style.display = 'block';
        } else {
            errorContainer.style.display = 'none';
        }
    }


    // --- Fungsi untuk memproses data absensi ---
    function processAbsensiData(data, formId) {
        const errors = validateForm(data, formId);
        displayErrors(errors, formId);
        if (errors.length > 0) return;

        // Simpan data absensi (ganti dengan penyimpanan ke server jika diperlukan)
        let absensiData = JSON.parse(localStorage.getItem('absensiData')) || [];
        absensiData.push(data);
        localStorage.setItem('absensiData', JSON.stringify(absensiData));
        updateAttendanceSummary();
    }

    // --- Fungsi untuk memperbarui ringkasan kehadiran ---
    function updateAttendanceSummary() {
        const absensiData = JSON.parse(localStorage.getItem('absensiData')) || [];
        const summaryTable = document.querySelector('#summary-table tbody');
        summaryTable.innerHTML = '';

        if (absensiData.length === 0) {
            summaryTable.innerHTML = '<tr><td colspan="8">Belum ada data absensi.</td></tr>';
            return;
        }

        absensiData.forEach(absensi => {
            const row = summaryTable.insertRow();
            Object.values(absensi).forEach(value => {
                const cell = row.insertCell();
                cell.textContent = value;
            });
        });
    }

    // --- Event listener untuk form absensi ---
    const absensiForm = document.getElementById('absensi-form');
    absensiForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = {};
        const formElements = this.elements;
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if (element.name) formData[element.name] = element.value;
        }
        processAbsensiData(formData, 'absensi');
    });


    // --- Event listener untuk form izin darurat ---
    const izinDaruratForm = document.getElementById('izin-darurat-form');
    izinDaruratForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = {};
        const formElements = this.elements;
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if (element.name) formData[element.name] = element.value;
        }

        const errors = validateForm(formData, 'izin-darurat');
        displayErrors(errors, 'izin-darurat');
        if (errors.length > 0) return;

        // Simpan data izin darurat (ganti dengan penyimpanan ke server)
        let izinData = JSON.parse(localStorage.getItem('izinData')) || [];
        izinData.push(formData);
        localStorage.setItem('izinData', JSON.stringify(izinData));
        alert('Izin darurat berhasil dikirim!');
        izinDaruratForm.reset();
    });

    // --- Custom Divisi Selection ---
    const divisiSelect = document.getElementById('divisi');
    const divisiOptions = ['Divisi A', 'Divisi B', 'Divisi C', 'Divisi D']; // Ganti dengan divisi Anda
    divisiOptions.forEach(option => {
        const el = document.createElement('option');
        el.textContent = option;
        el.value = option;
        divisiSelect.appendChild(el);
    });

});
