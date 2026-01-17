import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    Back to PDF Merger
                </Link>

                <div className="glass-card p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                            Privacy Policy
                        </h1>
                    </div>

                    <div className="space-y-6 text-gray-300 leading-relaxed">
                        <p className="text-sm text-gray-500">Last updated: January 17, 2026</p>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">Introduction</h2>
                            <p>
                                Welcome to PDF Merger. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we handle data when you use our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">Data Collection and Processing</h2>
                            <p>
                                <strong className="text-emerald-400">Your files never leave your device.</strong> PDF Merger operates entirely within your web browser using client-side JavaScript technology. This means:
                            </p>
                            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-400">
                                <li>We do not upload, store, or have access to any PDF files you process</li>
                                <li>All file merging occurs locally on your computer</li>
                                <li>No file data is transmitted to our servers or any third party</li>
                                <li>Your documents remain completely private and secure</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">Information We May Collect</h2>
                            <p>
                                While we don't collect your PDF files, we may collect the following non-personal information to improve our service:
                            </p>
                            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-400">
                                <li><strong>Usage Analytics:</strong> Anonymous data about how visitors interact with our website (pages viewed, time spent, features used)</li>
                                <li><strong>Technical Information:</strong> Browser type, device type, and operating system for compatibility purposes</li>
                                <li><strong>Error Logs:</strong> Anonymous error reports to help us fix bugs and improve performance</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">Cookies and Advertising</h2>
                            <p>
                                Our website uses cookies for the following purposes:
                            </p>
                            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-400">
                                <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                                <li><strong>Advertising Cookies:</strong> Used by Google AdSense to display relevant advertisements</li>
                            </ul>
                            <p className="mt-3">
                                You can manage cookie preferences through your browser settings. For more information about how Google uses advertising cookies, please visit <a href="https://policies.google.com/technologies/ads" className="text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">Google's Advertising Policies</a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">Third-Party Services</h2>
                            <p>
                                We use the following third-party services:
                            </p>
                            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-400">
                                <li><strong>Google AdSense:</strong> For displaying advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites.</li>
                                <li><strong>Vercel:</strong> Our hosting provider, which may collect server logs for security and performance monitoring.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">Your Rights</h2>
                            <p>
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-400">
                                <li>Access information about any data we may have collected</li>
                                <li>Request deletion of any personal data</li>
                                <li>Opt out of personalized advertising</li>
                                <li>Disable cookies through your browser settings</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">Children's Privacy</h2>
                            <p>
                                Our service is not directed to children under 13 years of age. We do not knowingly collect personal information from children.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-100 mb-3">Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy or our practices, please contact us through our website.
                            </p>
                        </section>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
