import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, FileText, X, GripVertical, Download, Plus, File as FileIcon, Loader2 } from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';

interface PDFFile {
    id: string;
    file: File;
}

// Simple Ad Placeholder Component
const AdPlaceholder = ({ className, label }: { className?: string, label?: string }) => (
    <div className={`bg-gray-800/50 border border-gray-700/50 border-dashed rounded-lg flex items-center justify-center text-gray-600 text-xs overflow-hidden ${className}`}>
        <span className="opacity-50">{label || "Ad Space"}</span>
    </div>
);

export default function App() {
    const [files, setFiles] = useState<PDFFile[]>([]);
    const [isMerging, setIsMerging] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const newFiles = Array.from(e.dataTransfer.files)
                .filter(file => {
                    const isPdfType = file.type === 'application/pdf';
                    const isPdfExt = file.name.toLowerCase().endsWith('.pdf');
                    return isPdfType || isPdfExt;
                })
                .map(file => ({ id: Math.random().toString(36).substr(2, 9), file }));
            setFiles(prev => [...prev, ...newFiles]);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const newFiles = Array.from(e.target.files)
                .filter(file => {
                    const isPdfType = file.type === 'application/pdf';
                    const isPdfExt = file.name.toLowerCase().endsWith('.pdf');
                    return isPdfType || isPdfExt;
                })
                .map(file => ({ id: Math.random().toString(36).substr(2, 9), file }));
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const mergePdfs = async () => {
        if (files.length < 2) return;
        setIsMerging(true);
        try {
            console.log('Starting merge process...');
            const mergedPdf = await PDFDocument.create();

            for (const pdfFile of files) {
                console.log(`Loading: ${pdfFile.file.name}`);
                const arrayBuffer = await pdfFile.file.arrayBuffer();

                let pdf;
                try {
                    pdf = await PDFDocument.load(arrayBuffer);
                } catch (e) {
                    console.warn(`File ${pdfFile.file.name} appears protected, trying with ignoreEncryption...`);
                    pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

                    // If we had to use ignoreEncryption, it's highly likely the pages will be blank
                    // if they use standard PDF encryption that pdf-lib can't decrypt.
                }

                const pageIndices = pdf.getPageIndices();
                console.log(`Copying ${pageIndices.length} pages from ${pdfFile.file.name}`);

                const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            console.log('Saving merged PDF...');
            // Use Uint8Array directly for saving
            const pdfBytes = await mergedPdf.save();

            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `merged_${new Date().getTime()}.pdf`;
            document.body.appendChild(link);

            // Dispatch a click event instead of calling .click() directly
            // This is often more reliable in modern browsers
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
            });
            link.dispatchEvent(clickEvent);

            // Keep the timeout generous to be safe
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 10000); // 10s to ensure Chrome has time to "lock" the download

        } catch (error) {
            console.error('Error merging PDFs:', error);
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            alert(`Failed to merge PDFs: ${message}\n\nNote: Some Certified PDFs (like official diplomas) have security features that prevent merging and may result in blank pages.`);
        } finally {
            setIsMerging(false);
        }
    };

    return (
        <div className="min-h-screen p-8 flex flex-col items-center justify-between pb-4">
            {/* Top Ad Placeholder - Optional, or just keep layout centered. sticking to internal content for likely cleaner look */}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl flex-1 flex flex-col justify-center"
            >
                <header className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        100% Secure & Client-Side
                    </div>
                    <h1 className="text-5xl font-bold mb-4 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        PDF Merger
                    </h1>
                    <p className="text-gray-400 text-lg max-w-lg mx-auto">
                        Combine your PDFs instantly. Your files <strong className="text-gray-200">never</strong> leave your device and are processed entirely in your browser.
                    </p>
                </header>

                <div className="glass-card p-8 mb-8 relative">
                    <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    />

                    <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors duration-300 ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700'}`}>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 mb-4">
                            <Upload size={32} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-200">
                            {dragActive ? 'Drop them here!' : 'Click or drag PDFs here'}
                        </h3>
                        <p className="text-gray-500">
                            Only PDF files are supported
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <Reorder.Group axis="y" values={files} onReorder={setFiles}>
                        <AnimatePresence mode="popLayout">
                            {files.map((file) => (
                                <Reorder.Item
                                    key={file.id}
                                    value={file}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="glass-card mb-4 flex items-center p-4 group cursor-grab active:cursor-grabbing"
                                >
                                    <div className="mr-4 text-gray-500 group-hover:text-gray-300 transition-colors">
                                        <GripVertical size={20} />
                                    </div>
                                    <div className="mr-4 p-2 rounded-lg bg-red-500/10 text-red-400">
                                        <FileIcon size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-200 truncate">
                                            {file.file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeFile(file.id)}
                                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </Reorder.Item>
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>
                </div>

                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 flex flex-col items-center gap-6"
                    >
                        <button
                            onClick={mergePdfs}
                            disabled={files.length < 2 || isMerging}
                            className={`primary-button px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                        >
                            {isMerging ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Merging PDFs...</span>
                                </>
                            ) : (
                                <>
                                    <Download size={20} />
                                    <span>Merge and Download</span>
                                </>
                            )}
                        </button>

                        {/* Inline Ad Placeholder below button */}
                        <AdPlaceholder className="w-[300px] h-[250px] hidden sm:flex" label="Advertisement (300x250)" />
                    </motion.div>
                )}
            </motion.div>

            {/* Footer Ad Placeholder */}
            <div className="w-full max-w-[728px] mt-8 relative z-0">
                <AdPlaceholder className="w-full h-[90px]" label="Advertisement (728x90)" />
            </div>
        </div>
    );
}
