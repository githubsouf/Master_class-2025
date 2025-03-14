import React, { useState, useRef } from "react";
import { Copy, Users, Upload, CheckCircle, CircleDollarSign, ChevronRight } from "lucide-react";
import { db } from "../firebaseConfig"; // ✅ Import Firestore
import { collection, addDoc } from "firebase/firestore"; // ✅ Firestore Methods

const API_KEY = "d6f7a6c356a8e345adfb6f50dace807f"; // ✅ ImgBB API Key

function App() {
  const [fullName, setFullName] = useState("");
  const [secure24h, setSecure24h] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert("Failed to copy link");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!fullName || !selectedFile) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    setIsUploading(true);

    try {
      // 🔹 Step 1: Upload Image to ImgBB
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const imageUrl = data.data.url; // ✅ Extract image URL

      // 🔹 Step 2: Save Data to Firestore
      await addDoc(collection(db, "registrations"), {
        fullName: fullName, // ✅ Store full name
        proof: imageUrl, // ✅ Store proof of payment
        secure24h: secure24h, // ✅ Store Secure24h as true/false
        timestamp: new Date(),
      });

      alert("Données enregistrées avec succès !");
      setFullName("");
      setSelectedFile(null);
      setSecure24h(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Échec de l'enregistrement !");
    }

    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header Section */}
      <header className="text-center mb-12">
        <CircleDollarSign className="w-16 h-16 mx-auto mb-6 text-blue-500" />
        <h1 className="text-2xl md:text-4xl font-bold mb-2">MASTERCLASS SESSION 2025</h1>
        <p className="text-xl md:text-3xl mb-6">L'ASSEMBLÉE DES CRÉATEURS DE RICHESSE</p>
        <button className="bg-[#005eff] text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors">
          SÉCURISE TON ACCÈS
        </button>
      </header>

      {/* Main Checkout Section */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 shadow-xl mb-8">
          {/* Copy Link Section */}
          <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg mb-6">
            <p className="text-sm md:text-base">Copiez le lien pour revenir plus tard !</p>
            <button onClick={handleCopyLink} className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
              <Copy className="w-4 h-4 mr-2" />
              {copySuccess ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-sm">1.2K Visitors on sécuriser</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-400">44</p>
              <p className="text-sm">Places disponible</p>
            </div>
          </div>

          {/* Payment Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2">Nom Prénom</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="secure24h"
                checked={secure24h}
                onChange={(e) => setSecure24h(e.target.checked)}
                className="w-4 h-4 text-blue-500"
              />
              <label htmlFor="secure24h" className="text-sm">
                Sécuriser ma place durant 24h (same price), tomorrow +2000 CFA
              </label>
            </div>

            <div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-700 transition-colors"
              >
                <Upload className="w-5 h-5 text-blue-400" />
                <span>{selectedFile ? selectedFile.name : "Upload Proof of Payment"}</span>
              </button>
            </div>

            {selectedFile && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-green-400 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Screenshot uploaded successfully
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#005eff] text-white py-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              disabled={isUploading}
            >
              <span>{isUploading ? "Uploading..." : "J'ai payé"}</span>
              <CheckCircle className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
