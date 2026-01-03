import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: あなたのFirebaseコンソールからコピーした設定をここに貼り付けてください
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function scanNFC() {
    if ("NDEFReader" in window) {
        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            
            ndef.onreading = async (event) => {
                const serialNumber = event.serialNumber;
                document.getElementById("message").innerText = "読み取り成功！保存中...";

                try {
                    // Firebaseにデータを追加
                    await addDoc(collection(db, "attendance"), {
                        tagId: serialNumber,
                        timestamp: serverTimestamp(),
                        deviceName: "iPad-Web-App"
                    });
                    document.getElementById("message").innerText = `出席完了: ${serialNumber}`;
                } catch (e) {
                    console.error("Firebase Error: ", e);
                }
            };
        } catch (error) {
            console.log(`エラー: ${error}`);
        }
    } else {
        alert("このブラウザはNFC読み取りに対応していません（Android Chrome等が必要です）");
    }
}

// ページ読み込み時にスキャン開始
window.onload = scanNFC;
