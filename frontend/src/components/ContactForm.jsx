import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Unable to send message.');
      }

      setStatus({ type: 'success', message: payload.message || 'Message sent successfully.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="grid two-col">
        <label>
          <span>Name</span>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          <span>Email</span>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
      </div>

      <label>
        <span>Subject</span>
        <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
      </label>

      <label>
        <span>Message</span>
        <textarea name="message" rows="5" value={formData.message} onChange={handleChange} required />
      </label>

      {status.message && <div className={`status-box ${status.type}`}>{status.message}</div>}

      <button type="submit" className="button primary" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
