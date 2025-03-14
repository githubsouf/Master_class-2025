import React, { useState, useEffect, useRef } from "react";
import { Copy, Users, Upload, CheckCircle, CircleDollarSign, ChevronRight, Phone } from "lucide-react";
import { db } from "../firebaseConfig"; // ✅ Import Firestore
import { collection, addDoc } from "firebase/firestore"; // ✅ Firestore Methods
import { motion, animate } from "framer-motion"; // 🎰 For animated number effects


const API_KEY = "d6f7a6c356a8e345adfb6f50dace807f"; // ✅ ImgBB API Key

function App() {
  const [fullName, setFullName] = useState("");
  const [secure24h, setSecure24h] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  // 🌟 Dynamic Visitors & Available Spots
  const [visitors, setVisitors] = useState(202);
  const [spots, setSpots] = useState(44);
  const [initialAnimation, setInitialAnimation] = useState(true);

    // For smooth animation
    const visitorRef = useRef<HTMLSpanElement | null>(null);
    const spotsRef = useRef<HTMLSpanElement | null>(null);

  // Get User's IP for Keeping Numbers Consistent
  useEffect(() => {
    const storedVisitors = localStorage.getItem("visitorsCount");
    const storedSpots = localStorage.getItem("spotsCount");

    if (storedVisitors && storedSpots) {
      setVisitors(parseInt(storedVisitors));
      setSpots(parseInt(storedSpots));
      setInitialAnimation(false);
    } else {
      setInitialAnimation(true);
      setVisitors(202);
      setSpots(44);
    }
  }, []);

  // Increment Visitors, Decrement Available Spots Slowly
  useEffect(() => {
    const updateNumbers = () => {
      setVisitors((prev) => Math.min(prev + 1, 233)); // Max 233 Visitors
      setSpots((prev) => Math.max(prev - 1, 10)); // Min 10 Spots Left
      localStorage.setItem("visitorsCount", visitors.toString());
      localStorage.setItem("spotsCount", spots.toString());
  
      // 🎰 Trigger animation on update
      animate(visitorRef.current, { y: [-10, 0], opacity: [0.5, 1] }, { duration: 0.5 });
      animate(spotsRef.current, { y: [-10, 0], opacity: [0.5, 1] }, { duration: 0.5 });
  
      // Set a random interval between 2 and 9 seconds
      const randomDelay = Math.floor(Math.random() * (9000 - 2000 + 1)) + 2000;
      setTimeout(updateNumbers, randomDelay);
    };
  
    // Start the first update
    const initialDelay = Math.floor(Math.random() * (9000 - 2000 + 1)) + 2000;
    const timeoutId = setTimeout(updateNumbers, initialDelay);
  
    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, [visitors, spots]);
  
  // Initial Animation from 0 to Value
  useEffect(() => {
    if (initialAnimation) {
      animate(0, 202, {
        duration: 2,
        onUpdate: (latest) => setVisitors(Math.floor(latest)),
      });
      animate(50, 44, {
        duration: 2,
        onUpdate: (latest) => setSpots(Math.floor(latest)),
      });
    }
  }, [initialAnimation]);

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
  const handleCallPayment = () => {
    window.location.href = 'tel:+212650069930';
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

         {/* 🎰 Dynamic Animated Stats Section */}
         <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <motion.span
                ref={visitorRef}
                className="text-2xl font-bold text-blue-400"
              >
                {visitors}
              </motion.span>
              <p className="text-sm">Visitors on sécuriser</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />

              <motion.span
                ref={spotsRef}
                className="text-2xl font-bold text-blue-400"
              >
                {spots}
              </motion.span>
              <p className="text-sm">Places disponibles</p>
            </div>
          </div>
             {/* Payment Options */}
             <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleCallPayment}
                className="group relative bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105"
              >
                <img 
                  src="https://i.ibb.co/27cgvg6f/airtel-wite.jpg" 
                  alt="Airtel Money" 
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center text-white">
                    <Phone className="w-5 h-5 mr-2" />
                    <span>+212650069930</span>
                  </div>
                </div>
              </button>
              <button 
                onClick={handleCallPayment}
                className="group relative bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105"
              >
                <img 
                  src="https://i.ibb.co/rf7Gg8DQ/airtel-red.jpg" 
                  alt="Airtel Money" 
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center text-white">
                    <Phone className="w-5 h-5 mr-2" />
                    <span>+212650069930</span>
                  </div>
                </div>
              </button>
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

            <div className="flex flex-col space-y-2">
  <label htmlFor="secure24h" className="text-sm font-medium">
    Sécuriser ma place :
  </label>
  <select
    id="secure24h"
    value={secure24h ? "24h" : "tomorrow"}
    onChange={(e) => setSecure24h(e.target.value === "24h")}
    className="w-full bg-gray-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  >
    <option value="tomorrow">Demain +2000 CFA</option>
    <option value="24h">Sécuriser ma place durant 24h (même prix)</option>
    
  </select>
</div>


            <div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-700 transition-colors"
              >
                <Upload className="w-5 h-5 text-blue-400" />
                <span>{selectedFile ? selectedFile.name : "Télécharger reçu de paiement"}</span>
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
