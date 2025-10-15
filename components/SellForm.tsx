import React, { useState, useCallback } from 'react';
import { Motorcycle } from '../types';
import { generateAdDescription } from '../services/geminiService';
import Spinner from './Spinner';
import { UploadIcon, TrashIcon } from './Icons';

interface SellFormProps {
  onBack: () => void;
  onPublish: (moto: Omit<Motorcycle, 'id' | 'sellerEmail' | 'category'>) => void;
}

const SellForm: React.FC<SellFormProps> = ({ onBack, onPublish }) => {
  const [formData, setFormData] = useState({
    make: '', model: '', year: '', price: '', mileage: '', engineSize: '', description: '',
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [aiKeywords, setAiKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const remainingSlots = 5 - imageUrls.length;
      if (files.length > remainingSlots) {
        alert(`Puedes subir un máximo de 5 imágenes. Ya tienes ${imageUrls.length}, puedes añadir ${remainingSlots} más.`);
      }

      const filesToProcess = files.slice(0, remainingSlots);

      // FIX: Explicitly type `file` as `File` to resolve type errors on `file.type` and `readAsDataURL(file)`.
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

  const handleGenerateDescription = useCallback(async () => {
    setIsGenerating(true);
    const keywords = `Make: ${formData.make}, Model: ${formData.model}, Year: ${formData.year}, Extra notes: ${aiKeywords}`;
    const generatedDesc = await generateAdDescription(keywords);
    setFormData(prev => ({ ...prev, description: generatedDesc }));
    setIsGenerating(false);
  }, [formData.make, formData.model, formData.year, aiKeywords]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { make, model, year, price, mileage, engineSize, description } = formData;
    if (!make || !model || !year || !price || !mileage || !engineSize || !description) {
        alert('Por favor, completa todos los campos.');
        return;
    }
    if (imageUrls.length === 0) {
        alert('Por favor, sube al menos una foto de la moto.');
        return;
    }
    onPublish({
      make, model,
      year: parseInt(year, 10),
      price: parseFloat(price),
      mileage: parseInt(mileage, 10),
      engineSize: parseInt(engineSize, 10),
      description,
      imageUrls,
    });
  };

  const formIsFilledForAI = formData.make && formData.model && formData.year;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground-light dark:text-foreground-dark mb-2">Fotos (hasta 5)</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg"/>
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
                  aria-label="Eliminar imagen"
                >
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="make" placeholder="Marca" onChange={handleChange} value={formData.make} className="form-input" required />
          <input type="text" name="model" placeholder="Modelo" onChange={handleChange} value={formData.model} className="form-input" required />
          <input type="number" name="year" placeholder="Año" onChange={handleChange} value={formData.year} className="form-input" required />
          <input type="number" name="price" placeholder="Precio ($)" onChange={handleChange} value={formData.price} className="form-input" required />
          <input type="number" name="mileage" placeholder="Kilometraje (km)" onChange={handleChange} value={formData.mileage} className="form-input" required />
          <input type="number" name="engineSize" placeholder="Cilindrada (cc)" onChange={handleChange} value={formData.engineSize} className="form-input" required />
        </div>
        
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark space-y-3">
            <p className="font-bold">Descripción con IA (Opcional)</p>
            <p className="text-sm text-foreground-muted-light dark:text-foreground-muted-dark">Añade notas para que la IA cree una descripción atractiva.</p>
            <input 
                type="text" 
                placeholder="Ej: único dueño, escape Akrapovic..."
                value={aiKeywords}
                onChange={(e) => setAiKeywords(e.target.value)}
                className="form-input"
            />
            <button 
                type="button" 
                onClick={handleGenerateDescription}
                disabled={!formIsFilledForAI || isGenerating}
                className="w-full flex items-center justify-center gap-2 bg-primary/20 text-primary font-bold py-2 px-4 rounded-lg hover:bg-primary/30 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGenerating ? <Spinner /> : '✨'}
                {isGenerating ? 'Generando...' : 'Generar Descripción'}
            </button>
        </div>

        <textarea
            name="description"
            rows={6}
            placeholder="Descripción del anuncio..."
            onChange={handleChange}
            value={formData.description}
            className="form-input"
            required
        />

        <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity duration-300 text-lg">
          Publicar Anuncio
        </button>
      </form>
      <style>{`.form-input { width: 100%; background-color: transparent; border: 1px solid #2a3c46; border-radius: 0.75rem; padding: 0.75rem 1rem; color: inherit; transition: all 0.2s; } .form-input:focus { outline: none; border-color: #1193d4; box-shadow: 0 0 0 2px rgba(17, 147, 212, 0.5); }`}</style>
    </div>
  );
};

export default SellForm;