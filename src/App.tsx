import React, { useState, useEffect, useRef } from "react";
import { Copy, Users,Play, Upload, CheckCircle, CircleDollarSign, ChevronRight, Phone, Star } from "lucide-react";
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
      window.location.href = "https://bcmgroupe.youcan.store/products/clarus-payment-ga-copy";
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
          {/* Reviews Section */}
        <div className="bg-gray-900 rounded-2xl p-6 md:p-8 shadow-xl mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            What Others Say
            <div className="flex ml-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </h2>

          {/* Featured Video Review */}
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden aspect-video mb-4">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://youtu.be/ki5A25zAb2k"
                title="Featured Review"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-sm text-gray-300">
              "Watch how this masterclass transformed my business approach completely!"
            </p>
          </div>

          {/* Image Reviews Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="relative group rounded-lg overflow-hidden">
              <img
                src="https://i.ibb.co/XZHF4YRr/certif.jpg"
                alt="Success Story 1"
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-center p-2">"Certification de très haut niveau 💯 "</p>
              </div>
            </div>
            <div className="relative group rounded-lg overflow-hidden">
              <img
                src="https://i.ibb.co/bjKMHDMp/ressources.jpg"
                alt="Success Story 2"
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-center p-2">"Apprentissage facile et outils avancés 💡🚀"</p>
              </div>
            </div>
            <div className="relative group rounded-lg overflow-hidden">
              <img
                src="https://i.ibb.co/R4pB6DcB/reveneue.jpg"
                alt="Success Story 3"
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-center p-2">"Résultats garantis ✅🔥"</p>
              </div>
            </div>
          </div>
           {/* Local Video Review */}
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden aspect-video mb-4 bg-gray-800">
              <video
                className="w-full h-full"
                controls
                poster="https://i.ibb.co/cS044m8C/image.png"
              >
                <source
                  src="https://streamable.com/wl126d?src=player-page-share"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-300">
              <p>"Direct testimonial from our most successful student"</p>
              <div className="flex items-center">
                <Play className="w-4 h-4 mr-1 text-blue-400" />
                <span>Local Review</span>
              </div>
            </div>
          </div>
           {/* Image + Text Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-video">
                <img
                  src="https://i.ibb.co/MxK1tr2t/i-Pymyj24-QRSg-Dobq-Jqf3-GGu-Cczb-ADg-NZfb-Py-Usp-O.jpg"
                  alt="Success Story 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Lamine Mba
                </h3>
                <p className="text-gray-300 text-sm">
"Grâce à cette MasterClass, j’ai pu tester un marché en mettant à profit ma créativité. Je voulais appliquer ce que j’ai appris dans un marché anglophone en Afrique, et aujourd’hui, grâce à mon introduction à la vente digitale, avec tous ses fondamentaux, de la pratique et de la persévérance, je parviens à vendre depuis le Gabon en exploitant mes compétences acquises.

"                </p>
                <div className="flex items-center mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-video">
                <img
                  src="https://i.ibb.co/vxhKVxrZ/y-OGt0-Hl-MEH9r-Fl-ERY2yzww-EPJm-J7yf-ZOR8t-R2-Ha-E.jpg"
                  alt="Success Story 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Bryan Ekoume
                </h3>
                <p className="text-gray-300 text-sm">
"Mes nouveaux clients, et c’est juste le début ! Merci BlackMountain pour cette opportunité. 💼🇬🇦


"                </p>
                <div className="flex items-center mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-video">
                <img
                  src="https://i.ibb.co/Y7C8H36h/k-Zj-Q07-AWVJQR7dc-PZm1-QWSK8p-Ssj-Uns9-TZs-Uc-Ti-N.jpg"
                  alt="Success Story 3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Koffi N'Da
                </h3>
                <p className="text-gray-300 text-sm">
'Dieu merci, j’étais parmi les premiers à l’acheter quand c’était à 21,000 CFA ! 🙌 Mais avec les résultats des élèves, je ne pense pas que le prix va rester le même. 🔥💯


C’est un immense honneur d’être un témoin de ce programme ! 🙏📢


'                </p>
                <div className="flex items-center mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-video">
                <img
                  src="https://i.ibb.co/b5DpxBGY/TUame-Blk0mx5jp-Ysxjw7-Ff-Qtxe-BYyr-N9-CFm-V8g-EX.jpg"
                  alt="Success Story 4"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Arsène Sylla                </h3>
                <p className="text-gray-300 text-sm">
"J’ai testé le marché guinéen, et aucune déception ! ✅ Mais maintenant, je dois me déplacer pour investir mon produit dans ce marché.

Je sais que BlackMountain a mentionné quelque part une prochaine MasterClass e-commerce pour toute l’Afrique. D’ailleurs, quand j’ai pris contact avec un collègue qui a bénéficié d’une consultation personnalisée, il m’a expliqué qu’ils ont des warehouses partout en Afrique, ce qui peut vraiment faciliter les choses !

Heureusement, je peux travailler depuis le Gabon et exploiter ces opportunités. "                </p>
                <div className="flex items-center mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
   
          {/* Text Reviews */}
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="font-bold">LM</span>
                </div>
                <div>
                  <p className="font-semibold">Matteo Fares</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300">"Avec ce certificat, j’ai gagné confiance et acquis le savoir-faire nécessaire pour travailler avec des agences, commerçants et entreprises afin de gérer leur publicité et maximiser leurs ventes ! 🇬🇦"</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
                  <span className="font-bold">SB</span>
                </div>
                <div>
                  <p className="font-semibold">Seydou Bamba
                  </p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300">"Depuis l’arrivée de 2024, c’est notre essor vers la félicité ! Vraiment, votre MasterClass devrait être dans le domaine de l’e-commerce, mais je comprends… Avec toutes les ventes que tous les domaines peuvent générer, c’est un excellent choix en tout cas ! 🙌🔥

Merciii, j’attends vos prochaines MasterClass avec impatience ! 🚀🇬🇦


Avis "</p>
            </div>
          </div>
        </div>

        </div>
      </div>
    </div>
    
  );
}

export default App;
