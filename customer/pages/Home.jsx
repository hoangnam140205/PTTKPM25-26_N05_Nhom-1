import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="animate-fade-in">
      <section style={{
        minHeight: '80vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.1) 0%, rgba(13, 15, 18, 1) 100%)',
        textAlign: 'center', padding: '0 2rem'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <h1 className="heading-1" style={{ marginBottom: '1.5rem', fontSize: '4.5rem' }}>
            Culinary Excellence <br/> meets Modern Elegance
          </h1>
          <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Experience a symphony of flavors curated by world-class chefs, served in an atmosphere of unparalleled sophistication.
          </p>
          <Link to="/menu" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Explore Our Menu <ArrowRight size={20} />
          </Link>
        </div>
      </section>
      
      <section className="container" style={{ padding: '4rem 2rem' }}>
        <div className="grid-cards">
          {[
            { title: 'Exquisite Ingredients', desc: 'Sourced daily from local organic farms and international artisan purveyors.' },
            { title: 'Master Chefs', desc: 'Our culinary team brings decades of Michelin-starred experience.' },
            { title: 'Atmosphere', desc: 'A meticulously designed dining room that creates the perfect ambiance for any occasion.' }
          ].map((feature, i) => (
            <div key={i} className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3 className="heading-3" style={{ color: 'var(--primary-color)' }}>{feature.title}</h3>
              <p className="text-muted" style={{ marginTop: '1rem' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
