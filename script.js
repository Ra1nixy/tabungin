// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'info') {
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    
    // Warna berdasarkan type
    const colors = {
        info: 'bg-primary',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500'
    };
    
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 ${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce flex items-center`;
    
    // Tambahkan ikon berdasarkan type
    const icons = {
        info: 'info-circle',
        success: 'check-circle',
        warning: 'exclamation-circle',
        error: 'times-circle'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type]} mr-2"></i>
        <span>${message}</span>
    `;
    
    // Tambahkan ke body
    document.body.appendChild(notification);
    
    // Hapus setelah 3 detik
    setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Fungsi untuk memformat uang
function formatMoney(amount) {
    return 'Rp ' + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Fungsi untuk menampilkan modal
function showModal(content, title) {
    // Hapus modal yang sudah ada
    const existingModal = document.getElementById('custom-modal');
    if (existingModal) existingModal.remove();
    
    const modalHTML = `
        <div id="custom-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
                <div class="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="text-lg font-bold">${title}</h3>
                    <button id="close-modal" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div class="p-6">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHTML;
    document.body.appendChild(modalDiv);
    
    // Tutup modal
    document.getElementById('close-modal').addEventListener('click', () => {
        modalDiv.classList.add('opacity-0');
        setTimeout(() => {
            modalDiv.remove();
        }, 300);
    });
    
    // Tutup modal saat klik di luar
    modalDiv.addEventListener('click', (e) => {
        if (e.target === modalDiv) {
            modalDiv.classList.add('opacity-0');
            setTimeout(() => {
                modalDiv.remove();
            }, 300);
        }
    });
    
    return modalDiv;
}

// Data simulasi untuk aplikasi
const appData = {
    balance: 1250000,
    savingsGoals: [
        { id: 1, name: 'HP Baru', target: 5000000, saved: 2250000, icon: 'mobile-alt', color: 'yellow' },
        { id: 2, name: 'Liburan', target: 10000000, saved: 2200000, icon: 'plane', color: 'blue' }
    ],
    transactions: [
        { id: 1, type: 'deposit', amount: 50000, date: 'Hari ini, 08:30', description: 'Setoran Rutin' },
        { id: 2, type: 'withdraw', amount: 100000, date: 'Kemarin, 16:45', description: 'Tarik Tunai' }
    ]
};

// Event listener saat DOM siap
document.addEventListener('DOMContentLoaded', function() {
    if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/tabungin/service-worker.js")
      .then(reg => console.log("Service Worker registered:", reg))
      .catch(err => console.log("Service Worker failed:", err));
  });
}

    // Update saldo dan data di UI
    updateUI();
    
    // Tombol Top Up
    document.querySelector('section.bg-primary button:first-of-type').addEventListener('click', showTopUpForm);
    
    // Tombol Transfer
    document.querySelector('section.bg-primary button:last-of-type').addEventListener('click', showTransferForm);
    
    // Menu utama
    document.querySelectorAll('.grid.grid-cols-4 .flex.flex-col.items-center').forEach((item, index) => {
        item.addEventListener('click', function() {
            // Animasi tekan
            this.classList.add('transform', 'scale-95');
            setTimeout(() => {
                this.classList.remove('transform', 'scale-95');
            }, 200);
            
            const menuText = this.querySelector('span').textContent;
            
            if (index === 0) { // Tabung
                showDepositForm();
            } else if (index === 1) { // Invest
                showNotification('Fitur investasi akan segera hadir!', 'info');
            } else if (index === 2) { // Hadiah
                showRewards();
            } else if (index === 3) { // Lainnya
                showOtherMenu();
            }
        });
    });
    
    // Target menabung
    document.querySelectorAll('section:nth-of-type(4) .flex.items-center.p-3').forEach(item => {
        item.addEventListener('click', function() {
            const goalName = this.querySelector('h4').textContent;
            const goal = appData.savingsGoals.find(g => g.name === goalName);
            showGoalDetail(goal);
        });
    });
    
    // Tombol tambah target
    document.querySelector('section:nth-of-type(4) button').addEventListener('click', showAddGoalForm);
    
    // Riwayat transaksi
    document.querySelectorAll('section:nth-of-type(5) .flex.items-center.p-3').forEach(item => {
        item.addEventListener('click', function() {
            const desc = this.querySelector('h4').textContent;
            const transaction = appData.transactions.find(t => t.description === desc);
            showTransactionDetail(transaction);
        });
    });
});

// Fungsi untuk update UI berdasarkan data
function updateUI() {
    // Update saldo
    document.querySelector('section.bg-primary h2').textContent = formatMoney(appData.balance);
    
    // Update target menabung
    const goalsContainer = document.querySelector('section:nth-of-type(4) .space-y-3');
    goalsContainer.innerHTML = '';
    
    appData.savingsGoals.forEach(goal => {
        const progress = (goal.saved / goal.target) * 100;
        const colorClasses = {
            yellow: 'bg-yellow-100 text-yellow-600',
            blue: 'bg-blue-100 text-blue-600',
            red: 'bg-red-100 text-red-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600'
        };
        
        const goalHTML = `
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 ${colorClasses[goal.color]} rounded-full flex items-center justify-center">
                    <i class="fas fa-${goal.icon}"></i>
                </div>
                <div class="ml-3 flex-1">
                    <h4 class="font-medium text-sm">${goal.name}</h4>
                    <div class="flex justify-between items-center mt-1">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-primary h-2 rounded-full" style="width: ${progress}%"></div>
                        </div>
                        <span class="text-xs text-gray-500 ml-2">${Math.round(progress)}%</span>
                    </div>
                </div>
            </div>
        `;
        
        goalsContainer.insertAdjacentHTML('beforeend', goalHTML);
    });
    
    // Update riwayat transaksi
    const transactionsContainer = document.querySelector('section:nth-of-type(5) .space-y-3');
    transactionsContainer.innerHTML = '';
    
    appData.transactions.forEach(trans => {
        const isDeposit = trans.type === 'deposit';
        const transHTML = `
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 ${isDeposit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} rounded-full flex items-center justify-center">
                    <i class="fas fa-${isDeposit ? 'arrow-down' : 'arrow-up'}"></i>
                </div>
                <div class="ml-3 flex-1">
                    <h4 class="font-medium text-sm">${trans.description}</h4>
                    <p class="text-xs text-gray-500">${trans.date}</p>
                </div>
                <div class="text-right">
                    <p class="font-medium text-sm ${isDeposit ? 'text-green-600' : 'text-red-600'}">${isDeposit ? '+' : '-'}${formatMoney(trans.amount)}</p>
                    <p class="text-xs text-gray-500">Saldo: ${formatMoney(appData.balance)}</p>
                </div>
            </div>
        `;
        
        transactionsContainer.insertAdjacentHTML('beforeend', transHTML);
    });
}

// Form Top Up
function showTopUpForm() {
    const formHTML = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium mb-1">Jumlah Top Up</label>
                <input type="number" id="topup-amount" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Rp">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Metode Pembayaran</label>
                <select id="topup-method" class="w-full p-3 border border-gray-300 rounded-lg">
                    <option value="bank">Transfer Bank</option>
                    <option value="gopay">GoPay</option>
                    <option value="ovo">OVO</option>
                    <option value="dana">DANA</option>
                </select>
            </div>
            <button id="submit-topup" class="w-full bg-primary text-white py-3 rounded-lg font-medium mt-4">
                Top Up Sekarang
            </button>
        </div>
    `;
    
    const modal = showModal(formHTML, 'Top Up Saldo');
    
    modal.querySelector('#submit-topup').addEventListener('click', function() {
        const amount = parseFloat(modal.querySelector('#topup-amount').value);
        const method = modal.querySelector('#topup-method').value;
        
        if (amount && amount > 0) {
            // Simpan ke data
            appData.balance += amount;
            appData.transactions.unshift({
                id: appData.transactions.length + 1,
                type: 'deposit',
                amount: amount,
                date: new Date().toLocaleString('id-ID', { weekday: 'long', hour: '2-digit', minute: '2-digit' }),
                description: 'Top Up ' + method.charAt(0).toUpperCase() + method.slice(1)
            });
            
            // Update UI
            updateUI();
            
            // Tutup modal
            modal.remove();
            
            showNotification(`Top Up Rp ${formatMoney(amount)} berhasil!`, 'success');
        } else {
            showNotification('Masukkan jumlah yang valid', 'error');
        }
    });
}

// Form Transfer
function showTransferForm() {
    const formHTML = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium mb-1">Jumlah Transfer</label>
                <input type="number" id="transfer-amount" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Rp">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Nomor Rekening/Tujuan</label>
                <input type="text" id="transfer-target" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="1234567890">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Bank Tujuan</label>
                <select id="transfer-bank" class="w-full p-3 border border-gray-300 rounded-lg">
                    <option value="bca">BCA</option>
                    <option value="bni">BNI</option>
                    <option value="bri">BRI</option>
                    <option value="mandiri">Mandiri</option>
                </select>
            </div>
            <button id="submit-transfer" class="w-full bg-primary text-white py-3 rounded-lg font-medium mt-4">
                Transfer Sekarang
            </button>
        </div>
    `;
    
    const modal = showModal(formHTML, 'Transfer');
    
    modal.querySelector('#submit-transfer').addEventListener('click', function() {
        const amount = parseFloat(modal.querySelector('#transfer-amount').value);
        const target = modal.querySelector('#transfer-target').value;
        const bank = modal.querySelector('#transfer-bank').value;
        
        if (amount && amount > 0 && target) {
            if (amount > appData.balance) {
                showNotification('Saldo tidak mencukupi', 'error');
                return;
            }
            
            // Simpan ke data
            appData.balance -= amount;
            appData.transactions.unshift({
                id: appData.transactions.length + 1,
                type: 'withdraw',
                amount: amount,
                date: new Date().toLocaleString('id-ID', { weekday: 'long', hour: '2-digit', minute: '2-digit' }),
                description: 'Transfer ke ' + bank.toUpperCase()
            });
            
            // Update UI
            updateUI();
            
            // Tutup modal
            modal.remove();
            
            showNotification(`Transfer Rp ${formatMoney(amount)} berhasil!`, 'success');
        } else {
            showNotification('Isi semua field dengan benar', 'error');
        }
    });
}

// Form Setoran Tabungan
function showDepositForm() {
    const formHTML = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium mb-1">Jumlah Setoran</label>
                <input type="number" id="deposit-amount" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Rp">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Target Tabungan (opsional)</label>
                <select id="deposit-goal" class="w-full p-3 border border-gray-300 rounded-lg">
                    <option value="">Tanpa Target</option>
                    ${appData.savingsGoals.map(goal => `<option value="${goal.id}">${goal.name}</option>`).join('')}
                </select>
            </div>
            <button id="submit-deposit" class="w-full bg-primary text-white py-3 rounded-lg font-medium mt-4">
                Simpan Sekarang
            </button>
        </div>
    `;
    
    const modal = showModal(formHTML, 'Setoran Tabungan');
    
    modal.querySelector('#submit-deposit').addEventListener('click', function() {
        const amount = parseFloat(modal.querySelector('#deposit-amount').value);
        const goalId = parseInt(modal.querySelector('#deposit-goal').value);
        
        if (amount && amount > 0) {
            // Simpan ke data
            appData.balance += amount;
            
            // Jika memilih target, tambahkan ke target tersebut
            if (goalId) {
                const goal = appData.savingsGoals.find(g => g.id === goalId);
                if (goal) {
                    goal.saved += amount;
                }
            }
            
            appData.transactions.unshift({
                id: appData.transactions.length + 1,
                type: 'deposit',
                amount: amount,
                date: new Date().toLocaleString('id-ID', { weekday: 'long', hour: '2-digit', minute: '2-digit' }),
                description: goalId ? 'Setoran ke ' + appData.savingsGoals.find(g => g.id === goalId).name : 'Setoran Tabungan'
            });
            
            // Update UI
            updateUI();
            
            // Tutup modal
            modal.remove();
            
            showNotification(`Setoran Rp ${formatMoney(amount)} berhasil!`, 'success');
        } else {
            showNotification('Masukkan jumlah yang valid', 'error');
        }
    });
}

// Menu Hadiah
function showRewards() {
    const rewardsHTML = `
        <div class="space-y-4">
            <div class="text-center py-4">
                <i class="fas fa-gift text-4xl text-primary mb-2"></i>
                <h4 class="font-bold">Poin Anda: 250</h4>
                <p class="text-sm text-gray-500">Tukarkan poin untuk hadiah menarik</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="border border-gray-200 rounded-lg p-3 text-center">
                    <div class="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-coffee text-yellow-600"></i>
                    </div>
                    <h5 class="font-medium">Voucher Kopi</h5>
                    <p class="text-xs text-gray-500">Diskon 20%</p>
                    <button class="mt-2 bg-primary text-white text-xs py-1 px-3 rounded-full font-medium">
                        50 Poin
                    </button>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-3 text-center">
                    <div class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-film text-blue-600"></i>
                    </div>
                    <h5 class="font-medium">Voucher Bioskop</h5>
                    <p class="text-xs text-gray-500">1 Tiket Gratis</p>
                    <button class="mt-2 bg-primary text-white text-xs py-1 px-3 rounded-full font-medium">
                        100 Poin
                    </button>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-3 text-center">
                    <div class="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-shopping-bag text-green-600"></i>
                    </div>
                    <h5 class="font-medium">Voucher Belanja</h5>
                    <p class="text-xs text-gray-500">Rp 20.000</p>
                    <button class="mt-2 bg-primary text-white text-xs py-1 px-3 rounded-full font-medium">
                        200 Poin
                    </button>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-3 text-center">
                    <div class="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                        <i class="fas fa-plane text-red-600"></i>
                    </div>
                    <h5 class="font-medium">Voucher Travel</h5>
                    <p class="text-xs text-gray-500">Diskon 10%</p>
                    <button class="mt-2 bg-primary text-white text-xs py-1 px-3 rounded-full font-medium">
                        150 Poin
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showModal(rewardsHTML, 'Hadiah & Rewards');
}

// Menu Lainnya
function showOtherMenu() {
    const menuHTML = `
        <div class="grid grid-cols-3 gap-4">
            <!-- Tabungan Berjangka -->
            <div class="flex flex-col items-center p-3 bg-gray-50 rounded-lg" id="tabungan-berjangka">
                <div class="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <i class="fas fa-calendar-alt text-blue-600"></i>
                </div>
                <span class="text-xs mt-2 text-center">Tabungan Berjangka</span>
            </div>
            
            <!-- Dana Darurat -->
            <div class="flex flex-col items-center p-3 bg-gray-50 rounded-lg" id="dana-darurat">
                <div class="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <i class="fas fa-first-aid text-red-600"></i>
                </div>
                <span class="text-xs mt-2 text-center">Dana Darurat</span>
            </div>
            
            <!-- Budgeting -->
            <div class="flex flex-col items-center p-3 bg-gray-50 rounded-lg" id="budgeting">
                <div class="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <i class="fas fa-money-bill-wave text-purple-600"></i>
                </div>
                <span class="text-xs mt-2 text-center">Budgeting</span>
            </div>
            
            <!-- Kalkulator -->
            <div class="flex flex-col items-center p-3 bg-gray-50 rounded-lg" id="kalkulator">
                <div class="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <i class="fas fa-calculator text-green-600"></i>
                </div>
                <span class="text-xs mt-2 text-center">Kalkulator</span>
            </div>
            
            <!-- Tips Menabung -->
            <div class="flex flex-col items-center p-3 bg-gray-50 rounded-lg" id="tips-menabung">
                <div class="bg-yellow-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <i class="fas fa-lightbulb text-yellow-600"></i>
                </div>
                <span class="text-xs mt-2 text-center">Tips Menabung</span>
            </div>
            
            <!-- Pengaturan -->
            <div class="flex flex-col items-center p-3 bg-gray-50 rounded-lg" id="pengaturan">
                <div class="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center">
                    <i class="fas fa-cog text-gray-600"></i>
                </div>
                <span class="text-xs mt-2 text-center">Pengaturan</span>
            </div>
        </div>
        
        <!-- Fitur Tambahan -->
        <div class="mt-6">
            <div class="flex items-center justify-between p-3 border-b border-gray-200" id="keamanan">
                <div class="flex items-center">
                    <i class="fas fa-shield-alt text-primary mr-3"></i>
                    <span>Keamanan</span>
                </div>
                <i class="fas fa-chevron-right text-gray-400"></i>
            </div>
            <div class="flex items-center justify-between p-3 border-b border-gray-200" id="bantuan">
                <div class="flex items-center">
                    <i class="fas fa-question-circle text-primary mr-3"></i>
                    <span>Bantuan</span>
                </div>
                <i class="fas fa-chevron-right text-gray-400"></i>
            </div>
            <div class="flex items-center justify-between p-3" id="tentang">
                <div class="flex items-center">
                    <i class="fas fa-info-circle text-primary mr-3"></i>
                    <span>Tentang Kami</span>
                </div>
                <i class="fas fa-chevron-right text-gray-400"></i>
            </div>
        </div>
    `;
    
    const modal = showModal(menuHTML, 'Menu Lainnya');
    
    // Tambahkan event listener untuk setiap menu
    modal.querySelector('#tabungan-berjangka').addEventListener('click', showTermDeposit);
    modal.querySelector('#dana-darurat').addEventListener('click', showEmergencyFund);
    modal.querySelector('#budgeting').addEventListener('click', showBudgeting);
    modal.querySelector('#kalkulator').addEventListener('click', showCalculator);
    modal.querySelector('#tips-menabung').addEventListener('click', showTips);
    modal.querySelector('#pengaturan').addEventListener('click', showSettings);
    modal.querySelector('#keamanan').addEventListener('click', showSecurity);
    modal.querySelector('#bantuan').addEventListener('click', showHelp);
    modal.querySelector('#tentang').addEventListener('click', showAbout);
}

// Fungsi untuk Tabungan Berjangka
function showTermDeposit() {
    const content = `
        <div class="space-y-4">
            <div class="text-center py-4">
                <i class="fas fa-calendar-alt text-4xl text-blue-500 mb-2"></i>
                <h4 class="font-bold">Tabungan Berjangka</h4>
                <p class="text-sm text-gray-500">Menabung dengan target waktu tertentu</p>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg">
                <h5 class="font-medium mb-2">Tabungan Aktif</h5>
                <div class="space-y-3">
                    ${appData.savingsGoals.filter(g => g.name.includes('Berjangka')).length > 0 ? 
                    appData.savingsGoals.filter(g => g.name.includes('Berjangka')).map(goal => `
                        <div class="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                            <div>
                                <h6 class="font-medium">${goal.name}</h6>
                                <p class="text-xs text-gray-500">Jatuh tempo: 12 bulan lagi</p>
                            </div>
                            <span class="font-bold text-blue-600">${formatMoney(goal.saved)}</span>
                        </div>
                    `).join('') : 
                    '<p class="text-sm text-center py-4">Anda belum memiliki tabungan berjangka</p>'}
                </div>
            </div>
            
            <button id="buat-tabungan-berjangka" class="w-full bg-blue-500 text-white py-3 rounded-lg font-medium mt-4">
                Buat Tabungan Berjangka
            </button>
        </div>
    `;
    
    const modal = showModal(content, 'Tabungan Berjangka');
    
    modal.querySelector('#buat-tabungan-berjangka').addEventListener('click', function() {
        const formHTML = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Nama Tabungan</label>
                    <input type="text" id="deposit-name" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Contoh: Tabungan Pendidikan">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Target Jumlah</label>
                    <input type="number" id="deposit-target" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Rp">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Jangka Waktu (bulan)</label>
                    <input type="number" id="deposit-duration" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="12">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Setoran Per Bulan</label>
                    <input type="number" id="deposit-monthly" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Rp" readonly>
                </div>
                <button id="submit-deposit-plan" class="w-full bg-blue-500 text-white py-3 rounded-lg font-medium mt-4">
                    Buat Tabungan
                </button>
            </div>
        `;
        
        const subModal = showModal(formHTML, 'Buat Tabungan Berjangka');
        
        // Hitung setoran per bulan saat target atau durasi berubah
        subModal.querySelector('#deposit-target').addEventListener('input', calculateMonthlyDeposit);
        subModal.querySelector('#deposit-duration').addEventListener('input', calculateMonthlyDeposit);
        
        function calculateMonthlyDeposit() {
            const target = parseFloat(subModal.querySelector('#deposit-target').value);
            const duration = parseFloat(subModal.querySelector('#deposit-duration').value);
            
            if (target && duration) {
                const monthly = target / duration;
                subModal.querySelector('#deposit-monthly').value = monthly.toFixed(0);
            }
        }
        
        subModal.querySelector('#submit-deposit-plan').addEventListener('click', function() {
            const name = subModal.querySelector('#deposit-name').value;
            const target = parseFloat(subModal.querySelector('#deposit-target').value);
            const duration = parseFloat(subModal.querySelector('#deposit-duration').value);
            
            if (name && target && duration) {
                // Tambahkan ke data
                appData.savingsGoals.push({
                    id: appData.savingsGoals.length + 1,
                    name: name + ' (Berjangka)',
                    target: target,
                    saved: 0,
                    icon: 'calendar-alt',
                    color: 'blue'
                });
                
                // Update UI
                updateUI();
                
                // Tutup modal
                subModal.remove();
                modal.remove();
                
                showNotification('Tabungan berjangka berhasil dibuat!', 'success');
            } else {
                showNotification('Isi semua field dengan benar', 'error');
            }
        });
    });
}

// Fungsi untuk Dana Darurat
function showEmergencyFund() {
    const idealFund = 5000000; // Simulasi 5x pengeluaran bulanan
    const currentFund = 1500000; // Simulasi dana darurat saat ini
    
    const content = `
        <div class="space-y-4">
            <div class="text-center py-4">
                <i class="fas fa-first-aid text-4xl text-red-500 mb-2"></i>
                <h4 class="font-bold">Dana Darurat</h4>
                <p class="text-sm text-gray-500">Siapkan dana untuk keadaan tak terduga</p>
            </div>
            
            <div class="bg-red-50 p-4 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium">Progress Dana Darurat</span>
                    <span class="text-sm font-bold">${Math.round((currentFund / idealFund) * 100)}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-red-500 h-2 rounded-full" style="width: ${Math.min((currentFund / idealFund) * 100, 100)}%"></div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div class="bg-white p-3 rounded-lg text-center">
                        <p class="text-xs text-gray-500">Dana Saat Ini</p>
                        <p class="font-bold text-red-600">${formatMoney(currentFund)}</p>
                    </div>
                    <div class="bg-white p-3 rounded-lg text-center">
                        <p class="text-xs text-gray-500">Target Ideal</p>
                        <p class="font-bold">${formatMoney(idealFund)}</p>
                    </div>
                </div>
                
                <p class="text-xs text-gray-500 mt-4">* Dana darurat ideal adalah 5-6x pengeluaran bulanan Anda</p>
            </div>
            
            <button id="tambah-dana-darurat" class="w-full bg-red-500 text-white py-3 rounded-lg font-medium mt-4">
                Tambah Dana Darurat
            </button>
        </div>
    `;
    
    const modal = showModal(content, 'Dana Darurat');
    
    modal.querySelector('#tambah-dana-darurat').addEventListener('click', function() {
        showDepositForm();
        modal.remove();
    });
}

// Fungsi untuk Budgeting
function showBudgeting() {
    const categories = [
        { name: 'Makanan', budget: 1500000, spent: 1200000, color: 'red' },
        { name: 'Transportasi', budget: 500000, spent: 450000, color: 'blue' },
        { name: 'Hiburan', budget: 300000, spent: 250000, color: 'green' },
        { name: 'Tagihan', budget: 1000000, spent: 1000000, color: 'purple' }
    ];
    
    const content = `
        <div class="space-y-4">
            <div class="text-center py-4">
                <i class="fas fa-money-bill-wave text-4xl text-purple-500 mb-2"></i>
                <h4 class="font-bold">Budgeting</h4>
                <p class="text-sm text-gray-500">Kelola anggaran bulanan Anda</p>
            </div>
            
            <div class="space-y-3">
                ${categories.map(cat => {
                    const percentage = (cat.spent / cat.budget) * 100;
                    const colorClasses = {
                        red: 'bg-red-100 text-red-600',
                        blue: 'bg-blue-100 text-blue-600',
                        green: 'bg-green-100 text-green-600',
                        purple: 'bg-purple-100 text-purple-600'
                    };
                    
                    return `
                        <div class="p-3 border border-gray-200 rounded-lg">
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center">
                                    <div class="${colorClasses[cat.color]} w-8 h-8 rounded-full flex items-center justify-center mr-2">
                                        <i class="fas fa-${cat.name === 'Makanan' ? 'utensils' : 
                                          cat.name === 'Transportasi' ? 'bus' : 
                                          cat.name === 'Hiburan' ? 'gamepad' : 'file-invoice'} text-xs"></i>
                                    </div>
                                    <span class="font-medium">${cat.name}</span>
                                </div>
                                <span class="text-sm ${percentage > 90 ? 'text-red-500' : 'text-gray-500'}">
                                    ${formatMoney(cat.spent)} / ${formatMoney(cat.budget)}
                                </span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div class="h-2 rounded-full ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'}" 
                                     style="width: ${Math.min(percentage, 100)}%"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <button id="tambah-budget" class="w-full bg-purple-500 text-white py-3 rounded-lg font-medium mt-4">
                Tambah Kategori
            </button>
        </div>
    `;
    
    const modal = showModal(content, 'Budgeting');
    
    modal.querySelector('#tambah-budget').addEventListener('click', function() {
        const formHTML = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Nama Kategori</label>
                    <input type="text" id="category-name" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Contoh: Belanja">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Anggaran Bulanan</label>
                    <input type="number" id="category-budget" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Rp">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Warna Kategori</label>
                    <div class="grid grid-cols-4 gap-2 mt-2">
                        <button class="color-option bg-red-100 border-2 border-red-300 h-10 rounded-lg" data-color="red"></button>
                        <button class="color-option bg-blue-100 border-2 border-transparent h-10 rounded-lg" data-color="blue"></button>
                        <button class="color-option bg-green-100 border-2 border-transparent h-10 rounded-lg" data-color="green"></button>
                        <button class="color-option bg-purple-100 border-2 border-transparent h-10 rounded-lg" data-color="purple"></button>
                        <button class="color-option bg-yellow-100 border-2 border-transparent h-10 rounded-lg" data-color="yellow"></button>
                        <button class="color-option bg-pink-100 border-2 border-transparent h-10 rounded-lg" data-color="pink"></button>
                        <button class="color-option bg-indigo-100 border-2 border-transparent h-10 rounded-lg" data-color="indigo"></button>
                        <button class="color-option bg-gray-100 border-2 border-transparent h-10 rounded-lg" data-color="gray"></button>
                    </div>
                </div>
                <button id="submit-category" class="w-full bg-purple-500 text-white py-3 rounded-lg font-medium mt-4">
                    Simpan Kategori
                </button>
            </div>
        `;
        
        const subModal = showModal(formHTML, 'Tambah Kategori Budget');
        
        let selectedColor = 'red';
        subModal.querySelector('.color-option.bg-red-100').classList.add('border-red-300');
        
        subModal.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', function() {
                subModal.querySelectorAll('.color-option').forEach(opt => {
                    opt.classList.remove('border-red-300', 'border-blue-300', 'border-green-300', 
                                       'border-purple-300', 'border-yellow-300', 'border-pink-300', 
                                       'border-indigo-300', 'border-gray-300');
                });
                
                this.classList.add(`border-${this.dataset.color}-300`);
                selectedColor = this.dataset.color;
            });
        });
        
        subModal.querySelector('#submit-category').addEventListener('click', function() {
            const name = subModal.querySelector('#category-name').value;
            const budget = parseFloat(subModal.querySelector('#category-budget').value);
            
            if (name && budget) {
                // Dalam aplikasi nyata, ini akan menyimpan ke database
                showNotification(`Kategori ${name} berhasil ditambahkan!`, 'success');
                subModal.remove();
                modal.remove();
                showBudgeting(); // Refresh tampilan budgeting
            } else {
                showNotification('Isi semua field dengan benar', 'error');
            }
        });
    });
}

// Fungsi untuk Kalkulator
function showCalculator() {
    const content = `
        <div class="space-y-4">
            <div class="text-center py-4">
                <i class="fas fa-calculator text-4xl text-green-500 mb-2"></i>
                <h4 class="font-bold">Kalkulator Menabung</h4>
                <p class="text-sm text-gray-500">Hitung rencana menabung Anda</p>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Target Menabung</label>
                <input type="number" id="calc-target" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Rp">
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Jangka Waktu (bulan)</label>
                <input type="number" id="calc-duration" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="12">
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Bunga (% per tahun)</label>
                <input type="number" id="calc-interest" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="5">
            </div>
            
            <button id="calculate" class="w-full bg-green-500 text-white py-3 rounded-lg font-medium mt-4">
                Hitung
            </button>
            
            <div id="calc-result" class="hidden mt-6 p-4 bg-gray-50 rounded-lg space-y-2">
                <h5 class="font-bold mb-2">Hasil Perhitungan:</h5>
                <div class="flex justify-between">
                    <span>Setoran Bulanan:</span>
                    <span id="monthly-saving" class="font-bold">Rp 0</span>
                </div>
                <div class="flex justify-between">
                    <span>Total Bunga:</span>
                    <span id="total-interest" class="font-bold">Rp 0</span>
                </div>
                <div class="flex justify-between">
                    <span>Total Setoran:</span>
                    <span id="total-deposit" class="font-bold">Rp 0</span>
                </div>
                <div class="flex justify-between">
                    <span>Total Akhir:</span>
                    <span id="total-amount" class="font-bold text-green-600">Rp 0</span>
                </div>
            </div>
        </div>
    `;
    
    const modal = showModal(content, 'Kalkulator Menabung');
    
    modal.querySelector('#calculate').addEventListener('click', function() {
        const target = parseFloat(modal.querySelector('#calc-target').value);
        const duration = parseFloat(modal.querySelector('#calc-duration').value);
        const interest = parseFloat(modal.querySelector('#calc-interest').value);
        
        if (target && duration) {
            let monthlyPayment, totalInterest, totalDeposit, totalAmount;
            
            if (interest) {
                const monthlyInterest = interest / 100 / 12;
                monthlyPayment = target * monthlyInterest / (1 - Math.pow(1 + monthlyInterest, -duration));
                totalInterest = (monthlyPayment * duration) - target;
            } else {
                monthlyPayment = target / duration;
                totalInterest = 0;
            }
            
            totalDeposit = monthlyPayment * duration;
            totalAmount = target + totalInterest;
            
            modal.querySelector('#monthly-saving').textContent = formatMoney(monthlyPayment);
            modal.querySelector('#total-interest').textContent = formatMoney(totalInterest);
            modal.querySelector('#total-deposit').textContent = formatMoney(totalDeposit);
            modal.querySelector('#total-amount').textContent = formatMoney(totalAmount);
            modal.querySelector('#calc-result').classList.remove('hidden');
        } else {
            showNotification('Masukkan target dan jangka waktu', 'error');
        }
    });
}

// Fungsi untuk Tips Menabung
function showTips() {
    const tips = [
        {
            title: "Atur Budget dengan 50-30-20",
            content: "50% untuk kebutuhan, 30% untuk keinginan, dan 20% untuk tabungan/investasi.",
            icon: "percent",
            color: "blue"
        },
        {
            title: "Otomatiskan Tabungan",
            content: "Setel transfer otomatis ke rekening tabungan setiap gajian agar konsisten menabung.",
            icon: "robot",
            color: "green"
        },
        {
            title: "Mulai dari yang Kecil",
            content: "Menabung Rp 10.000/hari bisa menjadi Rp 3.6 juta dalam setahun!",
            icon: "coins",
            color: "yellow"
        },
        {
            title: "Pisahkan Rekening",
            content: "Buat rekening terpisah khusus untuk tabungan agar tidak tergoda menggunakan.",
            icon: "wallet",
            color: "purple"
        },
        {
            title: "Catat Pengeluaran",
            content: "Mencatat semua pengeluaran membantu mengidentifikasi kebocoran anggaran.",
            icon: "book",
            color: "red"
        }
    ];
    
    const content = `
        <div class="space-y-4">
            <div class="text-center py-4">
                <i class="fas fa-lightbulb text-4xl text-yellow-500 mb-2"></i>
                <h4 class="font-bold">Tips & Trik Menabung</h4>
                <p class="text-sm text-gray-500">Strategi untuk mencapai tujuan finansial</p>
            </div>
            
            <div class="space-y-3">
                ${tips.map((tip, index) => `
                    <div class="p-4 bg-${tip.color}-50 rounded-lg border-l-4 border-${tip.color}-500">
                        <div class="flex items-start">
                            <div class="bg-${tip.color}-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                <i class="fas fa-${tip.icon} text-${tip.color}-600"></i>
                            </div>
                            <div>
                                <h5 class="font-bold">${tip.title}</h5>
                                <p class="text-sm mt-1">${tip.content}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    showModal(content, 'Tips Menabung');
}

// Fungsi untuk Pengaturan
function showSettings() {
    const content = `
        <div class="space-y-4">
            <div class="text-center py-4">
                <i class="fas fa-cog text-4xl text-gray-500 mb-2"></i>
                <h4 class="font-bold">Pengaturan Aplikasi</h4>
                <p class="text-sm text-gray-500">Personalisasi pengalaman Anda</p>
            </div>
            
            <div class="space-y-2">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                        <i class="fas fa-bell text-primary mr-3"></i>
                        <span>Notifikasi</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" class="sr-only peer" checked>
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                        <i class="fas fa-moon text-primary mr-3"></i>
                        <span>Mode Gelap</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                        <i class="fas fa-fingerprint text-primary mr-3"></i>
                        <span>Login dengan Sidik Jari</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
            
            <button id="logout" class="w-full bg-red-500 text-white py-3 rounded-lg font-medium mt-6">
                Keluar dari Aplikasi
            </button>
        </div>
    `;
    
    const modal = showModal(content, 'Pengaturan');
    
    modal.querySelector('#logout').addEventListener('click', function() {
        showNotification('Anda telah keluar dari aplikasi', 'info');
        modal.remove();
    });
}

// Fungsi untuk Keamanan
function showSecurity() {
    const content = `
        <div class="space-y-4">
            <div class="text-center py-4">
                <i class="fas fa-shield-alt text-4xl text-primary mb-2"></i>
                <h4 class="font-bold">Keamanan Akun</h4>
                <p class="text-sm text-gray-500">Lindungi akun dan data Anda</p>
            </div>
            
            <div class="space-y-3">
                <div class="p-4 bg-gray-50 rounded-lg">
                    <h5 class="font-bold mb-2">PIN Transaksi</h5>
                    <p class="text-sm">Atur PIN untuk mengamankan setiap transaksi</p>
                    <button id="set-pin" class="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium mt-3">
                        Atur PIN
                    </button>
                </div>
                
                <div class="p-4 bg-gray-50 rounded-lg">
                    <h5 class="font-bold mb-2">Verifikasi 2 Langkah</h5>
                    <p class="text-sm">Tambahkan lapisan keamanan ekstra dengan OTP</p>
                    <button id="set-2fa" class="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium mt-3">
                        Aktifkan
                    </button>
                </div>
                
                <div class="p-4 bg-gray-50 rounded-lg">
                    <h5 class="font-bold mb-2">Ganti Password</h5>
                    <p class="text-sm">Perbarui password akun Anda secara berkala</p>
                    <button id="change-password" class="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium mt-3">
                        Ganti Password
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const modal = showModal(content, 'Keamanan');
    
    modal.querySelector('#set-pin').addEventListener('click', function() {
        showSetPinForm();
        modal.remove();
    });
    
    modal.querySelector('#set-2fa').addEventListener('click', function() {
        showNotification('Verifikasi 2 langkah berhasil diaktifkan', 'success');
    });
    
    modal.querySelector('#change-password').addEventListener('click', function() {
        showChangePasswordForm();
        modal.remove();
    });
}

// Fungsi untuk Atur PIN
function showSetPinForm() {
    const content = `
        <div class="space-y-4">
            <div class="text-center py-4">
                <i class="fas fa-lock text-4xl text-primary mb-2"></i>
                <h4 class="font-bold">Atur PIN Transaksi</h4>
                <p class="text-sm text-gray-500">Masukkan 6 digit PIN baru</p>
            </div>
            
            <div class="flex justify-center space-x-2 mb-6">
                <input type="password" maxlength="1" class="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl" pattern="[0-9]">
                <input type="password" maxlength="1" class="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl" pattern="[0-9]">
                <input type="password" maxlength="1" class="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl" pattern="[0-9]">
                <input type="password" maxlength="1" class="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl" pattern="[0-9]">
                <input type="password" maxlength="1" class="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl" pattern="[0-9]">
                <input type="password" maxlength="1" class="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl" pattern="[0-9]">
            </div>
            
            <button id="submit-pin" class="w-full bg-primary text-white py-3 rounded-lg font-medium">
                Simpan PIN
            </button>
        </div>
    `;
    
    const modal = showModal(content, 'Atur PIN');
    
    // Auto focus dan navigasi antar input PIN
    const pinInputs = modal.querySelectorAll('input[type="password"]');
    pinInputs[0].focus();
    
    pinInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1) {
                if (index < pinInputs.length - 1) {
                    pinInputs[index + 1].focus();
                } else {
                    this.blur();
                }
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                pinInputs[index - 1].focus();
            }
        });
    });
    
    modal.querySelector('#submit-pin').addEventListener('click', function() {
        let pin = '';
        pinInputs.forEach(input => {
            pin += input.value;
        });
        
        if (pin.length === 6) {
            showNotification('PIN berhasil disimpan', 'success');
            modal.remove();
        } else {
            showNotification('Masukkan 6 digit PIN', 'error');
        }
    });
}

// Fungsi untuk Ganti Password
function showChangePasswordForm() {
    const content = `
        <div class="space-y-4">
            <div class="text-center py-4">
                <i class="fas fa-key text-4xl text-primary mb-2"></i>
                <h4 class="font-bold">Ganti Password</h4>
                <p class="text-sm text-gray-500">Pastikan password baru Anda kuat</p>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Password Lama</label>
                <input type="password" id="old-password" class="w-full p-3 border border-gray-300 rounded-lg">
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Password Baru</label>
                <input type="password" id="new-password" class="w-full p-3 border border-gray-300 rounded-lg">
                <p class="text-xs text-gray-500 mt-1">Minimal 8 karakter, kombinasi huruf dan angka</p>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Konfirmasi Password Baru</label>
                <input type="password" id="confirm-password" class="w-full p-3 border border-gray-300 rounded-lg">
            </div>
            
            <button id="submit-password" class="w-full bg-primary text-white py-3 rounded-lg font-medium mt-4">
                Ganti Password
            </button>
        </div>
    `;
    
    const modal = showModal(content, 'Ganti Password');
    
    modal.querySelector('#submit-password').addEventListener('click', function() {
        const oldPass = modal.querySelector('#old-password').value;
        const newPass = modal.querySelector('#new-password').value;
        const confirmPass = modal.querySelector('#confirm-password').value;
        
        if (!oldPass || !newPass || !confirmPass) {
            showNotification('Harap isi semua field', 'error');
            return;
        }
        
        if (newPass !== confirmPass) {
            showNotification('Password baru tidak cocok', 'error');
            return;
        }
        
        if (newPass.length < 8) {
            showNotification('Password minimal 8 karakter', 'error');
            return;
        }
        
        // Simulasi ganti password berhasil
        showNotification('Password berhasil diubah', 'success');
        modal.remove();
    });
}

// Fungsi untuk Bantuan
function showHelp() {
    const faqs = [
        {
            question: "Bagaimana cara menambahkan target menabung?",
            answer: "Pergi ke menu Target Menabung dan klik tombol 'Tambah Target'. Isi detail target Anda dan simpan."
        },
        {
            question: "Apakah ada biaya untuk menggunakan aplikasi ini?",
            answer: "Tidak, aplikasi ini sepenuhnya gratis tanpa biaya tersembunyi."
        },
        {
            question: "Bagaimana jika saya lupa PIN?",
            answer: "Anda bisa reset PIN melalui menu Keamanan dengan verifikasi email dan nomor telepon."
        },
        {
            question: "Bagaimana cara menarik dana dari tabungan?",
            answer: "Pergi ke menu Transfer dan pilih rekening tujuan. Masukkan jumlah yang ingin ditarik."
        }
    ];
    
    const content = `
        <div class="space-y-4">
            <div class="text-center py-4">
                <i class="fas fa-question-circle text-4xl text-primary mb-2"></i>
                <h4 class="font-bold">Pusat Bantuan</h4>
                <p class="text-sm text-gray-500">Temukan jawaban untuk pertanyaan umum</p>
            </div>
            
            <div class="space-y-3">
                ${faqs.map((faq, index) => `
                    <div class="border border-gray-200 rounded-lg overflow-hidden">
                        <button class="faq-toggle w-full flex justify-between items-center p-4 bg-gray-50">
                            <span class="font-medium text-left">${faq.question}</span>
                            <i class="fas fa-chevron-down text-gray-400 transition-transform"></i>
                        </button>
                        <div class="faq-content hidden p-4 text-sm">
                            <p>${faq.answer}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="mt-6">
                <h5 class="font-bold mb-2">Butuh bantuan lebih lanjut?</h5>
                <button id="contact-support" class="w-full border border-primary text-primary py-3 rounded-lg font-medium">
                    Hubungi Customer Service
                </button>
            </div>
        </div>
    `;
    
    const modal = showModal(content, 'Bantuan');
    
    // Toggle FAQ
    modal.querySelectorAll('.faq-toggle').forEach((toggle, index) => {
        toggle.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                content.classList.add('hidden');
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
    
    modal.querySelector('#contact-support').addEventListener('click', function() {
        showNotification('Customer service akan menghubungi Anda', 'info');
    });
}

// Fungsi untuk Tentang Kami
function showAbout() {
    const content = `
        <div class="space-y-4">
            <div class="text-center py-4">
                <i class="fas fa-info-circle text-4xl text-primary mb-2"></i>
                <h4 class="font-bold">Tentang Tabungin</h4>
                <p class="text-sm text-gray-500">Versi 1.0.0</p>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm mb-3">Tabungin adalah aplikasi menabung digital yang membantu Anda mencapai tujuan finansial dengan lebih mudah dan terencana.</p>
                <p class="text-sm">Dengan berbagai fitur seperti target menabung, kalkulator, dan tips finansial, kami berkomitmen untuk membantu meningkatkan literasi keuangan masyarakat Indonesia.</p>
            </div>
            
            <div class="space-y-3 mt-4">
                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                    <i class="fas fa-globe text-primary mr-3"></i>
                    <span>www.tabungin.com</span>
                </div>
                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                    <i class="fas fa-envelope text-primary mr-3"></i>
                    <span>hello@tabungin.com</span>
                </div>
                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                    <i class="fas fa-phone text-primary mr-3"></i>
                    <span>+62 21 1234 5678</span>
                </div>
            </div>
            
            <div class="mt-6 text-center text-xs text-gray-500">
                <p>&copy; 2023 Tabungin. All rights reserved.</p>
            </div>
        </div>
    `;
    
    showModal(content, 'Tentang Kami');
}

// Fungsi untuk Detail Target
function showGoalDetail(goal) {
    const progress = (goal.saved / goal.target) * 100;
    const remaining = goal.target - goal.saved;
    const monthsToGo = Math.ceil(remaining / (goal.saved / 3)); // Simulasi: asumsi sudah menabung selama 3 bulan
    
    const content = `
        <div class="space-y-4">
            <div class="text-center py-4">
                <div class="w-16 h-16 ${goal.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : 
                  goal.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'} 
                  rounded-full flex items-center justify-center mx-auto mb-2">
                    <i class="fas fa-${goal.icon} text-xl"></i>
                </div>
                <h4 class="font-bold">${goal.name}</h4>
                <p class="text-sm text-gray-500">${progress.toFixed(0)}% tercapai</p>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-sm">Terkumpul:</span>
                    <span class="font-bold">${formatMoney(goal.saved)}</span>
                </div>
                <div class="flex justify-between items-center mb-1">
                    <span class="text-sm">Target:</span>
                    <span class="font-bold">${formatMoney(goal.target)}</span>
                </div>
                <div class="flex justify-between items-center mb-3">
                    <span class="text-sm">Kekurangan:</span>
                    <span class="font-bold text-red-600">${formatMoney(remaining)}</span>
                </div>
                
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-primary h-2 rounded-full" style="width: ${progress}%"></div>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-white border border-gray-200 p-3 rounded-lg text-center">
                    <p class="text-xs text-gray-500">Perkiraan Tercapai</p>
                    <p class="font-bold">${monthsToGo} bulan lagi</p>
                </div>
                <div class="bg-white border border-gray-200 p-3 rounded-lg text-center">
                    <p class="text-xs text-gray-500">Setoran Bulanan</p>
                    <p class="font-bold">${formatMoney(goal.saved / 3)}</p>
                </div>
            </div>
            
            <button id="add-to-goal" class="w-full bg-primary text-white py-3 rounded-lg font-medium mt-4">
                Tambahkan Dana
            </button>
            
            <button id="delete-goal" class="w-full border border-red-500 text-red-500 py-3 rounded-lg font-medium">
                Hapus Target
            </button>
        </div>
    `;
    
    const modal = showModal(content, 'Detail Target');
    
    modal.querySelector('#add-to-goal').addEventListener('click', function() {
        showDepositForm();
        modal.remove();
    });
    
    modal.querySelector('#delete-goal').addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin menghapus target ini?')) {
            appData.savingsGoals = appData.savingsGoals.filter(g => g.id !== goal.id);
            updateUI();
            modal.remove();
            showNotification('Target berhasil dihapus', 'success');
        }
    });
}

// Fungsi untuk Form Tambah Target
function showAddGoalForm() {
    const icons = [
        { name: 'HP Baru', icon: 'mobile-alt', color: 'yellow' },
        { name: 'Liburan', icon: 'plane', color: 'blue' },
        { name: 'Rumah', icon: 'home', color: 'green' },
        { name: 'Kendaraan', icon: 'car', color: 'red' },
        { name: 'Pendidikan', icon: 'graduation-cap', color: 'purple' },
        { name: 'Lainnya', icon: 'piggy-bank', color: 'gray' }
    ];
    
    const content = `
        <div class="space-y-4">
            <div class="text-center py-4">
                <i class="fas fa-bullseye text-4xl text-primary mb-2"></i>
                <h4 class="font-bold">Buat Target Baru</h4>
                <p class="text-sm text-gray-500">Tetapkan tujuan menabung Anda</p>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Nama Target</label>
                <input type="text" id="goal-name" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Contoh: Beli Laptop">
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Target Jumlah</label>
                <input type="number" id="goal-target" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Rp">
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-1">Ikon Target</label>
                <div class="grid grid-cols-3 gap-3 mt-2">
                    ${icons.map(icon => `
                        <button class="goal-icon flex flex-col items-center p-2 border rounded-lg" data-icon="${icon.icon}" data-color="${icon.color}">
                            <div class="w-10 h-10 ${icon.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : 
                              icon.color === 'blue' ? 'bg-blue-100 text-blue-600' : 
                              icon.color === 'green' ? 'bg-green-100 text-green-600' : 
                              icon.color === 'red' ? 'bg-red-100 text-red-600' : 
                              icon.color === 'purple' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'} 
                              rounded-full flex items-center justify-center mb-1">
                                <i class="fas fa-${icon.icon}"></i>
                            </div>
                            <span class="text-xs">${icon.name}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <button id="submit-goal" class="w-full bg-primary text-white py-3 rounded-lg font-medium mt-4">
                Buat Target
            </button>
        </div>
    `;
    
    const modal = showModal(content, 'Tambah Target');
    
    let selectedIcon = 'piggy-bank';
    let selectedColor = 'gray';
    
    modal.querySelectorAll('.goal-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            modal.querySelectorAll('.goal-icon').forEach(i => {
                i.classList.remove('border-primary', 'border-2');
                i.classList.add('border-gray-200');
            });
            
            this.classList.remove('border-gray-200');
            this.classList.add('border-primary', 'border-2');
            
            selectedIcon = this.dataset.icon;
            selectedColor = this.dataset.color;
        });
    });
    
    modal.querySelector('#submit-goal').addEventListener('click', function() {
        const name = modal.querySelector('#goal-name').value;
        const target = parseFloat(modal.querySelector('#goal-target').value);
        
        if (name && target) {
            // Tambahkan ke data
            appData.savingsGoals.push({
                id: appData.savingsGoals.length + 1,
                name: name,
                target: target,
                saved: 0,
                icon: selectedIcon,
                color: selectedColor
            });
            
            // Update UI
            updateUI();
            
            // Tutup modal
            modal.remove();
            
            showNotification('Target berhasil dibuat!', 'success');
        } else {
            showNotification('Isi nama dan target dengan benar', 'error');
        }
    });
}

// Fungsi untuk Detail Transaksi
function showTransactionDetail(transaction) {
    const isDeposit = transaction.type === 'deposit';
    
    const content = `
        <div class="space-y-4">
            <div class="text-center py-4">
                <div class="w-16 h-16 ${isDeposit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} rounded-full flex items-center justify-center mx-auto mb-2">
                    <i class="fas fa-${isDeposit ? 'arrow-down' : 'arrow-up'} text-xl"></i>
                </div>
                <h4 class="font-bold">${transaction.description}</h4>
                <p class="text-sm text-gray-500">${transaction.date}</p>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg space-y-3">
                <div class="flex justify-between">
                    <span class="text-gray-500">Jumlah:</span>
                    <span class="font-bold ${isDeposit ? 'text-green-600' : 'text-red-600'}">${isDeposit ? '+' : '-'}${formatMoney(transaction.amount)}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Status:</span>
                    <span class="font-bold text-primary">Berhasil</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Saldo Akhir:</span>
                    <span class="font-bold">${formatMoney(appData.balance)}</span>
                </div>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg">
                <h5 class="font-bold mb-2">Detail Transaksi</h5>
                <div class="flex justify-between text-sm py-1">
                    <span class="text-gray-500">ID Transaksi:</span>
                    <span>TRX${transaction.id.toString().padStart(6, '0')}</span>
                </div>
                <div class="flex justify-between text-sm py-1">
                    <span class="text-gray-500">Waktu:</span>
                    <span>${transaction.date}, ${new Date().toLocaleTimeString('id-ID')}</span>
                </div>
                <div class="flex justify-between text-sm py-1">
                    <span class="text-gray-500">Metode:</span>
                    <span>${isDeposit ? 'Top Up' : 'Transfer'}</span>
                </div>
            </div>
            
            <button id="close-detail" class="w-full bg-primary text-white py-3 rounded-lg font-medium mt-4">
                Tutup
            </button>
        </div>
    `;
    
    const modal = showModal(content, 'Detail Transaksi');
    
    modal.querySelector('#close-detail').addEventListener('click', function() {
        modal.remove();
    });
    
}