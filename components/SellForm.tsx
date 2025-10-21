import React, { useState, useCallback, useRef } from 'react';
import { Motorcycle, Part, MotorcycleCategory } from '../types';
import { generateAdDescription } from '../services/geminiService';
import Spinner from './Spinner';
import { UploadIcon, TrashIcon, PlayIcon } from './Icons';

interface SellFormProps {
  onBack: () => void;
  onPublish: (
    data: Omit<Motorcycle, 'id' | 'sellerEmail' | 'status'> | Omit<Part, 'id' | 'sellerEmail' | 'status'>,
    type: 'motorcycle' | 'part'
  ) => void;
}

const motorcycleData: { [make: string]: string[] } = {
    'Aprilia': ['RS 660', 'Tuono 660', 'RSV4', 'Tuono V4'],
    'BMW': ['S1000RR', 'R1250GS', 'F900R', 'G310R', 'R 18', 'M 1000 R'],
    'Ducati': ['Panigale V4', 'Panigale V2', 'Streetfighter V4', 'Monster', 'Scrambler', 'Multistrada V4', 'Diavel V4'],
    'Harley-Davidson': ['Sportster Iron 883', 'Street Bob', 'Fat Boy', 'Road Glide', 'Pan America', 'Low Rider S'],
    'Honda': ['CBR1000RR-R', 'CB650R', 'CRF450R', 'Africa Twin', 'Rebel 500', 'Gold Wing', 'CB500X'],
    'Indian': ['FTR 1200', 'Scout Bobber', 'Chieftain', 'Springfield', 'Challenger'],
    'Kawasaki': ['Ninja ZX-10R', 'Ninja 400', 'Z900', 'Z650', 'Vulcan S', 'Versys 650', 'H2'],
    'KTM': ['1290 Super Duke R', '890 Duke R', '390 Adventure', '450 SX-F', '790 Adventure'],
    'MV Agusta': ['F3', 'Brutale', 'Dragster', 'Turismo Veloce', 'Superveloce'],
    'Royal Enfield': ['Classic 350', 'Himalayan', 'Interceptor 650', 'Meteor 350', 'Continental GT 650'],
    'Suzuki': ['GSX-R1000', 'SV650', 'V-Strom 650', 'DR-Z400SM', 'Hayabusa', 'Katana'],
    'Triumph': ['Street Triple RS', 'Speed Triple 1200 RS', 'Bonneville T120', 'Tiger 900', 'Rocket 3', 'Trident 660'],
    'Yamaha': ['YZF-R1', 'YZF-R7', 'MT-09', 'MT-07', 'Tenere 700', 'Tracer 9 GT', 'XSR900'],
};

const categories: MotorcycleCategory[] = ['Sport', 'Cruiser', 'Off-Road', 'Touring'];

const SellForm: React.FC<SellFormProps> = ({ onBack, onPublish }) => {
  const [listingType, setListingType] = useState<'motorcycle' | 'part'>('motorcycle');

  // Moto state
  const [motoData, setMotoData] = useState({ make: '', model: '', year: '', mileage: '', engineSize: '', category: 'Sport' as MotorcycleCategory });
  
  // Part state
  const [partData, setPartData] = useState({ name: '', condition: 'new', compatibility: '' });

  // Common state
  const [commonData, setCommonData] = useState({ price: '', description: '', location: '' });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [aiKeywords, setAiKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [makeSuggestions, setMakeSuggestions] = useState<string[]>([]);
  const [modelSuggestions, setModelSuggestions] = useState<string[]>([]);
  const [isMakeFocused, setIsMakeFocused] = useState(false);
  const [isModelFocused, setIsModelFocused] = useState(false);
  const modelInputRef = useRef<HTMLInputElement>(null);

  const handleMakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMotoData(prev => ({ ...prev, make: value, model: '' }));
    if (value) {
      const filteredMakes = Object.keys(motorcycleData).filter(make =>
        make.toLowerCase().includes(value.toLowerCase())
      );
      setMakeSuggestions(filteredMakes);
    } else {
      setMakeSuggestions([]);
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMotoData(prev => ({ ...prev, model: value }));
    const makeKey = motoData.make as keyof typeof motorcycleData;
    if (value && makeKey && motorcycleData[makeKey]) {
      const filteredModels = motorcycleData[makeKey].filter(model =>
        model.toLowerCase().includes(value.toLowerCase())
      );
      setModelSuggestions(filteredModels);
    } else {
      setModelSuggestions([]);
    }
  };

  const handleSelectMake = (make: string) => {
    setMotoData(prev => ({ ...prev, make, model: '' }));
    setMakeSuggestions([]);
    setIsMakeFocused(false);
    modelInputRef.current?.focus();
  };

  const handleSelectModel = (model: string) => {
    setMotoData(prev => ({ ...prev, model }));
    setModelSuggestions([]);
    setIsModelFocused(false);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const remainingSlots = 5 - imageUrls.length;
      if (files.length > remainingSlots) {
        alert('Puedes subir un máximo de 5 imágenes. Ya tienes ${imageUrls.length}, puedes añadir ${remainingSlots} más.');
      }

      const filesToProcess = files.slice(0, remainingSlots);

      filesToProcess.forEach((file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert('Por favor, selecciona un archivo de video.');
        return;
      }

      // Check video duration
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        if (videoElement.duration > 30) {
          alert('El video no puede durar más de 30 segundos.');
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            setVideoUrl(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      videoElement.src = URL.createObjectURL(file);
    }
  };


  const handleGenerateDescription = useCallback(async () => {
    setIsGenerating(true);
    let keywords = '';
    if (listingType === 'motorcycle') {
        keywords = `Motorcycle. Make: ${motoData.make}, Model: ${motoData.model}, Year: ${motoData.year}, Extra notes: ${aiKeywords}`;
    } else {
        keywords = `Motorcycle part. Name: ${partData.name}, Condition: ${partData.condition}, Extra notes: ${aiKeywords}`;
    }
    const generatedDesc = await generateAdDescription(keywords);
    setCommonData(prev => ({ ...prev, description: generatedDesc }));
    setIsGenerating(false);
  }, [listingType, motoData, partData, aiKeywords]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrls.length === 0) {
        alert('Por favor, sube al menos una foto.');
        return;
    }

    if (listingType === 'motorcycle') {
        const { make, model, year, mileage, engineSize, category } = motoData;
        const { price, description, location } = commonData;
        if (!make || !model || !year || !price || !mileage || !engineSize || !description || !location) {
            alert('Por favor, completa todos los campos para la moto.');
            return;
        }
        onPublish({
            make, model, location, videoUrl: videoUrl || undefined,
            year: parseInt(year, 10),
            price: parseFloat(price),
            mileage: parseInt(mileage, 10),
            engineSize: parseInt(engineSize, 10),
            description, imageUrls,
            category
        }, 'motorcycle');
    } else {
        const { name, condition, compatibility } = partData;
        const { price, description, location } = commonData;
        if (!name || !price || !description || !location || !compatibility) {
            alert('Por favor, completa todos los campos para la pieza.');
            return;
        }
        onPublish({
            name, location, price: parseFloat(price), description, videoUrl: videoUrl || undefined,
            condition: condition as 'new' | 'used' | 'refurbished',
            compatibility: compatibility.split(',').map(item => item.trim()),
            imageUrls
        }, 'part');
    }
  };

  const formIsFilledForAI = listingType === 'motorcycle' ? motoData.make && motoData.model && motoData.year : partData.name;

  return (
    <div className="p-4 max-w-2xl mx-auto animate-view-transition">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
            <label className="block text-sm font-medium text-foreground-light dark:text-foreground-dark mb-2">¿Qué quieres vender?</label>
            <div className="flex w-full bg-card-light dark:bg-card-dark p-1 rounded-full border border-border-light dark:border-border-dark">
                <button type="button" onClick={() => setListingType('motorcycle')} className={`w-1/2 py-2 rounded-full text-sm font-bold transition-colors ${listingType === 'motorcycle' ? 'bg-primary text-white' : 'text-foreground-light dark:text-foreground-dark'}`}>
                    Una Moto
                </button>
                <button type="button" onClick={() => setListingType('part')} className={`w-1/2 py-2 rounded-full text-sm font-bold transition-colors ${listingType === 'part' ? 'bg-primary text-white' : 'text-foreground-light dark:text-foreground-dark'}`}>
                    Una Pieza
                </button>
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground-light dark:text-foreground-dark mb-2">Fotos y Video</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {imageUrls.map((url, index) => (
                <div key={index} className="relative aspect-square">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg"/>
                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors" aria-label="Eliminar imagen">
                    <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
                ))}
                {imageUrls.length < 5 && (
                <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-border-light dark:border-border-dark rounded-lg cursor-pointer hover:bg-black/[.03] dark:hover:bg-white/[.05] transition-colors">
                    <UploadIcon className="w-8 h-8 text-foreground-muted-light dark:text-foreground-muted-dark"/>
                    <span className="text-xs text-center text-foreground-muted-light dark:text-foreground-muted-dark mt-1">Añadir foto</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
                )}
            </div>
            
            <div className="mt-4">
                 {videoUrl ? (
                    <div className="relative aspect-video">
                        <video src={videoUrl} controls className="w-full h-full object-cover rounded-lg" />
                        <button type="button" onClick={() => setVideoUrl(null)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors" aria-label="Eliminar video">
                        <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                    ) : (
                    <label className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg cursor-pointer hover:bg-black/[.03] dark:hover:bg-white/[.05] transition-colors">
                        <PlayIcon className="w-8 h-8 text-foreground-muted-light dark:text-foreground-muted-dark"/>
                        <span className="text-sm text-center text-foreground-muted-light dark:text-foreground-muted-dark mt-2">Añadir video (max 30s)</span>
                        <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                    </label>
                )}
            </div>
        </div>

        {listingType === 'motorcycle' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input type="text" name="make" placeholder="Marca" onChange={handleMakeChange} onFocus={() => setIsMakeFocused(true)} onBlur={() => setTimeout(() => setIsMakeFocused(false), 150)} value={motoData.make} className="form-input" required autoComplete="off" />
                {isMakeFocused && makeSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {makeSuggestions.map(suggestion => (
                      <div key={suggestion} onMouseDown={(e) => { e.preventDefault(); handleSelectMake(suggestion); }} className="px-4 py-2 cursor-pointer hover:bg-primary/10">{suggestion}</div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <input type="text" name="model" placeholder="Modelo" onChange={handleModelChange} onFocus={() => { setIsModelFocused(true); const makeKey = motoData.make as keyof typeof motorcycleData; if (makeKey && motorcycleData[makeKey]) { setModelSuggestions(motorcycleData[makeKey]); } }} onBlur={() => setTimeout(() => setIsModelFocused(false), 150)} value={motoData.model} className="form-input" required ref={modelInputRef} disabled={!motoData.make || !motorcycleData.hasOwnProperty(motoData.make)} autoComplete="off" />
                {isModelFocused && modelSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {modelSuggestions.map(suggestion => (
                      <div key={suggestion} onMouseDown={(e) => { e.preventDefault(); handleSelectModel(suggestion); }} className="px-4 py-2 cursor-pointer hover:bg-primary/10">{suggestion}</div>
                    ))}
                  </div>
                )}
              </div>
              <input type="number" name="year" placeholder="Año" onChange={(e) => setMotoData(p => ({...p, year: e.target.value}))} value={motoData.year} className="form-input" required />
              <input type="number" name="mileage" placeholder="Kilometraje (km)" onChange={(e) => setMotoData(p => ({...p, mileage: e.target.value}))} value={motoData.mileage} className="form-input" required />
              <input type="number" name="engineSize" placeholder="Cilindrada (cc)" onChange={(e) => setMotoData(p => ({...p, engineSize: e.target.value}))} value={motoData.engineSize} className="form-input" required />
              <select name="category" onChange={(e) => setMotoData(p => ({...p, category: e.target.value as MotorcycleCategory}))} value={motoData.category} className="form-input dark:bg-card-dark dark:text-foreground-dark" required>
                {categories.map(category => (
                  <option key={category} value={category} className="dark:bg-card-dark dark:text-foreground-dark">{category}</option>
                ))}
              </select>
            </div>
        ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Nombre de la pieza" onChange={(e) => setPartData(p => ({...p, name: e.target.value}))} value={partData.name} className="form-input md:col-span-2" required />
                 <select name="condition" onChange={(e) => setPartData(p => ({...p, condition: e.target.value}))} value={partData.condition} className="form-input dark:bg-card-dark dark:text-foreground-dark" required>
                    <option value="new" className="dark:bg-card-dark dark:text-foreground-dark">Nueva</option>
                    <option value="used" className="dark:bg-card-dark dark:text-foreground-dark">Usada</option>
                    <option value="refurbished" className="dark:bg-card-dark dark:text-foreground-dark">Restaurada</option>
                 </select>
                <input type="text" name="compatibility" placeholder="Compatibilidad (ej: Yamaha MT-07)" onChange={(e) => setPartData(p => ({...p, compatibility: e.target.value}))} value={partData.compatibility} className="form-input" required />
            </div>
        )}

        <input type="number" name="price" placeholder="Precio ($)" onChange={(e) => setCommonData(p => ({...p, price: e.target.value}))} value={commonData.price} className="form-input" required />
        <input type="text" name="location" placeholder="Ubicación (ej: Madrid, España)" onChange={(e) => setCommonData(p => ({...p, location: e.target.value}))} value={commonData.location} className="form-input" required />
        
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark space-y-3">
            <p className="font-bold">Descripción con IA (Opcional)</p>
            <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark">Añade notas para que la IA cree una descripción atractiva.</p>
            <input type="text" placeholder="Ej: único dueño, escape Akrapovic..." value={aiKeywords} onChange={(e) => setAiKeywords(e.target.value)} className="form-input" />
            <button type="button" onClick={handleGenerateDescription} disabled={!formIsFilledForAI || isGenerating} className="w-full flex items-center justify-center gap-2 bg-primary/20 text-primary font-bold py-2 px-4 rounded-lg hover:bg-primary/30 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                {isGenerating ? <Spinner /> : '✨'}
                {isGenerating ? 'Generando...' : 'Generar Descripción'}
            </button>
        </div>

        <textarea name="description" rows={6} placeholder="Descripción del anuncio..." onChange={(e) => setCommonData(p => ({...p, description: e.target.value}))} value={commonData.description} className="form-input" required />

        <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity duration-300 text-lg">
          Publicar Anuncio
        </button>
      </form>
      <style>{`.form-input { width: 100%; background-color: transparent; border: 1px solid #2a3c46; border-radius: 0.75rem; padding: 0.75rem 1rem; color: inherit; transition: all 0.2s; } .form-input:focus { outline: none; border-color: #1193d4; box-shadow: 0 0 0 2px rgba(17, 147, 212, 0.5); } select.form-input { color: #0a0a0a; /* Dark text for better contrast */ background-color: #ffffff; /* Ensure light background */ } select.form-input.dark { color: #f0f0f0; /* Light text for dark mode */ background-color: #1a1a1a; /* Dark background for dark mode */ } @media (prefers-color-scheme: dark) { select.form-input:not(.dark) { color: #f0f0f0; background-color: #1a1a1a; } }`}</style>
    </div>
  );
};

export default SellForm;