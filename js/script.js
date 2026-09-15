document.addEventListener("DOMContentLoaded", () => {
    let daftarPendaftar = JSON.parse(localStorage.getItem("daftarPendaftar")) || [];

    const form = document.getElementById("formPendaftaran");
    const statusAlert = document.getElementById("statusAlert");
    const btnSubmit = document.getElementById("btnSubmit");
    const tabelBody = document.getElementById("tabelPesertaBody");
    const formTitle = document.getElementById("formTitle");
    const editIdInput = document.getElementById("editId");
    const btnCancelEdit = document.getElementById("btnCancelEdit");
    const statusFieldGroup = document.getElementById("statusFieldGroup");
    const statusPesertaSelect = document.getElementById("statusPeserta");

    // Elemen Navigasi Kontrol Menu
    const btnPageForm = document.getElementById("btnPageForm");
    const btnPageTable = document.getElementById("btnPageTable");
    const pageForm = document.getElementById("pageForm");
    const pageTable = document.getElementById("pageTable");

    const fields = {
        nama: document.getElementById("nama"),
        email: document.getElementById("email"),
        kelas: document.getElementById("kelas"),
        jurusan: document.getElementById("jurusan"),
        kegiatan: document.getElementById("kegiatan"),
        persetujuan: document.getElementById("persetujuan")
    };

    // --- LOGIKA PERPINDAHAN HALAMAN AKTIF ---
    const gantiHalaman = (halamanTujuan, tombolAktif) => {
        pageForm.classList.remove("aktif");
        pageTable.classList.remove("aktif");
        btnPageForm.classList.remove("active-tab");
        btnPageTable.classList.remove("active-tab");

        halamanTujuan.classList.add("aktif");
        tombolAktif.classList.add("active-tab");
    };

    if (btnPageForm) btnPageForm.addEventListener("click", () => gantiHalaman(pageForm, btnPageForm));
    if (btnPageTable) btnPageTable.addEventListener("click", () => gantiHalaman(pageTable, btnPageTable));

    const saveData = () => {
        localStorage.setItem("daftarPendaftar", JSON.stringify(daftarPendaftar));
    };

    const escapeHtml = (str) => {
        return str.replace(/[&<>"']/g, (m) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[m]);
    };

    const renderTampilan = () => {
        tabelBody.innerHTML = "";

        if (daftarPendaftar.length === 0) {
            tabelBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-sub); padding: 24px;">
                        Belum ada peserta yang terdaftar.
                    </td>
                </tr>
            `;
            return;
        }

        daftarPendaftar.forEach((peserta) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${escapeHtml(peserta.nama)}</strong></td>
                <td>${escapeHtml(peserta.email)}</td>
                <td>${peserta.kelas} - ${peserta.jurusan}</td>
                <td>${escapeHtml(peserta.kegiatan)}</td>
                <td>${peserta.konsumsi}</td>
                <td><span class="status-badge ${peserta.status}">${peserta.status}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn-action btn-edit" onclick="handleEdit('${peserta.id}')">Edit</button>
                        <button class="btn-action btn-delete" onclick="handleDelete('${peserta.id}')">Hapus</button>
                    </div>
                </td>
            `;
            tabelBody.appendChild(tr);
        });
    };

    const toggleSubmit = () => {
        btnSubmit.disabled = !fields.persetujuan.checked;
    };

    fields.persetujuan.addEventListener("change", () => {
        toggleSubmit();
        clearError("persetujuan");
    });

    const setError = (key, msg) => {
        const errEl = document.getElementById(`err-${key}`);
        if (errEl) errEl.textContent = msg;
    };

    const clearError = (key) => {
        const errEl = document.getElementById(`err-${key}`);
        if (errEl) errEl.textContent = "";
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    };

    const validate = () => {
        let valid = true;

        if (!fields.nama.value.trim()) {
            setError("nama", "Nama wajib diisi.");
            valid = false;
        } else clearError("nama");

        if (!fields.email.value.trim()) {
            setError("email", "Email wajib diisi.");
            valid = false;
        } else if (!isValidEmail(fields.email.value.trim())) {
            setError("email", "Format email tidak valid.");
            valid = false;
        } else clearError("email");

        if (!fields.kelas.value) {
            setError("kelas", "Pilih kelas.");
            valid = false;
        } else clearError("kelas");

        if (!fields.jurusan.value) {
            setError("jurusan", "Pilih jurusan.");
            valid = false;
        } else clearError("jurusan");

        if (!fields.kegiatan.value.trim()) {
            setError("kegiatan", "Kegiatan wajib diisi.");
            valid = false;
        } else clearError("kegiatan");

        const selectedKonsumsi = form.querySelector('input[name="konsumsi"]:checked');
        if (!selectedKonsumsi) {
            setError("konsumsi", "Pilih konsumsi.");
            valid = false;
        } else clearError("konsumsi");

        return valid;
    };

    Object.keys(fields).forEach((key) => {
        if (key === "persetujuan") return;
        const el = fields[key];
        if (el) {
            const eventName = el.tagName === "SELECT" ? "change" : "input";
            el.addEventListener(eventName, () => clearError(key));
        }
    });

    const radioGroup = form.querySelectorAll('input[name="konsumsi"]');
    radioGroup.forEach(radio => radio.addEventListener("change", () => clearError("konsumsi")));

    const resetFormMode = () => {
        form.reset();
        editIdInput.value = "";
        formTitle.textContent = "Formulir Pendaftaran";
        btnSubmit.textContent = "Daftar Sekarang";
        btnCancelEdit.style.display = "none";
        statusFieldGroup.style.display = "none";
        toggleSubmit();
    };

    // --- AKSI EDIT (Otomatis pindah ke Halaman Form) ---
    window.handleEdit = (id) => {
        const targetPeserta = daftarPendaftar.find(p => p.id === id);
        if (!targetPeserta) return;

        editIdInput.value = targetPeserta.id;
        fields.nama.value = targetPeserta.nama;
        fields.email.value = targetPeserta.email;
        fields.kelas.value = targetPeserta.kelas;
        fields.jurusan.value = targetPeserta.jurusan;
        fields.kegiatan.value = targetPeserta.kegiatan;
        
        const radioTarget = form.querySelector(`input[name="konsumsi"][value="${targetPeserta.konsumsi}"]`);
        if (radioTarget) radioTarget.checked = true;

        fields.persetujuan.checked = true;
        statusPesertaSelect.value = targetPeserta.status;

        formTitle.textContent = "Edit Data Peserta";
        btnSubmit.textContent = "Perbarui Data";
        btnCancelEdit.style.display = "inline-block";
        statusFieldGroup.style.display = "flex";

        toggleSubmit();

        // Navigasi ke Form saat tombol edit ditekan
        gantiHalaman(pageForm, btnPageForm);
        form.scrollIntoView({ behavior: "smooth" });
    };

    window.handleDelete = (id) => {
        const confirmDelete = confirm("Apakah Anda yakin ingin menghapus peserta ini?");
        if (confirmDelete) {
            daftarPendaftar = daftarPendaftar.filter(p => p.id !== id);
            saveData();
            renderTampilan();
            
            if (editIdInput.value === id) {
                resetFormMode();
            }
        }
    };

    btnCancelEdit.addEventListener("click", () => {
        resetFormMode();
        gantiHalaman(pageTable, btnPageTable);
    });

    // --- AKSI SUBMIT FORM ---
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (validate()) {
            const isEditMode = editIdInput.value !== "";
            const konsumsiValue = form.querySelector('input[name="konsumsi"]:checked').value;

            if (isEditMode) {
                const targetId = editIdInput.value;
                daftarPendaftar = daftarPendaftar.map(p => {
                    if (p.id === targetId) {
                        return {
                            ...p,
                            nama: fields.nama.value.trim(),
                            email: fields.email.value.trim(),
                            kelas: fields.kelas.value,
                            jurusan: fields.jurusan.value,
                            kegiatan: fields.kegiatan.value.trim(),
                            konsumsi: konsumsiValue,
                            status: statusPesertaSelect.value
                        };
                    }
                    return p;
                });
                statusAlert.textContent = "Data peserta berhasil diperbarui!";
            } else {
                const newPeserta = {
                    id: "Id_daftar_" + Date.now(),
                    nama: fields.nama.value.trim(),
                    email: fields.email.value.trim(),
                    kelas: fields.kelas.value,
                    jurusan: fields.jurusan.value,
                    kegiatan: fields.kegiatan.value.trim(),
                    konsumsi: konsumsiValue,
                    status: "Pending"
                };
                daftarPendaftar.push(newPeserta);
                statusAlert.textContent = "Pendaftaran berhasil disimpan!";
            }

            saveData();
            renderTampilan();
            resetFormMode();

            statusAlert.className = "alert-box success";

            setTimeout(() => {statusAlert.style.display = "none";}, 3000);// Otomatis pindah ke halaman daftar peserta setelah sukses input 
        datagantiHalaman(pageTable, btnPageTable);} else {statusAlert.className = "alert-box error";
            statusAlert.textContent = "Periksa kembali field yang diisi.";
    }});
    renderTampilan();
});