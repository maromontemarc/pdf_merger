import React, { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, FileText, X, GripVertical, Download, File as FileIcon, Loader2, Shield, Zap, Lock, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';

interface PDFFile {
    id: string;
    file: File;
}

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => (
    <motion.div
        className="glass-card overflow-hidden"
        initial={false}
    >
        <button
            onClick={onClick}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        >
            <span className="font-medium text-gray-200">{question}</span>
            {isOpen ? (
                <ChevronUp size={20} className="text-gray-400 flex-shrink-0" />
            ) : (
                <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
            )}
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    <p className="px-6 pb-6 text-gray-400 leading-relaxed">{answer}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

export default function App() {
    const [files, setFiles] = useState<PDFFile[]>([]);
    const [isMerging, setIsMerging] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [openFAQ, setOpenFAQ] = useState<number | null>(0);

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
                }

                const pageIndices = pdf.getPageIndices();
                console.log(`Copying ${pageIndices.length} pages from ${pdfFile.file.name}`);

                const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            console.log('Saving merged PDF...');
            const pdfBytes = await mergedPdf.save();

            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `merged_${new Date().getTime()}.pdf`;
            document.body.appendChild(link);

            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
            });
            link.dispatchEvent(clickEvent);

            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 10000);

        } catch (error) {
            console.error('Error merging PDFs:', error);
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            alert(`Failed to merge PDFs: ${message}\n\nNote: Some Certified PDFs (like official diplomas) have security features that prevent merging and may result in blank pages.`);
        } finally {
            setIsMerging(false);
        }
    };

    const faqItems = [
        {
            question: "How does PDF Merger work?",
            answer: "PDF Merger uses advanced JavaScript technology (pdf-lib) to process your PDF files directly in your web browser. When you upload files, they are read into memory on your device, combined in the order you specify, and the merged result is generated locally. No data is ever sent to external servers."
        },
        {
            question: "Is my data secure when using this tool?",
            answer: "Absolutely! Your files never leave your device. All PDF processing happens entirely within your browser using client-side JavaScript. We don't have servers that receive or store your documents. This makes PDF Merger one of the most secure ways to combine PDFs online."
        },
        {
            question: "Are there any file size limits?",
            answer: "Since processing happens in your browser, the limits depend on your device's available memory. Most modern computers can handle combining PDFs totaling several hundred megabytes. For very large files, ensure you have sufficient RAM available and close other browser tabs."
        },
        {
            question: "Can I reorder the PDFs before merging?",
            answer: "Yes! After uploading your PDF files, you can drag and drop them to rearrange the order. The files will be merged in the sequence shown on screen, from top to bottom."
        },
        {
            question: "Why can't I merge some PDF files?",
            answer: "Some PDFs have security restrictions or digital signatures that prevent modification. These include certified documents, digitally signed contracts, and password-protected files. While we attempt to process such files, the resulting pages may appear blank due to encryption."
        },
        {
            question: "What browsers are supported?",
            answer: "PDF Merger works on all modern web browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser for the best experience and performance."
        },
        {
            question: "Is PDF Merger really free?",
            answer: "Yes, PDF Merger is completely free to use with no hidden fees, no account registration required, and no limits on the number of files you can merge. The service is supported by non-intrusive advertisements."
        },
        {
            question: "Can I use this tool on mobile devices?",
            answer: "Yes! PDF Merger is fully responsive and works on smartphones and tablets. However, for the best experience when handling large files, we recommend using a desktop or laptop computer."
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section with Tool */}
            <section className="p-8 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl"
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
                            className="mt-8 flex flex-col items-center"
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
                        </motion.div>
                    )}
                </motion.div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-8 bg-gray-900/50">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                            How It Works
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Merging PDFs has never been easier. Our browser-based tool processes your files locally, ensuring maximum security and speed.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-8 text-center"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 mb-6">
                                <Upload size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-100">1. Upload Files</h3>
                            <p className="text-gray-400">
                                Drag and drop your PDF files or click to browse. Select as many files as you need to combine.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-8 text-center"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 mb-6">
                                <GripVertical size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-100">2. Arrange Order</h3>
                            <p className="text-gray-400">
                                Drag files to reorder them. The PDFs will be merged in the exact sequence you arrange.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="glass-card p-8 text-center"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-6">
                                <Download size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-100">3. Download</h3>
                            <p className="text-gray-400">
                                Click merge and instantly download your combined PDF. It's that simple!
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 px-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                            Why Choose PDF Merger?
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Unlike other online tools, we prioritize your privacy and security above all else.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass-card p-6 flex gap-4"
                        >
                            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 h-fit">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-100">Complete Privacy</h3>
                                <p className="text-gray-400 text-sm">
                                    Your files never leave your device. Unlike cloud-based tools that upload your sensitive documents to remote servers, PDF Merger processes everything locally in your browser. Perfect for confidential legal, medical, or personal documents.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass-card p-6 flex gap-4"
                        >
                            <div className="p-3 rounded-xl bg-yellow-500/20 text-yellow-400 h-fit">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-100">Lightning Fast</h3>
                                <p className="text-gray-400 text-sm">
                                    No upload or download wait times from slow servers. Since processing happens on your device, merging is nearly instantaneous. Large files that would take minutes to upload elsewhere are ready in seconds.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass-card p-6 flex gap-4"
                        >
                            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 h-fit">
                                <Lock size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-100">No Registration Required</h3>
                                <p className="text-gray-400 text-sm">
                                    Start merging immediately without creating an account, providing an email, or jumping through hoops. We don't track your usage or build profiles. Just open the page and start working.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass-card p-6 flex gap-4"
                        >
                            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 h-fit">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-100">Unlimited & Free</h3>
                                <p className="text-gray-400 text-sm">
                                    No file limits, no page limits, no watermarks, no subscriptions. Merge as many PDFs as you need, as often as you want. The tool is completely free to use and will always remain so.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-8 bg-gray-900/50">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
                            <HelpCircle size={16} />
                            Got Questions?
                        </div>
                        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-400">
                            Everything you need to know about using PDF Merger
                        </p>
                    </motion.div>

                    <div className="space-y-4">
                        {faqItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <FAQItem
                                    question={item.question}
                                    answer={item.answer}
                                    isOpen={openFAQ === index}
                                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


        </div>
    );
}
