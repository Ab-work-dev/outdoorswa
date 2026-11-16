import type {Metadata} from 'next';import './globals.css';
export const metadata:Metadata={title:'Outdoors WA | Ecosystem Explorer',description:'Research database for WA outdoor activities, organisations and locations'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
