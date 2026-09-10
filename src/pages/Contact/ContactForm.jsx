import { useState } from "react";
import "./ContactForm.css";
import { useTranslation } from "react-i18next";

export default function ContactForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/custom/v1/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.message });
        }
      }
    } catch (error) {
      setErrors({ general: "Erreur réseau. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {success && (
        <div className="contact-form__message contact-form__message--success">
          {t("contact.sent")}
        </div>
      )}

      {errors.general && (
        <div className="contact-form__message contact-form__message--error">
          {errors.general}
        </div>
      )}

      <div className="contact-form__group">
        <label htmlFor="name">{t("contact.name")} *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t("contact.namePlaceholder")}
          disabled={loading}
          aria-invalid={!!errors.name}
        />
        {errors.name && <span className="contact-form__error">{errors.name}</span>}
      </div>

      <div className="contact-form__group">
        <label htmlFor="email">{t("common.email")} *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t("auth.emailPlaceholder")}
          disabled={loading}
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className="contact-form__error">{errors.email}</span>}
      </div>

      <div className="contact-form__group">
        <label htmlFor="message">{t("contact.message")} *</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t("contact.messagePlaceholder")}
          rows="6"
          disabled={loading}
          aria-invalid={!!errors.message}
        />
        {errors.message && <span className="contact-form__error">{errors.message}</span>}
      </div>

      <button type="submit" className="contact-form__button" disabled={loading}>
        {loading ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}
