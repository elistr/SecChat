import './globals.css';

export const metadata = {
  title: 'SecChat - Slack-like Chat Application',
  description: 'A real-time chat application with bot responses',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#000000] flex items-center justify-center">
        <div className="w-[80%] h-[85vh] bg-[#003087] rounded-xl shadow-2xl overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
} 