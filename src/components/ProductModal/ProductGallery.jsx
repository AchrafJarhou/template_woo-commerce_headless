import { useState } from "react";
import { useTranslation } from "react-i18next";

// Affichée quand l'article n'a aucune photo — la modale s'en servait déjà.
const PLACEHOLDER_SRC = "https://placeholder.pics/svg/300";

/* Largeur à laquelle une vignette est dessinée (.modal-gallery__thumb, dans
   index.css). Le navigateur s'en sert pour choisir dans `srcset` le plus petit
   fichier qui reste net : une vignette pèse alors quelques dizaines de Ko au
   lieu du fichier d'origine, qui dépasse le Mo. Les deux valeurs doivent
   rester d'accord. */
const THUMB_SIZES = "56px";

/**
 * Photos d'un article : la photo choisie en grand, et sous elle une vignette
 * par photo — l'image principale puis la galerie, dans l'ordre de WordPress.
 *
 * Un article à photo unique n'affiche aucune vignette, et sa mise en page
 * reste celle d'avant.
 *
 * @param {Array}  images photos du produit (product.images)
 * @param {string} alt    texte alternatif de la grande photo — le nom de
 *                        l'article, dans la langue affichée
 */
export default function ProductGallery({ images = [], alt }) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const hasGallery = images.length > 1;

  return (
    <div
      className={
        hasGallery
          ? "modal-img-container modal-img-container--gallery"
          : "modal-img-container"
      }
    >
      <img
        src={images[activeIndex]?.src || PLACEHOLDER_SRC}
        alt={alt}
        className="modal-img"
      />

      {hasGallery && (
        <div
          className="modal-gallery"
          role="group"
          aria-label={t("product.gallery.label")}
        >
          {images.map((image, index) => (
            <button
              /* La liste ne change jamais d'ordre : l'index suffit comme clé,
                 et il reste unique même si une photo figure deux fois. */
              key={index}
              type="button"
              className="modal-gallery__thumb"
              aria-label={t("product.gallery.show", {
                index: index + 1,
                count: images.length,
              })}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            >
              {/* Le bouton porte déjà le nom : l'image est décorative. */}
              <img
                src={image.src}
                srcSet={image.srcset || undefined}
                sizes={image.srcset ? THUMB_SIZES : undefined}
                alt=""
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
