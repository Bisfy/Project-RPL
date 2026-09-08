document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formPendaftaran");
    const hasilDiv = document.getElementById("hasil");
    const btnSubmit = form.querySelector(".btn-submit");

    const inputs = {
        nama: document.getElementById("nama"),
        email: document.getElementById("email"),
        kelas: document.getElementById("kelas"),
        jurusan: document.getElementById("jurusan"),
        kegiatan: document.getElementById("kegiatan"),
        persetujuan: document.getElementById("persetujuan")
    };

    const toggleSubmitButton = () => {
        btnSubmit.disabled = !inputs.persetujuan.checked;
    };
    
    toggleSubmitButton();

    inputs.persetujuan.addEventListener("change", () => {
        toggleSubmitButton();
        clearError("persetujuan");
    });

    const showError = (field, message) => {
        const errorElement = document.getElementById(`error-${field}`);
        if (errorElement) {
            errorElement.textContent = message;
        }
        if (inputs[field] && inputs[field].type !== "checkbox") {
            inputs[field].style.borderColor = "#ff5252";
        }
    };

    const clearError = (field) => {
        const errorElement = document.getElementById(`error-${field}`);
        if (errorElement) {
            errorElement.textContent = "";
        }
        if (inputs[field] && inputs[field].type !== "checkbox") {
            inputs[field].style.borderColor = "var(--card-border)";
        }
    };

    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validateForm = () => {
        let isValid = true;

        if (inputs.nama.value.trim() === "") {
            showError("nama", "Namanya tolong diisi ya....");
            isValid = false;
        } else if (inputs.nama.value.trim().length < 3) {
            showError("nama", "Minimal 3 huruf ya...");
            isValid = false;
        } else {
            clearError("nama");
        }

        if (inputs.email.value.trim() === "") {
            showError("email", "Emailnya tolong diisi dulu ya...");
            isValid = false;
        } else if (!isValidEmail(inputs.email.value.trim())) {
            showError("email", "Emailnya nggak valid nih.");
            isValid = false;
        } else {
            clearError("email");
        }

        if (inputs.kelas.value === "") {
            showError("kelas", "Pilih kelas dulu.");
            isValid = false;
        } else {
            clearError("kelas");
        }

        if (inputs.jurusan.value === "") {
            showError("jurusan", "Pilih jurusan dulu.");
            isValid = false;
        } else {
            clearError("jurusan");
        }

        if (inputs.kegiatan.value.trim() === "") {
            showError("kegiatan", "Nama kegiatan diisi dulu.");
            isValid = false;
        } else {
            clearError("kegiatan");
        }

        return isValid;
    };

    Object.keys(inputs).forEach((key) => {
        if (key === "persetujuan") return;
        const element = inputs[key];
        const eventType = element.tagName === "SELECT" ? "change" : "input";
        
        element.addEventListener(eventType, () => {
            clearError(key);
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (validateForm()) {
            hasilDiv.className = "success";
            hasilDiv.innerHTML = `<strong>Pendaftaran Berhasil!</strong><br>Terima kasih, ${inputs.nama.value}. Data Anda telah terdata untuk kegiatan ${inputs.kegiatan.value}.`;

            form.reset();
            toggleSubmitButton();

            hasilDiv.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            hasilDiv.className = "error";
            hasilDiv.textContent = "Gagal mendaftar.Tolong diperiksa kembali bagian yang belum diisi dengan benar.";
            
            hasilDiv.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
});