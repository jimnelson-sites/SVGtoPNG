import React from 'react';

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7V9a1 1 0 01-2 0V3a1 1 0 011-1zm.004 9.053a1 1 0 01.886.52A5.002 5.002 0 0014.001 13V11a1 1 0 112 0v5a1 1 0 01-1 1h-5a1 1 0 110-2h2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.52-.886z" clipRule="evenodd" />
    </svg>
);

interface ResultDisplayProps {
    svgPreviewUrl: string;
    pngPreviewUrl: string;
    fileName: string;
    dimensions: { width: number; height: number };
    onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ svgPreviewUrl, pngPreviewUrl, fileName, dimensions, onReset }) => {
    
    const pngFileName = fileName.replace(/\.svg$/, '.png');

    return (
        <div className="w-full flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-slate-300 mb-3">Original SVG</h3>
                    <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 w-full aspect-square flex items-center justify-center">
                        <img src={svgPreviewUrl} alt="Original SVG Preview" className="max-w-full max-h-full" />
                    </div>
                    <p className="text-sm text-slate-400 mt-2">{dimensions.width} x {dimensions.height} px</p>
                </div>
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-slate-300 mb-3">Converted PNG</h3>
                     <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 w-full aspect-square flex items-center justify-center">
                        <img src={pngPreviewUrl} alt="Converted PNG Preview" className="max-w-full max-h-full" />
                    </div>
                     <p className="text-sm text-slate-400 mt-2">{dimensions.width} x {dimensions.height} px</p>
                </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a
                    href={pngPreviewUrl}
                    download={pngFileName}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all duration-300 shadow-lg shadow-indigo-500/30"
                >
                    <DownloadIcon />
                    Download PNG
                </a>
                 <button
                    onClick={onReset}
                    className="inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-base font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 transition-all duration-300"
                >
                    <RefreshIcon />
                    Convert Another
                </button>
            </div>
        </div>
    );
};
