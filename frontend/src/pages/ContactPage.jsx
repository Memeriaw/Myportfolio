import ContactForm from '../components/ContactForm';
import SectionTitle from '../components/SectionTitle';

export default function ContactPage() {
  return (
    <div className="page-shell">
      <section className="section-block">
        <div className="container contact-layout">
          <div>
            <SectionTitle eyebrow="Contact" title="Let’s Connect" description="I’m open to freelance work, collaborations, and learning opportunities." />
            <div className="contact-links">
              <a href="mailto:memeriawadugnaw@gmail.com">memeriawadugnaw@gmail.com</a>
              <a href="https://github.com/Memeriaw" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://t.me/Lectern21" target="_blank" rel="noreferrer">Telegram</a>
              <a href="https://www.youtube.com/@Elman_united" target="_blank" rel="noreferrer">YouTube</a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
