import { ClientOnly } from './client';
export function generateStaticParams() {
    return [
      { slug: ['dashboard'] },    
      { slug: ['login'] },        
      { slug: [] },               
    ];
  }
  
  export default function Page({ params }) {
    const { slug } = params;
  
    if (slug && slug[0] === 'dashboard') {
      return <ClientOnly />;
    }
  
    if (slug && slug[0] === 'login') {
        return <ClientOnly />;
    }
  }
  