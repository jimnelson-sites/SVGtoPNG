import React, { useState, useCallback, useEffect } from 'react';
import { ConversionStatus } from './types';
import { FileUpload } from './components/FileUpload';
import { ResultDisplay } from './components/ResultDisplay';

const Spinner = () => (
    <svg className="animate-spin h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

function App() {
    const [status, setStatus] = useState<ConversionStatus>(ConversionStatus.IDLE);
    const [svgFile, setSvgFile] = useState<File | null>(null);
    const [svgPreviewUrl, setSvgPreviewUrl] = useState<string | null>(null);
    const [pngPreviewUrl, setPngPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

    const resetState = useCallback(() => {
        setStatus(ConversionStatus.IDLE);
        setSvgFile(null);
        setSvgPreviewUrl(null);
        setPngPreviewUrl(null);
        setError(null);
        setDimensions(null);
    }, []);
    
    const handleFileSelect = useCallback((file: File) => {
        if (file.type !== 'image/svg+xml' && !file.name.endsWith('.svg')) {
            setError('Invalid file type. Please upload an SVG file.');
            setStatus(ConversionStatus.ERROR);
            return;
        }
        resetState();
        setSvgFile(file);
        setStatus(ConversionStatus.CONVERTING);
    }, [resetState]);

    useEffect(() => {
        if (!svgFile || status !== ConversionStatus.CONVERTING) return;

        let isCancelled = false;

        const reader = new FileReader();
        reader.onload = (e) => {
            if (isCancelled || !e.target?.result) return;
            
            const svgDataUrl = e.target.result as string;
            setSvgPreviewUrl(svgDataUrl);

            const img = new Image();
            img.onload = () => {
                if (isCancelled) return;
                
                const { naturalWidth, naturalHeight } = img;
                const width = naturalWidth > 0 ? naturalWidth : 300;
                const height = naturalHeight > 0 ? naturalHeight : 150;

                setDimensions({ width, height });

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    const pngDataUrl = canvas.toDataURL('image/png');
                    setPngPreviewUrl(pngDataUrl);
                    setStatus(ConversionStatus.SUCCESS);
                } else {
                    setError('Could not get canvas context for conversion.');
                    setStatus(ConversionStatus.ERROR);
                }
            };
            img.onerror = () => {
                if (isCancelled) return;
                setError('Could not load the SVG. The file might be invalid or contain unsupported features.');
                setStatus(ConversionStatus.ERROR);
            };
            img.src = svgDataUrl;
        };
        reader.onerror = () => {
            if (isCancelled) return;
            setError('Failed to read the selected file.');
            setStatus(ConversionStatus.ERROR);
        };
        
        reader.readAsDataURL(svgFile);

        return () => {
            isCancelled = true;
        };
    }, [svgFile, status]);
    
    const renderContent = () => {
        switch (status) {
            case ConversionStatus.CONVERTING:
                return (
                    <div className="flex flex-col items-center justify-center text-center">
                        <Spinner />
                        <p className="mt-4 text-lg font-medium text-slate-300">Converting your SVG...</p>
                        <p className="text-sm text-slate-400">Please wait a moment.</p>
                    </div>
                );
            case ConversionStatus.SUCCESS:
                return (
                    svgPreviewUrl && pngPreviewUrl && dimensions && svgFile &&
                    <ResultDisplay 
                        svgPreviewUrl={svgPreviewUrl}
                        pngPreviewUrl={pngPreviewUrl}
                        fileName={svgFile.name}
                        dimensions={dimensions}
                        onReset={resetState}
                    />
                );
            case ConversionStatus.ERROR:
                return (
                    <div className="flex flex-col items-center justify-center text-center">
                        <ErrorIcon />
                        <p className="mt-4 text-lg font-semibold text-red-400">Conversion Failed</p>
                        <p className="mt-1 text-sm text-slate-400 max-w-sm">{error}</p>
                        <button 
                            onClick={resetState}
                            className="mt-6 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-slate-900 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                );
            case ConversionStatus.IDLE:
            default:
                return <FileUpload onFileSelect={handleFileSelect} />;
        }
    }

    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-900 selection:bg-indigo-500/30">
            <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')"}}></div>
            <div className="relative w-full max-w-2xl mx-auto z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        SVG to PNG Converter
                    </h1>
                    <p className="mt-3 max-w-lg mx-auto text-lg text-slate-400">
                        Instantly convert your SVG images to high-quality PNG format, right in your browser.
                    </p>
                </div>
                <div className="relative p-6 sm:p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-slate-950/50 ring-1 ring-white/10">
                    <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 opacity-0 transition-opacity duration-500" aria-hidden="true" style={{opacity: status === ConversionStatus.SUCCESS ? 1 : 0}}></div>
                    <div className="relative min-h-[250px] flex items-center justify-center">
                        {renderContent()}
                    </div>
                </div>
                <footer className="text-center mt-8">
                    <p className="text-sm text-slate-500">
                        All conversions are done locally in your browser. Your files are never uploaded.
                    </p>
                </footer>
            </div>
        </main>
    );
}

export default App;
