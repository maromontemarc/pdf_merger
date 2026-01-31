import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
    return (
        <div className="p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >


                <div className="glass-card p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                            <FileText size={32} />
                        </div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                            Terms of Service
                        </h1>
                    </div>

                    <div className="space-y-6 text-gray-300 leading-relaxed">
                        <p className="text-sm text-gray-500">Last updated: January 17, 2026</p>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using PDF Merger ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">2. Description of Service</h2>
                            <p>
                                PDF Merger is a free, browser-based tool that allows you to combine multiple PDF documents into a single file. The service operates entirely within your web browser using client-side technology:
                            </p>
                            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-400">
                                <li>All file processing occurs locally on your device</li>
                                <li>No files are uploaded to our servers</li>
                                <li>The service is provided free of charge</li>
                                <li>No account registration is required</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">3. Acceptable Use</h2>
                            <p>
                                You agree to use PDF Merger only for lawful purposes. You may not use the service to:
                            </p>
                            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-400">
                                <li>Process documents that you do not have the right to access or modify</li>
                                <li>Violate any intellectual property rights or copyrights</li>
                                <li>Attempt to circumvent any security features or access controls</li>
                                <li>Interfere with or disrupt the service or its hosting infrastructure</li>
                                <li>Use automated tools to access the service in a manner that creates excessive load</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">4. Intellectual Property</h2>
                            <p>
                                The PDF Merger website, including its design, code, and content (excluding user-provided documents), is protected by copyright and other intellectual property laws. You may not copy, modify, or distribute our code without permission.
                            </p>
                            <p className="mt-3">
                                Documents you process using our service remain your property. We make no claim to any content you create or modify using PDF Merger.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">5. Disclaimer of Warranties</h2>
                            <p>
                                PDF Merger is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that:
                            </p>
                            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-400">
                                <li>The service will be uninterrupted, secure, or error-free</li>
                                <li>Results will be accurate or reliable</li>
                                <li>All PDF files will be compatible with our merging technology</li>
                                <li>The service will meet your specific requirements</li>
                            </ul>
                            <p className="mt-3">
                                Some PDF files with advanced security features, encryption, or complex formatting may not merge correctly. This is a limitation of browser-based PDF processing technology.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">6. Limitation of Liability</h2>
                            <p>
                                To the maximum extent permitted by law, PDF Merger and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                            </p>
                            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-400">
                                <li>Loss of data or documents</li>
                                <li>Loss of profits or business opportunities</li>
                                <li>Damages resulting from reliance on the service</li>
                                <li>Any errors or omissions in processed documents</li>
                            </ul>
                            <p className="mt-3 text-amber-400">
                                <strong>Important:</strong> Always keep backup copies of your original PDF files before merging.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">7. Third-Party Advertising</h2>
                            <p>
                                PDF Merger displays advertisements through Google AdSense. These ads are provided by third parties and are subject to their own terms and policies. We are not responsible for the content, accuracy, or opinions expressed in these advertisements.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">8. Service Modifications</h2>
                            <p>
                                We reserve the right to modify, suspend, or discontinue the service at any time without prior notice. We may also modify these Terms of Service at any time. Continued use of the service after changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">9. Governing Law</h2>
                            <p>
                                These Terms of Service shall be governed by and construed in accordance with applicable laws, without regard to conflicts of law principles.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">10. Contact</h2>
                            <p>
                                If you have any questions about these Terms of Service, please contact us through our website.
                            </p>
                        </section>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
